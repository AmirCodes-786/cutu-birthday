"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CelebrationConfetti3DProps {
  active: boolean;
  isMobile?: boolean;
}

export function CelebrationConfetti3D({ active, isMobile = false }: CelebrationConfetti3DProps) {
  // Balanced count for silky performance and tasteful luxury celebration
  const count = isMobile ? 65 : 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const petalMeshRef = useRef<THREE.InstancedMesh>(null);

  // Radiant, Luminous Color Palette (ZERO dark or black tones)
  const foilPalette = useMemo(
    () => [
      new THREE.Color("#FFD700"), // 24k Pure Gold
      new THREE.Color("#FFE4A0"), // Sparkling Champagne Gold
      new THREE.Color("#F5C77E"), // Warm Gold
      new THREE.Color("#FF8FAB"), // Vibrant Rose Pink
      new THREE.Color("#FFB3C6"), // Soft Blush Pink
      new THREE.Color("#FFF0F5"), // Ivory Pearl
      new THREE.Color("#E0AAFF"), // Pastel Lilac Stardust
    ],
    []
  );

  const petalPalette = useMemo(
    () => [
      new THREE.Color("#D90429"), // Rich Crimson Rose
      new THREE.Color("#FF5D8F"), // Romantic Petal Pink
      new THREE.Color("#FF8FA3"), // Soft Blush Petal
      new THREE.Color("#FFF0F5"), // White Rose Petal
    ],
    []
  );

  // Foil Confetti Particles
  const foils = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 6.5,
        Math.random() * 5 + 2.5,
        (Math.random() - 0.5) * 4.5
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.7,
        -(0.9 + Math.random() * 1.3),
        (Math.random() - 0.5) * 0.7
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ),
      scale: 0.045 + Math.random() * 0.04,
      color: foilPalette[Math.floor(Math.random() * foilPalette.length)],
    }));
  }, [count, foilPalette]);

  // Rose Petal Particles
  const petalCount = isMobile ? 24 : 42;
  const petals = useMemo(() => {
    return Array.from({ length: petalCount }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 5 + 3,
        (Math.random() - 0.5) * 4
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        -(0.7 + Math.random() * 0.9),
        (Math.random() - 0.5) * 0.5
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      scale: 0.075 + Math.random() * 0.05,
      color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
    }));
  }, [petalCount, petalPalette]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize static instance colors once (avoids re-uploading color buffer on every frame)
  React.useEffect(() => {
    if (!active) return;
    if (meshRef.current) {
      foils.forEach((p, i) => {
        meshRef.current?.setColorAt(i, p.color);
      });
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
    if (petalMeshRef.current) {
      petals.forEach((p, i) => {
        petalMeshRef.current?.setColorAt(i, p.color);
      });
      if (petalMeshRef.current.instanceColor) {
        petalMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [active, foils, petals]);

  useFrame((_, delta) => {
    if (!active) return;

    // Animate Foil Confetti Ribbons
    if (meshRef.current) {
      foils.forEach((p, i) => {
        p.position.x += p.velocity.x * delta;
        p.position.y += p.velocity.y * delta;
        p.position.z += p.velocity.z * delta;

        // Gentle sinusoidal air flutter
        p.position.x += Math.sin(p.position.y * 3.2 + i) * 0.007;

        p.rotation.x += p.rotSpeed.x * delta;
        p.rotation.y += p.rotSpeed.y * delta;
        p.rotation.z += p.rotSpeed.z * delta;

        // Reset seamlessly when falling below view
        if (p.position.y < -3.2) {
          p.position.y = 4.2 + Math.random() * 2;
          p.position.x = (Math.random() - 0.5) * 6.5;
          p.position.z = (Math.random() - 0.5) * 4.5;
        }

        dummy.position.copy(p.position);
        dummy.rotation.copy(p.rotation);
        dummy.scale.set(p.scale, p.scale * 1.5, 0.002);
        dummy.updateMatrix();

        meshRef.current?.setMatrixAt(i, dummy.matrix);
      });

      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate Flower Petals (gentle swaying flutter)
    if (petalMeshRef.current) {
      petals.forEach((p, i) => {
        p.position.x += p.velocity.x * delta;
        p.position.y += p.velocity.y * delta;
        p.position.z += p.velocity.z * delta;

        p.position.x += Math.cos(p.position.y * 2.2 + i) * 0.01;

        p.rotation.x += p.rotSpeed.x * delta * 0.6;
        p.rotation.y += p.rotSpeed.y * delta * 0.6;
        p.rotation.z += p.rotSpeed.z * delta * 0.6;

        if (p.position.y < -3.2) {
          p.position.y = 4.2 + Math.random() * 2;
          p.position.x = (Math.random() - 0.5) * 6;
          p.position.z = (Math.random() - 0.5) * 4;
        }

        dummy.position.copy(p.position);
        dummy.rotation.copy(p.rotation);
        dummy.scale.set(p.scale, p.scale * 1.3, p.scale * 0.2);
        dummy.updateMatrix();

        petalMeshRef.current?.setMatrixAt(i, dummy.matrix);
      });

      petalMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* 1. Metallic Foil Confetti (Glinting Gold & Rose-Gold Ribbons)
          Using MeshBasicMaterial with DoubleSide ensures ZERO dark/black polygons at any rotation angle! */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>

      {/* 2. Soft Falling Rose Petals
          Soft standard material with low roughness and warm illumination */}
      <instancedMesh
        ref={petalMeshRef}
        args={[undefined, undefined, petalCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.05}
        />
      </instancedMesh>
    </group>
  );
}
