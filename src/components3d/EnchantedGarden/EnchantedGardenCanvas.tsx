"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Butterflies3D } from "./Butterflies3D";
import { Fireflies3D } from "../Environment/Fireflies3D";
import { CherryBlossomPetals } from "../Environment/CherryBlossomPetals";

interface EnchantedGardenCanvasProps {
  isMobile: boolean;
}

function GardenAtmosphereCameraRig({ isMobile }: { isMobile: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });

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
    const parallax = isMobile ? 0.15 : 0.4;
    const targetX = mouse.current.x * parallax;
    const targetY = mouse.current.y * (parallax * 0.3);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
  });

  return null;
}

export function EnchantedGardenCanvas({ isMobile }: EnchantedGardenCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: isMobile ? 55 : 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? [1, 1.35] : [1, 1.75]}
      >
        {/* Soft Ambient Moonlit Garden Lighting */}
        <ambientLight intensity={0.6} color="#351D4D" />
        <directionalLight position={[4, 7, 4]} intensity={1.2} color="#FFF1E6" />
        <directionalLight position={[-4, -1, 2]} intensity={0.6} color="#F28DBB" />

        {/* Camera Parallax Rig */}
        <GardenAtmosphereCameraRig isMobile={isMobile} />

        {/* 1. Living Fairy Butterflies fluttering across the scenery */}
        <Butterflies3D count={isMobile ? 3 : 5} />

        {/* 2. Soft Swirling Fireflies wandering through the garden */}
        <Fireflies3D count={isMobile ? 30 : 55} />

        {/* 3. Delicate Pink Cherry Blossom & Rose Petals drifting on the evening breeze */}
        <CherryBlossomPetals count={isMobile ? 35 : 65} />
      </Canvas>
    </div>
  );
}
