"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ButterflyData {
  origin: THREE.Vector3;
  speed: number;
  radiusX: number;
  radiusY: number;
  radiusZ: number;
  phase: number;
  flapSpeed: number;
  color: string;
}

export function Butterflies3D({ count = 5 }: { count?: number }) {
  const butterflyGroups = useRef<(THREE.Group | null)[]>([]);
  const leftWings = useRef<(THREE.Mesh | null)[]>([]);
  const rightWings = useRef<(THREE.Mesh | null)[]>([]);

  // Curved butterfly wing shape
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.1, 0.15, 0.25, 0.3, 0.2, 0.45);
    shape.bezierCurveTo(0.15, 0.55, 0.0, 0.5, -0.05, 0.35);
    shape.bezierCurveTo(-0.08, 0.2, -0.05, 0.1, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 8);
    geom.computeVertexNormals();
    return geom;
  }, []);

  const butterflyData = useMemo<ButterflyData[]>(() => {
    const list: ButterflyData[] = [];
    const colors = ["#F28DBB", "#F5C77E", "#D95BCB", "#FFF1E6", "#F8B7D0"];

    for (let i = 0; i < count; i++) {
      list.push({
        origin: new THREE.Vector3(
          ((i % 3) - 1) * 2.2 + (Math.random() - 0.5) * 0.8,
          0.3 + Math.random() * 0.8,
          ((i % 2) - 0.5) * 2.5
        ),
        speed: 0.8 + Math.random() * 0.4,
        radiusX: 0.9 + Math.random() * 0.6,
        radiusY: 0.3 + Math.random() * 0.3,
        radiusZ: 1.0 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        flapSpeed: 16 + Math.random() * 8,
        color: colors[i % colors.length],
      });
    }

    return list;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    butterflyData.forEach((b, i) => {
      const group = butterflyGroups.current[i];
      const leftWing = leftWings.current[i];
      const rightWing = rightWings.current[i];

      if (!group) return;

      // 3D Lissajous flight trajectory around flowers
      const x = b.origin.x + Math.sin(time * b.speed + b.phase) * b.radiusX;
      const y = b.origin.y + Math.cos(time * b.speed * 1.5 + b.phase) * b.radiusY;
      const z = b.origin.z + Math.cos(time * b.speed + b.phase) * b.radiusZ;

      group.position.set(x, y, z);

      // Orient butterfly along velocity tangent
      const dx = Math.cos(time * b.speed + b.phase) * b.radiusX;
      const dz = -Math.sin(time * b.speed + b.phase) * b.radiusZ;
      group.rotation.y = Math.atan2(dx, dz);
      group.rotation.z = Math.sin(time * b.speed * 2) * 0.15;

      // Rapid, graceful wing flapping
      const flap = Math.sin(time * b.flapSpeed) * 0.75;
      if (leftWing) leftWing.rotation.y = flap;
      if (rightWing) rightWing.rotation.y = -flap;
    });
  });

  return (
    <group>
      {butterflyData.map((b, i) => (
        <group
          key={`butterfly-${i}`}
          ref={(el) => {
            butterflyGroups.current[i] = el;
          }}
          scale={0.28}
        >
          {/* Slender Butterfly Body */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.25, 6]} />
            <meshStandardMaterial color="#1E0E2C" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Left Wing */}
          <mesh
            ref={(el) => {
              leftWings.current[i] = el;
            }}
            geometry={wingGeometry}
            position={[0.01, 0, 0]}
            rotation={[0, 0, -Math.PI / 4]}
          >
            <meshStandardMaterial
              color={b.color}
              emissive={b.color}
              emissiveIntensity={0.35}
              roughness={0.2}
              metalness={0.2}
              side={THREE.DoubleSide}
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* Right Wing */}
          <mesh
            ref={(el) => {
              rightWings.current[i] = el;
            }}
            geometry={wingGeometry}
            position={[-0.01, 0, 0]}
            rotation={[0, 0, Math.PI / 4]}
            scale={[-1, 1, 1]}
          >
            <meshStandardMaterial
              color={b.color}
              emissive={b.color}
              emissiveIntensity={0.35}
              roughness={0.2}
              metalness={0.2}
              side={THREE.DoubleSide}
              transparent
              opacity={0.92}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
