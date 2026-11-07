"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MemoryItem } from "@/config/memoriesConfig";

interface MemoryFrame3DProps {
  memory: MemoryItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  index: number;
  isFeatured?: boolean;
  onSelect: (memory: MemoryItem, index: number) => void;
}

export function MemoryFrame3D({
  memory,
  position,
  rotation = [0, 0, 0],
  index,
  isFeatured = false,
  onSelect,
}: MemoryFrame3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();

  // Load image texture with 4K anisotropic filtering
  const texture = useTexture(memory.image, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    tex.anisotropy = maxAnisotropy || 16;
    tex.needsUpdate = true;
  });

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      texture.anisotropy = maxAnisotropy || 16;
      texture.needsUpdate = true;
    }
  }, [texture, gl]);

  // Proportional frame dimensions: Central featured memory is ~1.36x larger
  // Slim champagne-gold and rose-gold borders with zero face cropping
  const { frameW, frameH, picW, picH } = useMemo(() => {
    const ratio = memory.aspectRatio || 1.0;
    const scale = isFeatured ? 1.36 : 0.95;
    let w = 1.3 * scale;
    let h = 1.3 * scale;

    if (ratio < 1) {
      // Portrait
      h = 1.5 * scale;
      w = h * ratio;
    } else {
      // Landscape
      w = 1.6 * scale;
      h = w / ratio;
    }

    const borderOffset = isFeatured ? 0.04 : 0.03;

    return {
      frameW: w + borderOffset * 2,
      frameH: h + borderOffset * 2,
      picW: w,
      picH: h,
    };
  }, [memory.aspectRatio, isFeatured]);

  const floatPhase = index * 1.1;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Extremely gentle breathing float (amplitude 0.035, calm and graceful)
      const floatY =
        position[1] + Math.sin(time * 0.9 + floatPhase) * (isFeatured ? 0.035 : 0.025);
      const targetZ = hovered ? position[2] + 0.22 : position[2];
      const targetScale = hovered ? 1.04 : 1.0;

      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        position[0],
        4.0,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        floatY,
        3.5,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetZ,
        4.0,
        delta
      );

      // Subtle responsive 3D tilt
      const targetRotY =
        rotation[1] + (hovered ? 0.06 : Math.sin(time * 0.5 + floatPhase) * 0.015);
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3.0,
        delta
      );

      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    if (haloRef.current) {
      const pulse = 1.0 + Math.sin(time * 1.8 + floatPhase) * 0.04;
      haloRef.current.scale.set(pulse, pulse, 1);
    }

    if (lightRef.current) {
      const base = isFeatured ? 1.4 : hovered ? 1.2 : 0.65;
      lightRef.current.intensity =
        base + Math.sin(time * 2.0 + floatPhase) * (hovered ? 0.2 : 0.1);
    }
  });

  const cornerX = frameW / 2 - 0.018;
  const cornerY = frameH / 2 - 0.018;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(memory, index);
      }}
    >
      {/* 1. Subtle Contact Shadow mesh for realistic cosmic spatial depth */}
      <mesh position={[0, 0, -0.014]}>
        <planeGeometry args={[frameW + 0.06, frameH + 0.06]} />
        <meshBasicMaterial
          color="#06020E"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Slim Jewelry-Grade Metallic Border (Champagne Gold / Rose Gold) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameW, frameH, 0.012]} />
        <meshStandardMaterial
          color={isFeatured ? "#F5C77E" : hovered ? "#F5C77E" : "#D7A0A8"}
          roughness={0.22}
          metalness={0.9}
          emissive={isFeatured ? "#F5C77E" : "#D95BCB"}
          emissiveIntensity={isFeatured ? 0.18 : hovered ? 0.25 : 0.06}
        />
      </mesh>

      {/* 3. Delicate Restrained Starlight Aura (Subtle warm glow behind frame) */}
      <mesh ref={haloRef} position={[0, 0, -0.008]}>
        <planeGeometry
          args={[frameW + (isFeatured ? 0.08 : 0.05), frameH + (isFeatured ? 0.08 : 0.05)]}
        />
        <meshBasicMaterial
          color={isFeatured ? "#F5C77E" : hovered ? "#F5C77E" : "#F8B7D0"}
          transparent
          opacity={isFeatured ? 0.18 : hovered ? 0.2 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. The Photograph: Crisp clarity, 100% visible, unoccluded, preserving native aspect ratio */}
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[picW, picH]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
        />
      </mesh>

      {/* 5. Delicate Diamond Corner Studs (Refined metallic jewelry accents) */}
      {[
        [-cornerX, cornerY],
        [cornerX, cornerY],
        [-cornerX, -cornerY],
        [cornerX, -cornerY],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.014]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[isFeatured ? 0.022 : 0.016]} />
          <meshStandardMaterial
            color="#F5C77E"
            metalness={0.92}
            roughness={0.15}
            emissive="#F5C77E"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* 6. Local Restrained Warm Starlight Point Light */}
      <pointLight
        ref={lightRef}
        color={isFeatured ? "#F5C77E" : "#D7A0A8"}
        distance={isFeatured ? 3.5 : 2.5}
        decay={2}
        position={[0, 0, 0.45]}
      />
    </group>
  );
}
