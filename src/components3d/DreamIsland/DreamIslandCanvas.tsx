"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SkyLanterns3D } from "./SkyLanterns3D";
import { SunsetPetals3D } from "./SunsetPetals3D";
import { FloatingClouds3D } from "./FloatingClouds3D";
import { Waterfall3D } from "./WaterfallMist3D";
import { Butterflies3D } from "../EnchantedGarden/Butterflies3D";
import { Fireflies3D } from "../Environment/Fireflies3D";
import { IslandLandmarks3D } from "./IslandLandmarks3D";
import { LandmarkExperience } from "@/config/dreamsConfig";

interface DreamIslandCanvasProps {
  isMobile: boolean;
  selectedLandmark?: LandmarkExperience | null;
  onSelectLandmark?: (landmark: LandmarkExperience) => void;
  discoveredIds?: string[];
}

function IslandCinematicCameraRig({
  isMobile,
  selectedLandmark,
}: {
  isMobile: boolean;
  selectedLandmark: LandmarkExperience | null;
}) {
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
    const t = state.clock.getElapsedTime();

    // Idle organic breathing drift (never completely static)
    const idleDriftX = Math.sin(t * 0.35) * 0.1;
    const idleDriftY = Math.cos(t * 0.28) * 0.06;

    // Mouse parallax
    const parallaxFactor = isMobile ? 0.14 : 0.35;
    const mouseX = mouse.current.x * parallaxFactor;
    const mouseY = mouse.current.y * (parallaxFactor * 0.28);

    let targetX = mouseX + idleDriftX;
    let targetY = mouseY + idleDriftY;
    let targetZ = isMobile ? 5.4 : 5.0;

    // When a landmark is selected: smoothly track & zoom into that 3D location
    if (selectedLandmark) {
      targetX = selectedLandmark.threePosition[0] * 0.45 + mouseX * 0.2;
      targetY = selectedLandmark.threePosition[1] * 0.45 + mouseY * 0.2;
      targetZ = isMobile ? 4.3 : 3.8; // Dramatic cinematic focus
    }

    // Smooth spring damping
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.2, delta);

    // Subtle camera look-at tilt
    camera.rotation.y = THREE.MathUtils.damp(camera.rotation.y, -mouseX * 0.05, 2.0, delta);
    camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, mouseY * 0.04, 2.0, delta);
  });

  return null;
}

export function DreamIslandCanvas({
  isMobile,
  selectedLandmark = null,
  onSelectLandmark = () => {},
  discoveredIds = [],
}: DreamIslandCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: isMobile ? 55 : 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        {/* Warm Golden Hour & Sunset Twilight Lighting */}
        <ambientLight intensity={0.7} color="#351744" />
        <directionalLight position={[5, 6, 3]} intensity={1.6} color="#FFA850" />
        <directionalLight position={[-4, -1, 2]} intensity={0.7} color="#F8B7D0" />
        <pointLight position={[0, 0, 2]} intensity={0.5} color="#FFD280" />

        {/* Cinematic Camera Rig with Landmark Focus */}
        <IslandCinematicCameraRig
          isMobile={isMobile}
          selectedLandmark={selectedLandmark}
        />

        {/* 1. Depth-Separated Layered Floating Clouds (Foreground, Midground, Horizon) */}
        <FloatingClouds3D />

        {/* 2. Cascading 3D Waterfall UV Flow & Billowing Splash Mist */}
        <Waterfall3D />

        {/* 3. Detailed Floating 3D Sky Lanterns (Pagoda caps, rice paper, flicker) */}
        <SkyLanterns3D count={isMobile ? 14 : 26} />

        {/* 4. The 6 Luminous 3D Interactive Landmarks */}
        <IslandLandmarks3D
          selectedLandmark={selectedLandmark}
          onSelectLandmark={onSelectLandmark}
          discoveredIds={discoveredIds}
        />

        {/* 5. Living Fairy Butterflies Fluttering Across Scenery */}
        <Butterflies3D count={isMobile ? 3 : 5} />

        {/* 6. Drifting Sunset Flower Petals */}
        <SunsetPetals3D count={isMobile ? 25 : 55} />

        {/* 7. Glistening Golden Dust & Fireflies */}
        <Fireflies3D count={isMobile ? 25 : 48} />
      </Canvas>
    </div>
  );
}
