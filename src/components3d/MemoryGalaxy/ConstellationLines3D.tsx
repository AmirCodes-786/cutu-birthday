"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ConstellationLines3DProps {
  positions: [number, number, number][];
}

export function ConstellationLines3D({ positions }: ConstellationLines3DProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const pulsesRef = useRef<THREE.Points>(null);
  const sparklesRef = useRef<THREE.Points>(null);
  const anchorStarsRef = useRef<THREE.Group>(null);

  // Soft circular starlight sprite for pulses and sparkles (no square pixels)
  const starlightTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(245, 199, 126, 0.85)");
    grad.addColorStop(0.65, "rgba(248, 183, 208, 0.3)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const { linePositions, lineColors, pathSegments } = useMemo(() => {
    if (!positions || positions.length < 6) {
      return { linePositions: new Float32Array(0), lineColors: new Float32Array(0), pathSegments: [] };
    }

    // Celestial Constellation Network connecting the 6 balanced memory nodes:
    // 0: Center (Featured)
    // 1: Upper-Left, 2: Lower-Left, 3: Upper-Right, 4: Middle-Right, 5: Lower-Right
    const connections: [number, number][] = [
      [0, 1], // Center -> Upper-Left
      [0, 2], // Center -> Lower-Left
      [0, 3], // Center -> Upper-Right
      [0, 4], // Center -> Middle-Right
      [0, 5], // Center -> Lower-Right
      [1, 2], // Upper-Left -> Lower-Left
      [1, 3], // Upper-Left -> Upper-Right (Top Arch)
      [3, 4], // Upper-Right -> Middle-Right
      [4, 5], // Middle-Right -> Lower-Right
      [5, 2], // Lower-Right -> Lower-Left (Bottom Arch)
    ];

    const vertexCount = connections.length * 2;
    const pos = new Float32Array(vertexCount * 3);
    const col = new Float32Array(vertexCount * 3);

    const cGold = new THREE.Color("#F5C77E");
    const cRose = new THREE.Color("#F8B7D0");
    const cOrchid = new THREE.Color("#D95BCB");

    const segments: { start: THREE.Vector3; end: THREE.Vector3; speed: number; offset: number }[] = [];
    const zOffset = -0.12; // Strictly behind all photograph plates

    connections.forEach(([a, b], idx) => {
      const p1 = positions[a];
      const p2 = positions[b];

      pos[idx * 6] = p1[0];
      pos[idx * 6 + 1] = p1[1];
      pos[idx * 6 + 2] = zOffset;

      pos[idx * 6 + 3] = p2[0];
      pos[idx * 6 + 4] = p2[1];
      pos[idx * 6 + 5] = zOffset;

      const c1 = idx < 5 ? cGold : cRose;
      const c2 = idx < 5 ? cOrchid : cGold;

      col[idx * 6] = c1.r;
      col[idx * 6 + 1] = c1.g;
      col[idx * 6 + 2] = c1.b;

      col[idx * 6 + 3] = c2.r;
      col[idx * 6 + 4] = c2.g;
      col[idx * 6 + 5] = c2.b;

      segments.push({
        start: new THREE.Vector3(p1[0], p1[1], zOffset),
        end: new THREE.Vector3(p2[0], p2[1], zOffset),
        speed: 0.16 + (idx % 3) * 0.04, // Calm, slow travelling pace
        offset: idx * 0.22,
      });
    });

    return {
      linePositions: pos,
      lineColors: col,
      pathSegments: segments,
    };
  }, [positions]);

  // Traveling starlight pulses (2 comets per segment)
  const pulseCount = pathSegments.length * 2;
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);

  // Occasional sparkles along the constellation lines
  const sparkleCount = 14;
  const sparklePositions = useMemo(() => new Float32Array(sparkleCount * 3), [sparkleCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gentle breathing luminescence of constellation lines
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      if (mat) {
        mat.opacity = 0.20 + Math.sin(time * 1.2) * 0.05;
      }
    }

    // Update travelling starlight comets along lines
    if (pulsesRef.current && pathSegments.length > 0) {
      const posAttr = pulsesRef.current.geometry.attributes.position as THREE.BufferAttribute;

      pathSegments.forEach((seg, i) => {
        const prog1 = (time * seg.speed + seg.offset) % 1.0;
        const p1 = new THREE.Vector3().lerpVectors(seg.start, seg.end, prog1);
        posAttr.setXYZ(i * 2, p1.x, p1.y, p1.z);

        const prog2 = (time * seg.speed + seg.offset + 0.5) % 1.0;
        const p2 = new THREE.Vector3().lerpVectors(seg.start, seg.end, prog2);
        posAttr.setXYZ(i * 2 + 1, p2.x, p2.y, p2.z);
      });

      posAttr.needsUpdate = true;
    }

    // Occasional sparkles that gently glimmer along segments
    if (sparklesRef.current && pathSegments.length > 0) {
      const spAttr = sparklesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let s = 0; s < sparkleCount; s++) {
        const seg = pathSegments[s % pathSegments.length];
        const tSparkle = Math.sin(time * 0.8 + s * 1.7) * 0.5 + 0.5;
        const pt = new THREE.Vector3().lerpVectors(seg.start, seg.end, tSparkle);
        spAttr.setXYZ(s, pt.x, pt.y, pt.z + 0.01);
      }
      spAttr.needsUpdate = true;
    }

    // Pulse the 6 anchor nodes
    if (anchorStarsRef.current) {
      anchorStarsRef.current.children.forEach((child, i) => {
        const pulse = 1.0 + Math.sin(time * 2.0 + i * 1.1) * 0.25;
        child.scale.set(pulse, pulse, pulse);
      });
    }
  });

  if (linePositions.length === 0) return null;

  return (
    <group>
      {/* 1. Delicate Crystalline Constellation Lines (strictly behind photos at z = -0.12) */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 2. Tiny Glowing Pulsing Anchor Star Nodes at the 6 Coordinates */}
      <group ref={anchorStarsRef}>
        {positions.map((pos, idx) => (
          <mesh key={idx} position={[pos[0], pos[1], -0.12]}>
            <sphereGeometry args={[idx === 0 ? 0.04 : 0.028, 16, 16]} />
            <meshBasicMaterial
              color={idx === 0 ? "#F5C77E" : "#F8B7D0"}
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 3. Radiant Traveling Starlight Pulses (Smooth circular comets) */}
      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          sizeAttenuation
          color="#FFF1E6"
          map={starlightTexture || undefined}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 4. Occasional Warm Champagne-Gold Sparkles */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparklePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          color="#F5C77E"
          map={starlightTexture || undefined}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
