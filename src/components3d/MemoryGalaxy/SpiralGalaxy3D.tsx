"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SpiralGalaxy3DProps {
  particleCount?: number;
  radius?: number;
  arms?: number;
}

export function SpiralGalaxy3D({
  particleCount = 4500,
  radius = 9.5,
  arms = 4,
}: SpiralGalaxy3DProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreAuraRef = useRef<THREE.Mesh>(null);

  // Generate 4,500 logarithmic spiral particles
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color("#FFFFFF");
    const cCore = new THREE.Color("#FFF1E6");
    const cGold = new THREE.Color("#F5C77E");
    const cOrchid = new THREE.Color("#D95BCB");
    const cViolet = new THREE.Color("#66318D");
    const cRose = new THREE.Color("#F8B7D0");

    for (let i = 0; i < particleCount; i++) {
      // Exponential distribution: dense bright core, thins toward the outer arms
      const r = Math.pow(Math.random(), 1.7) * radius;
      const spinAngle = r * 0.95;
      const armAngle = ((i % arms) * (Math.PI * 2)) / arms;

      // Disc thickness: thicker at center, flat at edges
      const coreJitter = Math.max(0.08, (radius - r) / radius);
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.6 * coreJitter;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.6 * coreJitter;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.7 * coreJitter;

      const angle = armAngle + spinAngle;

      pos[i * 3] = Math.cos(angle) * r + randomX;
      pos[i * 3 + 1] = Math.sin(angle) * r + randomY;
      pos[i * 3 + 2] = randomZ;

      // Cosmic gradient from core to fringe
      const normalizedR = r / radius;
      const mixedColor = new THREE.Color();

      if (normalizedR < 0.15) {
        mixedColor.copy(cWhite).lerp(cCore, normalizedR / 0.15);
      } else if (normalizedR < 0.4) {
        mixedColor.copy(cCore).lerp(cGold, (normalizedR - 0.15) / 0.25);
      } else if (normalizedR < 0.7) {
        mixedColor.copy(cGold).lerp(cOrchid, (normalizedR - 0.4) / 0.3);
      } else if (normalizedR < 0.88) {
        mixedColor.copy(cOrchid).lerp(cRose, (normalizedR - 0.7) / 0.18);
      } else {
        mixedColor.copy(cRose).lerp(cViolet, (normalizedR - 0.88) / 0.12);
      }

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col };
  }, [particleCount, radius, arms]);

  // Circular stardust particle sprite texture
  const stardustTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.2, "rgba(245, 199, 126, 0.9)");
    grad.addColorStop(0.5, "rgba(217, 91, 203, 0.45)");
    grad.addColorStop(1, "rgba(16, 5, 31, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current) {
      // Gentle cosmic rotation
      pointsRef.current.rotation.z = time * 0.03;
    }

    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(time * 1.6) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (coreAuraRef.current) {
      const pulse2 = 1.0 + Math.cos(time * 1.4) * 0.15;
      coreAuraRef.current.scale.set(pulse2, pulse2, pulse2);
    }
  });

  return (
    <group position={[0, 0, -0.8]} rotation={[-0.5, 0.12, -0.15]}>
      {/* 1. 4,500 Swirling Spiral Arm Stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          map={stardustTexture || undefined}
          transparent
          opacity={0.85}
        />
      </points>

      {/* 2. Radiant Galactic Core Nucleus */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial
          color="#F5C77E"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Galactic Glow Halo */}
      <mesh ref={coreAuraRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.1, 20, 20]} />
        <meshBasicMaterial
          color="#D95BCB"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Central Cosmic Lighting */}
      <pointLight color="#F5C77E" intensity={3.0} distance={8} decay={2} />
      <pointLight color="#D95BCB" intensity={2.0} distance={10} decay={2} />
    </group>
  );
}
