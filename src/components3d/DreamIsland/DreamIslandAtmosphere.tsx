"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SunsetPetals3D } from "./SunsetPetals3D";
import { Fireflies3D } from "../Environment/Fireflies3D";

interface DreamIslandAtmosphereProps {
  isMobile: boolean;
}

function IslandAmbientCameraRig({ isMobile }: { isMobile: boolean }) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera;
    const parallax = isMobile ? 0.06 : 0.16;
    const targetX = mouse.current.x * parallax;
    const targetY = mouse.current.y * (parallax * 0.2);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.0, delta);
  });

  return null;
}

/**
 * Very light, non-intrusive atmospheric particles over the cinematic video.
 * Subtle falling sakura petals and soft golden stardust motes.
 */
export function DreamIslandAtmosphere({ isMobile }: DreamIslandAtmosphereProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: isMobile ? 55 : 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        {/* Clean, pure warm twilight lighting that preserves petal blossom colors */}
        <ambientLight intensity={0.8} color="#FFF0F5" />
        <directionalLight position={[4, 5, 3]} intensity={1.0} color="#FFF2DE" />

        <IslandAmbientCameraRig isMobile={isMobile} />

        {/* Delicate Falling Cherry Blossom Petals */}
        <SunsetPetals3D count={isMobile ? 16 : 30} />

        {/* Soft Wandering Golden Stardust Motes */}
        <Fireflies3D count={isMobile ? 15 : 28} />
      </Canvas>
    </div>
  );
}
