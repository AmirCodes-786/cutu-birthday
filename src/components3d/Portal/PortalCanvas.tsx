"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HeartPortal3D } from "./HeartPortal3D";
import { Starfield3D } from "../Environment/Starfield3D";
import { Fireflies3D } from "../Environment/Fireflies3D";
import { CherryBlossomPetals } from "../Environment/CherryBlossomPetals";
import { assetLoader } from "@/services/loadingManager";

interface PortalCanvasProps {
  isEntering: boolean;
  onEnterComplete: () => void;
  onPortalClick: () => void;
  onPortalHover?: (hovered: boolean) => void;
  onFirstFrame?: () => void;
}

function CameraRig({
  isEntering,
  onEnterComplete,
}: {
  isEntering: boolean;
  onEnterComplete: () => void;
}) {
  const { size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Calculate responsive camera position based on screen aspect ratio
  const isMobile = size.width < 768;
  const aspect = size.width / size.height;
  // On mobile portrait, move camera back so the 3D heart fits within narrow width
  const baseZ = isMobile ? Math.max(8.2, 6.5 / Math.max(0.65, aspect)) : 6.5;
  const baseY = isMobile ? 0.35 : 0.15;

  const targetZ = useRef(baseZ);

  useEffect(() => {
    targetZ.current = baseZ;
  }, [baseZ]);

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

  useEffect(() => {
    if (isEntering) {
      targetZ.current = -0.4; // Dive through the gateway
    }
  }, [isEntering]);

  useFrame((state, delta) => {
    const camera = state.camera;

    if (isEntering) {
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetZ.current,
        3.2,
        delta
      );
      camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 4.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, baseY, 4.0, delta);

      if (Math.abs(camera.position.z - targetZ.current) < 0.2) {
        onEnterComplete();
      }
    } else {
      // Natural responsive mouse parallax with gentle drift
      const parallaxFactor = isMobile ? 0.25 : 0.45;
      const desiredX = mouse.current.x * parallaxFactor;
      const desiredY = baseY + mouse.current.y * (parallaxFactor * 0.7);

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        desiredX,
        2.5,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        desiredY,
        2.5,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        baseZ,
        2.0,
        delta
      );
    }

    camera.lookAt(0, baseY, 0);
  });

  return null;
}

function FirstFrameReporter({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const signaled = useRef(false);
  useFrame(() => {
    if (!signaled.current) {
      signaled.current = true;
      assetLoader.markPortalFrameReady();
      onFirstFrame?.();
    }
  });
  return null;
}

export function PortalCanvas({
  isEntering,
  onEnterComplete,
  onPortalClick,
  onPortalHover,
  onFirstFrame,
}: PortalCanvasProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.25, 7.0], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? [1, 1.35] : [1, 1.75]}
      >
        <FirstFrameReporter onFirstFrame={onFirstFrame} />
        <ambientLight intensity={0.55} color="#392057" />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.2}
          color="#FFF1E6"
        />
        <directionalLight
          position={[-4, -3, -2]}
          intensity={0.6}
          color="#D95BCB"
        />

        <CameraRig
          isEntering={isEntering}
          onEnterComplete={onEnterComplete}
        />

        {/* Deep Twinkling Stars & Dynamic Shooting Stars */}
        <Starfield3D />

        {/* Delicate Wandering Fireflies */}
        <Fireflies3D count={35} />

        {/* Drifting Falling Cherry Blossom Petals in 3D */}
        <CherryBlossomPetals count={75} />

        {/* Living Starlight Gateway */}
        <HeartPortal3D
          isEntering={isEntering}
          onHover={onPortalHover}
          onClick={onPortalClick}
        />
      </Canvas>
    </div>
  );
}
