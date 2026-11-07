"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PetalData {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  scale: number;
  swayOffset: number;
  swaySpeed: number;
}

/**
 * Delicate, translucent cherry blossom petals drifting across the sunset breeze.
 * Features realistic notched petal geometry, organic curved contours, and soft blossom textures.
 */
export function SunsetPetals3D({ count = 38 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Organic curved sakura petal shape with realistic notched tip
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Start at petal base stem
    shape.moveTo(0, -0.4);
    // Left curved lobe
    shape.bezierCurveTo(0.18, -0.2, 0.28, 0.15, 0.22, 0.42);
    // Left notch tip
    shape.bezierCurveTo(0.18, 0.52, 0.08, 0.55, 0.02, 0.46);
    // Petal notch indent
    shape.lineTo(0, 0.42);
    // Right notch tip
    shape.lineTo(-0.02, 0.46);
    shape.bezierCurveTo(-0.08, 0.55, -0.18, 0.52, -0.22, 0.42);
    // Right curved lobe
    shape.bezierCurveTo(-0.28, 0.15, -0.18, -0.2, 0, -0.4);

    const geom = new THREE.ShapeGeometry(shape, 12);
    const pos = geom.attributes.position;

    // Give 3D cup curvature along the length and width of the petal
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      // Gentle spoon-like cup curve
      const zCurv = Math.cos(y * Math.PI) * 0.06 - (x * x) * 0.12;
      pos.setZ(i, zCurv);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  // Soft translucent petal texture with delicate gradient and feathered edges
  const petalTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Radial gradient from pale blush center to warm rose edges
    const grad = ctx.createRadialGradient(64, 75, 4, 64, 60, 60);
    grad.addColorStop(0, "rgba(255, 250, 248, 1.0)");
    grad.addColorStop(0.35, "rgba(255, 218, 230, 0.95)");
    grad.addColorStop(0.7, "rgba(255, 182, 204, 0.85)");
    grad.addColorStop(0.92, "rgba(248, 160, 190, 0.5)");
    grad.addColorStop(1.0, "rgba(240, 140, 175, 0.0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    // Subtle delicate petal central vein line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, 115);
    ctx.quadraticCurveTo(63, 64, 64, 25);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, []);

  const petals = useMemo<PetalData[]>(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 14,
      y: 4.5 + Math.random() * 5.0,
      z: -1.5 + Math.random() * 4.5,
      vx: 0.12 + Math.random() * 0.18, // Gentle easterly sunset wind
      vy: -0.22 - Math.random() * 0.28, // Slow, peaceful descent
      vz: (Math.random() - 0.5) * 0.12,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      vRotX: (Math.random() - 0.5) * 1.2,
      vRotY: 0.6 + Math.random() * 1.2, // Graceful tumbling
      vRotZ: (Math.random() - 0.5) * 0.9,
      scale: 0.16 + Math.random() * 0.14, // Varied natural sizes
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.8 + Math.random() * 0.8,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    petals.forEach((petal, i) => {
      // Gentle sinusoidal air-current sway
      const swayX = Math.sin(t * petal.swaySpeed + petal.swayOffset) * 0.25;
      const swayZ = Math.cos(t * petal.swaySpeed * 0.7 + petal.swayOffset) * 0.15;

      petal.x += (petal.vx + swayX * 0.2) * delta;
      petal.y += petal.vy * delta;
      petal.z += (petal.vz + swayZ * 0.2) * delta;

      // Realistic tumbling rotations
      petal.rotX += petal.vRotX * delta;
      petal.rotY += petal.vRotY * delta;
      petal.rotZ += petal.vRotZ * delta;

      // Screen boundary wrap
      if (petal.y < -4.2) {
        petal.y = 5.2 + Math.random() * 1.5;
        petal.x = (Math.random() - 0.5) * 14;
        petal.z = -1.5 + Math.random() * 4.5;
      }
      if (petal.x > 8.0) petal.x = -8.0;
      if (petal.x < -8.0) petal.x = 8.0;

      dummy.position.set(petal.x, petal.y, petal.z);
      dummy.rotation.set(petal.rotX, petal.rotY, petal.rotZ);
      dummy.scale.set(petal.scale, petal.scale, petal.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, undefined, count]}
      frustumCulled={false}
    >
      <meshStandardMaterial
        map={petalTexture || undefined}
        color="#FFAAC6"
        emissive="#FF8EAF"
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.05}
        side={THREE.DoubleSide}
        transparent
        opacity={0.86}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
