"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Envelope3D } from "./Envelope3D";
import { RosePetals3D } from "./RosePetals3D";

interface EnvelopeCanvasProps {
  isOpen: boolean;
  onOpen: () => void;
  onHover?: (hovered: boolean) => void;
}

function CameraRig({ isOpen }: { isOpen: boolean }) {
  const { size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  const isMobile = size.width < 768;
  const aspect = size.width / size.height;
  // On mobile portrait, adjust camera distance so the envelope never clips horizontally
  const baseZ = isMobile ? Math.max(7.2, 5.6 / Math.max(0.62, aspect)) : 5.6;
  const targetZ = isOpen ? (isMobile ? 6.2 : 5.0) : baseZ;
  const targetY = isOpen ? (isMobile ? 0.35 : 0.2) : (isMobile ? -0.1 : -0.05);

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

    const parallaxFactor = isMobile ? 0.2 : 0.35;
    const desiredX = mouse.current.x * parallaxFactor;
    const desiredY = targetY + mouse.current.y * (parallaxFactor * 0.6);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.2, delta);

    camera.lookAt(0, targetY, 0);
  });

  return null;
}

export function EnvelopeCanvas({ isOpen, onOpen, onHover }: EnvelopeCanvasProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, -0.05, 5.6], fov: 46 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? [1, 1.35] : [1, 1.75]}
      >
        {/* Soft Warm Candle Ambient Light */}
        <ambientLight intensity={0.8} color="#FFF1E6" />

        {/* Warm Directional Light matching the lantern on the left */}
        <directionalLight
          position={[-3, 4, 3]}
          intensity={1.4}
          color="#F5C77E"
        />

        {/* Gentle Soft Fill from front */}
        <directionalLight
          position={[3, 2, 4]}
          intensity={0.9}
          color="#FFF8F0"
        />

        <CameraRig isOpen={isOpen} />

        {/* 3D Floating Rose Petals */}
        <RosePetals3D count={65} />

        {/* 3D Wax-Sealed Vintage Cream Envelope */}
        <Envelope3D
          isOpen={isOpen}
          onOpen={onOpen}
          onHover={onHover}
        />
      </Canvas>
    </div>
  );
}
