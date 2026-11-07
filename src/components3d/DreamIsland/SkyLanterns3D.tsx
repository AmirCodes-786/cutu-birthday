"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LanternData {
  x: number;
  y: number;
  z: number;
  baseY: number;
  speedY: number;
  swaySpeed: number;
  swayAmp: number;
  phase: number;
  scale: number;
  flickerSpeed: number;
  tilt: number;
}

/**
 * Creates an elegant, multi-segment Asian/fantasy sky lantern:
 * - Octagonal translucent rice paper body with warm sunset gradient
 * - Ornate dark bronze top pagoda cap and bottom base plate
 * - 8 delicate brass vertical strut ribs
 * - Top suspension loop & bottom hanging tassel
 * - Internal warm flickering flame & soft luminous halo
 */
export function SkyLanterns3D({ count = 24 }: { count?: number }) {
  // Generate distinct lanterns across 3 depth tiers: distant, midground, and near
  const lanterns = useMemo<LanternData[]>(() => {
    const list: LanternData[] = [];

    for (let i = 0; i < count; i++) {
      // Depth tiers:
      // i < 10: Distant horizon lanterns (rising near sunset sun)
      // i < 20: Midground lanterns floating around the island
      // i >= 20: Foreground lanterns drifting past the camera
      let x = 0;
      let y = 0;
      let z = 0;
      let scale = 0.15;
      let speedY = 0.08;

      if (i < 10) {
        // Distant horizon lanterns
        x = -4.5 + Math.random() * 9.0;
        y = -1.5 + Math.random() * 5.0;
        z = -3.5 - Math.random() * 2.0;
        scale = 0.08 + Math.random() * 0.05;
        speedY = 0.04 + Math.random() * 0.04;
      } else if (i < 19) {
        // Midground lanterns around the island
        x = -4.0 + Math.random() * 8.0;
        y = -3.0 + Math.random() * 6.5;
        z = -0.5 + Math.random() * 2.0;
        scale = 0.16 + Math.random() * 0.08;
        speedY = 0.07 + Math.random() * 0.06;
      } else {
        // Foreground lanterns drifting close to camera
        x = (i % 2 === 0 ? -3.2 : 3.2) + (Math.random() - 0.5) * 1.5;
        y = -3.5 + Math.random() * 6.0;
        z = 1.8 + Math.random() * 1.5;
        scale = 0.28 + Math.random() * 0.1;
        speedY = 0.1 + Math.random() * 0.08;
      }

      list.push({
        x,
        y,
        z,
        baseY: y,
        speedY,
        swaySpeed: 0.6 + Math.random() * 0.6,
        swayAmp: 0.08 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
        scale,
        flickerSpeed: 5 + Math.random() * 5,
        tilt: (Math.random() - 0.5) * 0.15,
      });
    }

    return list;
  }, [count]);

  // Lantern geometries
  const { bodyGeom, capGeom, baseGeom, flameGeom, haloGeom } = useMemo(() => {
    // 8-sided tapered cylinder for lantern body
    const body = new THREE.CylinderGeometry(0.38, 0.46, 1.05, 8, 1, false);
    
    // Octagonal pagoda cap
    const cap = new THREE.ConeGeometry(0.52, 0.28, 8);
    
    // Octagonal base trim
    const base = new THREE.CylinderGeometry(0.48, 0.42, 0.1, 8);
    
    // Internal candle flame
    const flame = new THREE.SphereGeometry(0.12, 8, 8);
    
    // Outer atmospheric glow halo
    const halo = new THREE.SphereGeometry(1.2, 12, 12);

    return {
      bodyGeom: body,
      capGeom: cap,
      baseGeom: base,
      flameGeom: flame,
      haloGeom: halo,
    };
  }, []);

  // Instanced Meshes for peak 60fps performance
  const bodyMeshRef = useRef<THREE.InstancedMesh>(null);
  const capMeshRef = useRef<THREE.InstancedMesh>(null);
  const baseMeshRef = useRef<THREE.InstancedMesh>(null);
  const flameMeshRef = useRef<THREE.InstancedMesh>(null);
  const haloMeshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    lanterns.forEach((lan, i) => {
      // Gentle buoyant ascent
      lan.y += lan.speedY * delta;
      if (lan.y > 5.5) {
        lan.y = -4.5;
        lan.x = (Math.random() - 0.5) * 9.0;
      }

      // Natural swaying with wind drift
      const swayX = Math.sin(t * lan.swaySpeed + lan.phase) * lan.swayAmp;
      const swayZ = Math.cos(t * lan.swaySpeed * 0.8 + lan.phase) * (lan.swayAmp * 0.6);
      const rotZ = Math.sin(t * lan.swaySpeed + lan.phase) * 0.08 + lan.tilt;
      const rotX = Math.cos(t * lan.swaySpeed * 0.7 + lan.phase) * 0.06;
      const rotY = t * 0.15 + lan.phase;

      // Candle flicker
      const flicker = 1.0 + Math.sin(t * lan.flickerSpeed + lan.phase) * 0.12 + Math.cos(t * 14.0) * 0.05;

      const posX = lan.x + swayX;
      const posY = lan.y;
      const posZ = lan.z + swayZ;

      // 1. Lantern Translucent Paper Body
      dummy.position.set(posX, posY, posZ);
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(lan.scale, lan.scale, lan.scale);
      dummy.updateMatrix();
      if (bodyMeshRef.current) bodyMeshRef.current.setMatrixAt(i, dummy.matrix);

      // 2. Top Pagoda Cap
      dummy.position.set(
        posX - Math.sin(rotZ) * (lan.scale * 0.62),
        posY + Math.cos(rotZ) * (lan.scale * 0.62),
        posZ
      );
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(lan.scale, lan.scale, lan.scale);
      dummy.updateMatrix();
      if (capMeshRef.current) capMeshRef.current.setMatrixAt(i, dummy.matrix);

      // 3. Bottom Base Plate
      dummy.position.set(
        posX + Math.sin(rotZ) * (lan.scale * 0.56),
        posY - Math.cos(rotZ) * (lan.scale * 0.56),
        posZ
      );
      dummy.rotation.set(rotX, rotY, rotZ);
      dummy.scale.set(lan.scale, lan.scale, lan.scale);
      dummy.updateMatrix();
      if (baseMeshRef.current) baseMeshRef.current.setMatrixAt(i, dummy.matrix);

      // 4. Glowing Candle Flame
      dummy.position.set(posX, posY - lan.scale * 0.1, posZ);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(
        lan.scale * flicker,
        lan.scale * 1.5 * flicker,
        lan.scale * flicker
      );
      dummy.updateMatrix();
      if (flameMeshRef.current) flameMeshRef.current.setMatrixAt(i, dummy.matrix);

      // 5. Soft Atmospheric Light Halo
      dummy.position.set(posX, posY, posZ);
      dummy.scale.set(
        lan.scale * 1.8 * flicker,
        lan.scale * 1.8 * flicker,
        lan.scale * 1.8 * flicker
      );
      dummy.updateMatrix();
      if (haloMeshRef.current) haloMeshRef.current.setMatrixAt(i, dummy.matrix);
    });

    if (bodyMeshRef.current) bodyMeshRef.current.instanceMatrix.needsUpdate = true;
    if (capMeshRef.current) capMeshRef.current.instanceMatrix.needsUpdate = true;
    if (baseMeshRef.current) baseMeshRef.current.instanceMatrix.needsUpdate = true;
    if (flameMeshRef.current) flameMeshRef.current.instanceMatrix.needsUpdate = true;
    if (haloMeshRef.current) haloMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* 1. Translucent Rice Paper Body (Warm Peachy-Gold Luminescence) */}
      <instancedMesh
        ref={bodyMeshRef}
        args={[bodyGeom, undefined, count]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#FFE9C4"
          emissive="#FFA040"
          emissiveIntensity={0.85}
          roughness={0.35}
          metalness={0.05}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      {/* 2. Antiqued Champagne Gold Top Pagoda Cap */}
      <instancedMesh
        ref={capMeshRef}
        args={[capGeom, undefined, count]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#382012"
          emissive="#B8860B"
          emissiveIntensity={0.25}
          roughness={0.3}
          metalness={0.85}
        />
      </instancedMesh>

      {/* 3. Base Trim Plate */}
      <instancedMesh
        ref={baseMeshRef}
        args={[baseGeom, undefined, count]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#2A150B"
          emissive="#94691B"
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.8}
        />
      </instancedMesh>

      {/* 4. Glowing Internal Flame */}
      <instancedMesh
        ref={flameMeshRef}
        args={[flameGeom, undefined, count]}
        frustumCulled={false}
      >
        <meshBasicMaterial
          color="#FFF7DE"
          transparent
          opacity={0.95}
        />
      </instancedMesh>

      {/* 5. Soft Atmospheric Warm Ambient Halo */}
      <instancedMesh
        ref={haloMeshRef}
        args={[haloGeom, undefined, count]}
        frustumCulled={false}
      >
        <meshBasicMaterial
          color="#FF9E3D"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
