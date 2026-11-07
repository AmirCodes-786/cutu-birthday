"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface RosePetalData {
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
  swayPhase: number;
}

export function RosePetals3D({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Organic curved rose petal shape
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.18, 0.2, 0.32, 0.55, 0.2, 0.85);
    shape.bezierCurveTo(0.1, 1.05, -0.1, 1.05, -0.2, 0.85);
    shape.bezierCurveTo(-0.32, 0.55, -0.18, 0.2, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 8);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      // Curl the petal edges for romantic realism
      pos.setZ(i, Math.sin(y * Math.PI) * 0.12 + x * x * 0.15);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  const petals = useMemo<RosePetalData[]>(() => {
    const arr: RosePetalData[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 12,
        y: 4 + Math.random() * 6,
        z: -1 + Math.random() * 5,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.3 - Math.random() * 0.35,
        vz: (Math.random() - 0.5) * 0.12,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 1.2,
        vRotY: (Math.random() - 0.5) * 1.5,
        vRotZ: (Math.random() - 0.5) * 1.0,
        scale: 0.28 + Math.random() * 0.2,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const p = petals[i];
      p.y += p.vy * delta;
      p.x += Math.sin(time * 0.7 + p.swayPhase) * 0.25 * delta + p.vx * delta;
      p.z += Math.cos(time * 0.5 + p.swayPhase) * 0.15 * delta + p.vz * delta;

      p.rotX += p.vRotX * delta;
      p.rotY += p.vRotY * delta;
      p.rotZ += p.vRotZ * delta;

      if (p.y < -5) {
        p.y = 5 + Math.random() * 3;
        p.x = (Math.random() - 0.5) * 12;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <meshStandardMaterial
        color="#F28DBB"
        roughness={0.35}
        metalness={0.15}
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

