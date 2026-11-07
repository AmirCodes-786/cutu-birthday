"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface FireflyData {
  x: number;
  y: number;
  z: number;
  originX: number;
  originY: number;
  originZ: number;
  phase: number;
  speed: number;
  radius: number;
}

export function Fireflies3D({ count = 45 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, fireflyData } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const data: FireflyData[] = [];

    const cGold = new THREE.Color("#F5C77E");
    const cPink = new THREE.Color("#F8B7D0");
    const cIvory = new THREE.Color("#FFF1E6");

    for (let i = 0; i < count; i++) {
      const ox = (Math.random() - 0.5) * 14;
      const oy = -2.5 + Math.random() * 6;
      const oz = (Math.random() - 0.5) * 6 + 1.5;

      pos[i * 3] = ox;
      pos[i * 3 + 1] = oy;
      pos[i * 3 + 2] = oz;

      const roll = Math.random();
      const chosenColor = roll < 0.6 ? cGold : roll < 0.85 ? cPink : cIvory;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;

      data.push({
        x: ox,
        y: oy,
        z: oz,
        originX: ox,
        originY: oy,
        originZ: oz,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
        radius: 0.3 + Math.random() * 0.5,
      });
    }

    return { positions: pos, colors: col, fireflyData: data };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const f = fireflyData[i];
      // Organic 3D Lissajous floating motion
      arr[i * 3] =
        f.originX +
        Math.sin(time * f.speed + f.phase) * f.radius +
        Math.cos(time * 0.3 + f.phase) * 0.2;
      arr[i * 3 + 1] =
        f.originY +
        Math.cos(time * f.speed * 0.8 + f.phase) * f.radius +
        Math.sin(time * 0.4 + f.phase) * 0.2;
      arr[i * 3 + 2] =
        f.originZ + Math.sin(time * 0.5 + f.phase) * (f.radius * 0.5);
    }

    posAttr.needsUpdate = true;
  });

  // Circular glowing stardust sprite texture
  const fireflyTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(245, 199, 126, 0.85)");
    grad.addColorStop(0.65, "rgba(248, 183, 208, 0.35)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        map={fireflyTexture || undefined}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

