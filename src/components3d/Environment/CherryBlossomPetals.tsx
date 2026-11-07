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
}

export function CherryBlossomPetals({ count = 90 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Curved cherry blossom petal geometry
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Teardrop / petal contour
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.15, 0.25, 0.28, 0.6, 0.18, 0.9);
    shape.bezierCurveTo(0.08, 1.15, -0.08, 1.15, -0.18, 0.9);
    shape.bezierCurveTo(-0.28, 0.6, -0.15, 0.25, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 8);
    // Add subtle curl along z-axis to make it feel organic
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(y * Math.PI) * 0.08 + (x * x) * 0.1);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Individual petal physics state
  const petals = useMemo<PetalData[]>(() => {
    const array: PetalData[] = [];
    for (let i = 0; i < count; i++) {
      array.push({
        x: (Math.random() - 0.5) * 16,
        y: 6 + Math.random() * 8,
        z: -2 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.4 - Math.random() * 0.5,
        vz: (Math.random() - 0.5) * 0.15,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 1.5,
        vRotY: (Math.random() - 0.5) * 2.0,
        vRotZ: (Math.random() - 0.5) * 1.2,
        scale: 0.25 + Math.random() * 0.22,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }
    return array;
  }, [count]);

  // Color palette for instanced petals
  const colors = useMemo(() => {
    const palette = [
      new THREE.Color("#F8B7D0"), // Blush Pink
      new THREE.Color("#F28DBB"), // Romantic Pink
      new THREE.Color("#D7A0A8"), // Rose Gold
      new THREE.Color("#FFF1E6"), // Soft Ivory Pink
    ];
    const colorArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const c = palette[i % palette.length];
      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }
    return colorArray;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const p = petals[i];

      // Vertical drift with gentle horizontal wind turbulence
      p.y += p.vy * delta;
      p.x += Math.sin(time * 0.8 + p.swayOffset) * 0.3 * delta + p.vx * delta;
      p.z += Math.cos(time * 0.6 + p.swayOffset) * 0.2 * delta + p.vz * delta;

      // 3D tumbling rotation
      p.rotX += p.vRotX * delta;
      p.rotY += p.vRotY * delta;
      p.rotZ += p.vRotZ * delta;

      // Wrap around when falling below viewport
      if (p.y < -6) {
        p.y = 8 + Math.random() * 4;
        p.x = (Math.random() - 0.5) * 16;
        p.z = -2 + Math.random() * 8;
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
        color="#F8B7D0"
        roughness={0.4}
        metalness={0.1}
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

