"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Cake3D } from "./Cake3D";
import { CelebrationConfetti3D } from "./CelebrationConfetti3D";

interface FinaleCanvasProps {
  candlesLit: boolean;
  isExtinguishing: boolean;
  isWishing: boolean;
  isCelebration: boolean;
  onBlowCandles?: () => void;
  isMobile?: boolean;
}

function CameraRig({
  isMobile = false,
  isWishing = false,
  isCelebration = false,
}: {
  isMobile?: boolean;
  isWishing?: boolean;
  isCelebration?: boolean;
}) {
  const { size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const _aspect = size.width / size.height;
  // Responsive camera setup matching the flat background photograph perspective:
  // With fixed vertical FOV (38°), baseZ = 3.85 guarantees identical vertical alignment
  // on both desktop and mobile, landing the cake base precisely on the marble stand (Screen Y = 70.5%)
  const baseZ = 3.85;
  const targetZ = isWishing ? baseZ - 0.35 : isCelebration ? baseZ + 0.1 : baseZ;
  const targetY = 0.22;
  const lookY = -0.42;

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
    // Subtle parallax that preserves alignment with the 2D background stand
    const factor = isMobile ? 0.04 : 0.08;
    const desiredX = mouse.current.x * factor;
    const desiredY = targetY + mouse.current.y * (factor * 0.3);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.2, delta);

    camera.lookAt(0, lookY, 0);
  });

  return null;
}

export function FinaleCanvas({
  candlesLit,
  isExtinguishing,
  isWishing,
  isCelebration,
  onBlowCandles,
  isMobile = false,
}: FinaleCanvasProps) {
  // Cake sits precisely on the marble disc surface of the background stand (Screen Y = 70.5%)
  const cakeY = -0.99;
  const cakeScale = isMobile ? 0.80 : 0.85;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.22, 3.85], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? [1, 1.35] : [1, 1.75]}
      >
        {/* Soft Warm Ambient Light harmonizing with moonlit garden */}
        <ambientLight
          intensity={isWishing ? 0.35 : isCelebration ? 0.65 : 0.52}
          color="#FFF6EE"
        />

        {/* Key Directional Light (matching top-right lantern glow in photo) */}
        <directionalLight
          position={[3.5, 4.5, 3.5]}
          intensity={isWishing ? 0.5 : 0.95}
          color="#FFE8CC"
          castShadow
        />

        {/* Cool Rim Light (matching moonlit water reflection in photo) */}
        <directionalLight
          position={[-3.5, 3.5, -2.5]}
          intensity={0.65}
          color="#D4C2FC"
        />

        {/* Soft Front Bounce Light */}
        <directionalLight
          position={[0, -2, 2.5]}
          intensity={0.25}
          color="#FFF0F5"
        />

        {/* Dynamic Candle Light casting onto frosting & nearby decor */}
        <pointLight
          position={[0, cakeY + 1.15, 0.4]}
          color="#FFAE42"
          intensity={candlesLit ? 1.2 : 0.15}
          distance={3.0}
          decay={2}
        />

        {/* Camera Rig matching the 2D photo perspective and scale */}
        <CameraRig
          isMobile={isMobile}
          isWishing={isWishing}
          isCelebration={isCelebration}
        />

        {/* 3D Birthday Cake grounded directly on the photo's gold stand */}
        <group position={[0, cakeY, 0]} scale={cakeScale}>
          <Cake3D
            candlesLit={candlesLit}
            isExtinguishing={isExtinguishing}
            isWishing={isWishing}
            onBlowCandles={onBlowCandles}
            isMobile={isMobile}
          />
        </group>

        {/* Realistic Birthday Celebration Confetti & Petals */}
        <CelebrationConfetti3D active={isCelebration} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
