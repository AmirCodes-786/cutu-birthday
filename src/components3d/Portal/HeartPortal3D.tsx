"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface HeartPortal3DProps {
  isEntering?: boolean;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
}

/**
 * Living Portal Energy & Starlight Aura
 * Eliminates the clashing rigid double-heart outline and instead provides:
 * 1. Gentle floating starlight motes drifting naturally around the celestial vortex.
 * 2. Dynamic pulsating champagne and orchid point lights that react to hover.
 * 3. Smooth camera plunge on enter.
 */
const _enterScale = new THREE.Vector3(2.5, 2.5, 2.5);

export function HeartPortal3D({
  isEntering = false,
  onHover,
  onClick,
}: HeartPortal3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const starlightRef = useRef<THREE.Points>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  // Soft ambient starlight motes floating organically near the portal center
  const { positions, colors } = React.useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cGold = new THREE.Color("#F5C77E");
    const cPink = new THREE.Color("#F8B7D0");
    const cIvory = new THREE.Color("#FFF1E6");

    for (let i = 0; i < count; i++) {
      // Natural elliptic distribution around the center vortex
      const angle = Math.random() * Math.PI * 2;
      const radiusX = 1.2 + Math.random() * 2.2;
      const radiusY = 1.0 + Math.random() * 1.8;

      pos[i * 3] = Math.cos(angle) * radiusX;
      pos[i * 3 + 1] = Math.sin(angle) * radiusY + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      const roll = Math.random();
      const c = roll < 0.5 ? cGold : roll < 0.8 ? cPink : cIvory;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Subtle organic breathing motion
      groupRef.current.position.y = 0.2 + Math.sin(time * 1.2) * 0.04;

      if (isEntering) {
        groupRef.current.scale.lerp(_enterScale, 0.08);
      }
    }

    if (starlightRef.current) {
      const rotSpeed = hovered ? 0.2 : 0.08;
      starlightRef.current.rotation.z += rotSpeed * delta;
    }

    if (pointLightRef.current) {
      const base = isEntering ? 8 : hovered ? 4.5 : 2.5;
      pointLightRef.current.intensity =
        base + Math.sin(time * 3) * (hovered ? 1.0 : 0.5);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
  };

  return (
    <group
      ref={groupRef}
      position={[0, 0.2, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      {/* Soft celestial starlight motes orbiting the vortex */}
      <points ref={starlightRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Dynamic Starlight Point Lights */}
      <pointLight
        ref={pointLightRef}
        color="#F5C77E"
        distance={9}
        decay={2}
        position={[0, 0.2, 0.8]}
      />
      <pointLight
        color="#D95BCB"
        intensity={2.2}
        distance={7}
        decay={2}
        position={[0, -0.3, -0.5]}
      />
    </group>
  );
}
