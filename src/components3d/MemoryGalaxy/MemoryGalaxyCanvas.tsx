"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MemoryFrame3D } from "./MemoryFrame3D";
import { ConstellationLines3D } from "./ConstellationLines3D";
import { Starfield3D } from "../Environment/Starfield3D";
import { Fireflies3D } from "../Environment/Fireflies3D";
import { RosePetals3D } from "../Envelope/RosePetals3D";
import { memoriesConfig, MemoryItem } from "@/config/memoriesConfig";

interface MemoryGalaxyCanvasProps {
  featuredIndex: number;
  onSelectFeatured: (index: number) => void;
  onOpenViewer: (memory: MemoryItem) => void;
  selectedMemory: MemoryItem | null;
  isMobile: boolean;
}

function CameraRig({
  selectedMemory,
  isMobile,
}: {
  selectedMemory: MemoryItem | null;
  isMobile: boolean;
}) {
  const mouse = useRef({ x: 0, y: 0 });

  const baseZ = isMobile ? 8.0 : 7.1;
  const targetZ = selectedMemory ? (isMobile ? 6.8 : 5.0) : baseZ;

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

    const parallax = isMobile ? 0.2 : 0.55;
    const desiredX = mouse.current.x * parallax;
    const desiredY = -0.06 + mouse.current.y * (parallax * 0.4);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.0, delta);

    camera.lookAt(0, -0.06, 0);
  });

  return null;
}

export function MemoryGalaxyCanvas({
  featuredIndex,
  onSelectFeatured,
  onOpenViewer,
  selectedMemory,
  isMobile,
}: MemoryGalaxyCanvasProps) {
  // Desktop Spatial Slot Coordinates:
  // Spread across full screen width at 1920x864, 1440x900, and 1366x768
  // Zero collision, zero overlap:
  // Slot 0: Centre (Featured Photo 1)
  // Slot 1: Upper-Left (Photo 2)
  // Slot 2: Lower-Left (Photo 3)
  // Slot 3: Upper-Right (Photo 4)
  // Slot 4: Middle-Right (Photo 5)
  // Slot 5: Lower-Right (Photo 6)
  const desktopSlots: { pos: [number, number, number]; rot: [number, number, number] }[] = useMemo(
    () => [
      // Slot 0: Centre (Featured, ~1.36x scale)
      { pos: [0.0, -0.05, 0.25], rot: [0.0, 0.0, 0.0] },
      // Slot 1: Upper-Left (Photo 2)
      { pos: [-3.4, 0.70, 0.0], rot: [0.04, 0.12, -0.02] },
      // Slot 2: Lower-Left (Photo 3)
      { pos: [-3.4, -0.75, 0.0], rot: [-0.04, 0.12, 0.02] },
      // Slot 3: Upper-Right (Photo 4)
      { pos: [2.70, 0.72, 0.0], rot: [0.04, -0.12, 0.02] },
      // Slot 4: Middle-Right (Photo 5)
      { pos: [4.30, -0.05, 0.05], rot: [0.0, -0.14, 0.0] },
      // Slot 5: Lower-Right (Photo 6)
      { pos: [2.55, -0.82, -0.05], rot: [-0.04, -0.1, -0.02] },
    ],
    []
  );

  // Map the 6 memories:
  // memoriesConfig.memories[featuredIndex] is ALWAYS in Slot 0 (Center),
  // and the remaining 5 memories fill Slots 1..5 in stable order.
  const mappedSlots = useMemo(() => {
    const allMemories = memoriesConfig.memories;
    const featuredMemory = allMemories[featuredIndex] || allMemories[0];

    // Surrounding 5 memories
    const surroundingMemories = allMemories
      .map((mem, origIdx) => ({ mem, origIdx }))
      .filter(({ origIdx }) => origIdx !== featuredIndex);

    return [
      {
        memory: featuredMemory,
        origIdx: featuredIndex,
        isFeatured: true,
        pos: desktopSlots[0].pos,
        rot: desktopSlots[0].rot,
      },
      ...surroundingMemories.map(({ mem, origIdx }, slotIdx) => ({
        memory: mem,
        origIdx,
        isFeatured: false,
        pos: desktopSlots[slotIdx + 1]?.pos || [0, 0, 0],
        rot: desktopSlots[slotIdx + 1]?.rot || [0, 0, 0],
      })),
    ];
  }, [featuredIndex, desktopSlots]);

  const constellationPositions = useMemo(
    () => desktopSlots.map((s) => s.pos),
    [desktopSlots]
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, -0.06, 7.1], fov: 46 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? [1, 1.35] : [1, 1.75]}
      >
        <ambientLight intensity={0.9} color="#392057" />
        <directionalLight
          position={[5, 7, 5]}
          intensity={1.5}
          color="#FFF1E6"
        />
        <directionalLight
          position={[-5, -4, -3]}
          intensity={0.9}
          color="#D95BCB"
        />

        <CameraRig selectedMemory={selectedMemory} isMobile={isMobile} />

        {/* 1. Deep Space Twinkling Starfield & Shooting Stars (Circular Natural Stardust) */}
        <Starfield3D />

        {/* 2. Delicate Constellation Lines connecting Center to 5 surrounding stars (Behind photos) */}
        {!isMobile && (
          <ConstellationLines3D positions={constellationPositions} />
        )}

        {/* 3. Wandering Cosmic Stardust & Fireflies (Circular Sprites) */}
        <Fireflies3D count={45} />

        {/* 4. Slowly Drifting Romantic Rose Petals */}
        <RosePetals3D count={24} />

        {/* 5. Memory Photographs: Exactly 6 (1 Large Center + 5 Surrounding) */}
        {isMobile ? (
          // Mobile Mode: Featured memory in the center
          <MemoryFrame3D
            memory={memoriesConfig.memories[featuredIndex]}
            position={[0, 0.05, 0.35]}
            rotation={[0, 0, 0]}
            index={featuredIndex}
            isFeatured={true}
            onSelect={() => onOpenViewer(memoriesConfig.memories[featuredIndex])}
          />
        ) : (
          // Desktop Mode: Exactly 6 photographs with wide horizontal spread & zero collision
          mappedSlots.map((slot) => (
            <MemoryFrame3D
              key={`frame-slot-${slot.origIdx}-${slot.memory.id}`}
              memory={slot.memory}
              position={slot.pos as [number, number, number]}
              rotation={slot.rot as [number, number, number]}
              index={slot.origIdx}
              isFeatured={slot.isFeatured}
              onSelect={() => {
                onSelectFeatured(slot.origIdx);
                onOpenViewer(slot.memory);
              }}
            />
          ))
        )}
      </Canvas>
    </div>
  );
}
