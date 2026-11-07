"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Flower3D } from "./Flower3D";
import { Fireflies3D } from "../Environment/Fireflies3D";
import { CherryBlossomPetals } from "../Environment/CherryBlossomPetals";
import { reasonsConfig, ReasonItem } from "@/config/reasonsConfig";

interface GardenCanvasProps {
  selectedReason: ReasonItem | null;
  discoveredIds: number[];
  onSelectReason: (reason: ReasonItem) => void;
  isMobile: boolean;
}

function GardenCameraRig({
  selectedReason,
  isMobile,
}: {
  selectedReason: ReasonItem | null;
  isMobile: boolean;
}) {
  const mouse = useRef({ x: 0, y: 0 });

  const baseZ = isMobile ? 8.2 : 6.8;
  const baseY = isMobile ? 0.2 : 0.0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera;
    const parallax = isMobile ? 0.25 : 0.6;

    const targetX = mouse.current.x * parallax;
    const targetY = baseY + mouse.current.y * (parallax * 0.4);
    const targetZ = selectedReason ? baseZ - 0.6 : baseZ;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.0, delta);

    camera.lookAt(0, -0.3, 0);
  });

  return null;
}

export function GardenCanvas({
  selectedReason,
  discoveredIds,
  onSelectReason,
  isMobile,
}: GardenCanvasProps) {
  // Spatial arrangement of the 12 magical flowers in the moonlit garden
  const flowerPlacements: {
    pos: [number, number, number];
    rot: [number, number, number];
    scale: number;
  }[] = useMemo(
    () => [
      // Left Garden Flank
      { pos: [-2.9, -1.35, 2.1], rot: [0.05, 0.35, -0.06], scale: 1.15 }, // Reason 1 (Velvet Rose - Foreground)
      { pos: [-1.85, -1.1, 1.4], rot: [0.02, 0.2, -0.03], scale: 1.05 }, // Reason 2 (Moonlit Lotus)
      { pos: [-3.3, -0.75, 0.6], rot: [0.08, 0.45, -0.08], scale: 0.95 }, // Reason 3 (Starlight Orchid)
      { pos: [-2.15, -0.45, -0.3], rot: [0.04, 0.25, -0.02], scale: 0.85 }, // Reason 4 (Crystal Peony - Terrace)

      // Center Pathway Flank
      { pos: [-0.85, -1.15, 1.8], rot: [0.02, 0.1, -0.04], scale: 1.1 }, // Reason 5 (Golden Dahlia - Path Left)
      { pos: [0.75, -1.1, 1.7], rot: [0.02, -0.15, 0.04], scale: 1.1 }, // Reason 6 (Cherry Blossom - Path Right)
      { pos: [-0.45, -0.65, 0.4], rot: [0.04, 0.08, -0.02], scale: 0.9 }, // Reason 7 (Amethyst Violet - Mid Path)
      { pos: [0.55, -0.4, -0.3], rot: [0.04, -0.1, 0.02], scale: 0.85 }, // Reason 8 (Blush Camellia - Gazebo Steps)

      // Right Garden Flank
      { pos: [1.95, -1.05, 1.4], rot: [0.03, -0.22, 0.03], scale: 1.05 }, // Reason 9 (Celestial Iris)
      { pos: [3.05, -1.3, 2.0], rot: [0.06, -0.4, 0.07], scale: 1.15 }, // Reason 10 (Imperial Tulip - Foreground)
      { pos: [2.35, -0.5, 0.0], rot: [0.04, -0.28, 0.02], scale: 0.88 }, // Reason 11 (Rose Gold Magnolia - Terrace)
      { pos: [3.35, -0.68, 0.7], rot: [0.07, -0.45, 0.08], scale: 0.95 }, // Reason 12 (Eternal Star Lily)
    ],
    []
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 8.2 : 6.8], fov: isMobile ? 52 : 46 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2.5]}
      >
        {/* Garden Lighting System */}
        <ambientLight intensity={0.85} color="#2D1548" />
        <directionalLight
          position={[4, 8, 4]}
          intensity={1.7}
          color="#FFF1E6" // Soft silvery moonlight
          castShadow
        />
        <directionalLight
          position={[-5, -2, -2]}
          intensity={0.9}
          color="#F28DBB" // Romantic pink garden bounce
        />
        <pointLight
          position={[0, 1.5, -1.0]}
          intensity={1.8}
          color="#F5C77E" // Warm lantern glow from the gazebo
          distance={8}
          decay={2}
        />

        {/* Camera Parallax and Focus Rig */}
        <GardenCameraRig selectedReason={selectedReason} isMobile={isMobile} />

        {/* 1. Swirling Garden Fireflies wandering around the blossoms */}
        <Fireflies3D count={isMobile ? 30 : 60} />

        {/* 3. Soft Cherry Blossom Petals drifting on the garden breeze */}
        <CherryBlossomPetals count={isMobile ? 35 : 75} />

        {/* 4. The 12 Enchanted 3D Flowers */}
        {reasonsConfig.reasons.map((reason, idx) => {
          const placement = flowerPlacements[idx] || {
            pos: [0, 0, 0],
            rot: [0, 0, 0],
            scale: 1.0,
          };
          const isSelected = selectedReason?.id === reason.id;
          const isDiscovered = discoveredIds.includes(reason.id);

          return (
            <Flower3D
              key={`flower-${reason.id}`}
              reason={reason}
              position={placement.pos}
              rotation={placement.rot}
              scale={placement.scale}
              isSelected={isSelected}
              isDiscovered={isDiscovered}
              onSelect={onSelectReason}
            />
          );
        })}
      </Canvas>
    </div>
  );
}

