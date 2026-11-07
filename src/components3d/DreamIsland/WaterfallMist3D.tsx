"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animated 3D Flowing Celestial Waterfalls & Plunge Mist Spray
 * Aligned with the waterfalls cascading down the left cliff of the floating island.
 */
export function Waterfall3D() {
  const waterMeshRef1 = useRef<THREE.Mesh>(null);
  const waterMeshRef2 = useRef<THREE.Mesh>(null);
  const mistPointsRef = useRef<THREE.Points>(null);

  // Generate procedural dynamic water texture for cascading flow
  const waterTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Gradient with caustic streak lines
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "rgba(220, 245, 255, 0.85)");
    grad.addColorStop(0.3, "rgba(160, 225, 255, 0.65)");
    grad.addColorStop(0.7, "rgba(200, 240, 255, 0.8)");
    grad.addColorStop(1, "rgba(240, 250, 255, 0.9)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 256);

    // Vertical foaming streaks
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    for (let i = 0; i < 18; i++) {
      const x = Math.random() * 64;
      const w = 2 + Math.random() * 4;
      ctx.fillRect(x, 0, w, 256);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 3);
    return tex;
  }, []);

  // Misty plunge spray particles where waterfall hits the lower cloud basin
  const mistCount = 65;
  const { mistPositions, mistVelocities, mistLifetimes, mistOpacities, mistSizes } = useMemo(() => {
    const pos = new Float32Array(mistCount * 3);
    const vel = new Float32Array(mistCount * 3);
    const life = new Float32Array(mistCount);
    const op = new Float32Array(mistCount);
    const sz = new Float32Array(mistCount);

    for (let i = 0; i < mistCount; i++) {
      // Spawn at base of left waterfalls (x: -2.4 to -1.6, y: -2.3 to -2.7, z: 0.2 to 0.8)
      pos[i * 3 + 0] = -2.0 + (Math.random() - 0.5) * 0.9;
      pos[i * 3 + 1] = -2.5 + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = 0.5 + (Math.random() - 0.5) * 0.5;

      // Billow outward and upward slightly like real water spray
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.25;
      vel[i * 3 + 1] = 0.08 + Math.random() * 0.15;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      life[i] = Math.random();
      op[i] = 0.2 + Math.random() * 0.4;
      sz[i] = 0.08 + Math.random() * 0.14;
    }

    return {
      mistPositions: pos,
      mistVelocities: vel,
      mistLifetimes: life,
      mistOpacities: op,
      mistSizes: sz,
    };
  }, []);

  // Soft circular mist particle texture
  const mistTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(230, 248, 255, 0.8)");
    grad.addColorStop(0.35, "rgba(210, 240, 255, 0.35)");
    grad.addColorStop(0.7, "rgba(240, 210, 240, 0.1)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame((state, delta) => {
    // 1. Cascading water UV flow animation
    if (waterTexture) {
      waterTexture.offset.y -= delta * 1.6;
    }

    // 2. Billowing splash mist simulation
    if (mistPointsRef.current) {
      const posAttr = mistPointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < mistCount; i++) {
        mistLifetimes[i] += delta * 0.65;

        // Move mist particle
        arr[i * 3 + 0] += mistVelocities[i * 3 + 0] * delta;
        arr[i * 3 + 1] += mistVelocities[i * 3 + 1] * delta;
        arr[i * 3 + 2] += mistVelocities[i * 3 + 2] * delta;

        // Reset particle on lifetime expiry
        if (mistLifetimes[i] > 1.0) {
          mistLifetimes[i] = 0;
          arr[i * 3 + 0] = -2.0 + (Math.random() - 0.5) * 0.9;
          arr[i * 3 + 1] = -2.5 + (Math.random() - 0.5) * 0.2;
          arr[i * 3 + 2] = 0.5 + (Math.random() - 0.5) * 0.5;
        }
      }

      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main Cascade Ribbon 1 (Left Major Cliff) */}
      <mesh
        ref={waterMeshRef1}
        position={[-2.15, -1.25, 0.35]}
        rotation={[0.08, 0.15, -0.05]}
      >
        <planeGeometry args={[0.75, 2.4, 8, 16]} />
        <meshStandardMaterial
          map={waterTexture || undefined}
          color="#D4F1F9"
          emissive="#70C4EF"
          emissiveIntensity={0.45}
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Minor Cascade Ribbon 2 (Narrower Cliff Fall) */}
      <mesh
        ref={waterMeshRef2}
        position={[-1.75, -1.45, 0.45]}
        rotation={[0.05, 0.08, 0.02]}
      >
        <planeGeometry args={[0.42, 2.1, 4, 12]} />
        <meshStandardMaterial
          map={waterTexture || undefined}
          color="#E6F8FF"
          emissive="#70C4EF"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Billowing Plunge Splash Vapor Particles */}
      <points ref={mistPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[mistPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          sizeAttenuation
          map={mistTexture || undefined}
          color="#E0F4FF"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
