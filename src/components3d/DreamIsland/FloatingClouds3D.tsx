"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CloudCluster {
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleY: number;
  speed: number;
  opacity: number;
  color: string;
}

/**
 * Organic, soft multi-plane floating clouds without rectangular edges.
 * Generates true circular Gaussian feathered textures and moves across 3 depth planes.
 */
export function FloatingClouds3D() {
  const groupRef = useRef<THREE.Group>(null);

  // Soft Gaussian radial cloud texture with feathered edges
  const cloudTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
    grad.addColorStop(0.3, "rgba(255, 235, 245, 0.45)");
    grad.addColorStop(0.65, "rgba(240, 195, 230, 0.12)");
    grad.addColorStop(0.95, "rgba(220, 175, 215, 0.02)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // 10 soft cloud clusters across depth planes
  const clouds = useMemo<CloudCluster[]>(() => {
    return [
      // Foreground low clouds (drifting in front of island base & camera)
      { x: -6, y: -3.0, z: 2.2, scaleX: 4.8, scaleY: 2.2, speed: 0.07, opacity: 0.28, color: "#FFF0F8" },
      { x: 1, y: -3.4, z: 2.5, scaleX: 5.6, scaleY: 2.4, speed: 0.05, opacity: 0.24, color: "#FFE4F0" },
      { x: 8, y: -2.8, z: 2.0, scaleX: 5.0, scaleY: 2.0, speed: 0.065, opacity: 0.26, color: "#FFF0F5" },

      // Midground cliff mist (clinging to the floating island base & waterfalls)
      { x: -3.8, y: -1.8, z: 0.6, scaleX: 3.6, scaleY: 1.6, speed: 0.035, opacity: 0.32, color: "#FFDCE9" },
      { x: 0.2, y: -2.2, z: 0.4, scaleX: 4.0, scaleY: 1.8, speed: 0.04, opacity: 0.3, color: "#FFCEE2" },
      { x: 4.2, y: -2.0, z: 0.5, scaleX: 3.4, scaleY: 1.5, speed: 0.038, opacity: 0.28, color: "#FFD9E8" },

      // Distant horizon haze clouds (drifting across the sunset horizon)
      { x: -7, y: 1.0, z: -2.5, scaleX: 6.5, scaleY: 2.5, speed: 0.018, opacity: 0.18, color: "#FFA6C0" },
      { x: 0, y: 1.6, z: -2.8, scaleX: 7.2, scaleY: 2.8, speed: 0.022, opacity: 0.2, color: "#FF92B2" },
      { x: 6, y: 0.6, z: -2.2, scaleX: 5.8, scaleY: 2.2, speed: 0.016, opacity: 0.16, color: "#D97DC2" },
    ];
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children as THREE.Mesh[];

    clouds.forEach((cloud, i) => {
      cloud.x += cloud.speed * delta;
      // Loop seamlessly across screen width
      if (cloud.x > 12.0) {
        cloud.x = -12.0;
      }
      if (children[i]) {
        children[i].position.x = cloud.x;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh
          key={`cloud-cluster-${i}`}
          position={[cloud.x, cloud.y, cloud.z]}
          scale={[cloud.scaleX, cloud.scaleY, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={cloudTexture || undefined}
            transparent
            opacity={cloud.opacity}
            color={cloud.color}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
