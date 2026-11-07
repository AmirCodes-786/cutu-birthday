"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dreamsConfig, LandmarkExperience } from "@/config/dreamsConfig";

interface IslandLandmarks3DProps {
  selectedLandmark?: LandmarkExperience | null;
  onSelectLandmark?: (landmark: LandmarkExperience) => void;
  discoveredIds?: string[];
}

export function IslandLandmarks3D({
  selectedLandmark = null,
  onSelectLandmark = () => {},
  discoveredIds = [],
}: IslandLandmarks3DProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <group>
      {dreamsConfig.landmarks.map((landmark) => {
        const isSelected = selectedLandmark?.id === landmark.id;
        const isHovered = hoveredId === landmark.id;
        const isDiscovered = Boolean(Array.isArray(discoveredIds) && discoveredIds.includes(landmark.id));

        return (
          <SingleLandmark3D
            key={`3d-landmark-${landmark.id}`}
            landmark={landmark}
            isSelected={isSelected}
            isHovered={isHovered}
            isDiscovered={isDiscovered}
            onSelect={() => onSelectLandmark(landmark)}
            onHover={(h) => setHoveredId(h ? landmark.id : null)}
          />
        );
      })}
    </group>
  );
}

function SingleLandmark3D({
  landmark,
  isSelected,
  isHovered,
  isDiscovered,
  onSelect,
  onHover,
}: {
  landmark: LandmarkExperience;
  isSelected: boolean;
  isHovered: boolean;
  isDiscovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  // Position based on threePosition from config
  const pos = landmark.threePosition;
  const accent = useMemo(() => new THREE.Color(landmark.accentColor), [landmark.accentColor]);
  const gold = useMemo(() => new THREE.Color("#F5C77E"), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const speedMult = isHovered || isSelected ? 2.5 : 1.0;

    // Gentle floating bob
    groupRef.current.position.y = pos[1] + Math.sin(t * 1.5 + parseInt(landmark.number)) * 0.05;

    // Rotate core artifact
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8 * speedMult;
      coreRef.current.rotation.x = Math.sin(t * 0.9) * 0.15;
    }

    // Spin orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 1.2 * speedMult;
      ring1Ref.current.rotation.y += delta * 0.6 * speedMult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 1.4 * speedMult;
      ring2Ref.current.rotation.z -= delta * 0.8 * speedMult;
    }

    // Scale breathing
    const targetScale = isSelected ? 1.35 : isHovered ? 1.25 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Light beam pulse when selected
    if (beamRef.current) {
      beamRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[pos[0], pos[1], pos[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(false);
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 1. Unique Landmark Core Geometry */}
      {renderLandmarkCore(landmark.theme, coreRef, accent, isSelected || isHovered)}

      {/* 2. Concentric Orbital Starlight Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.26, 0.012, 8, 24]} />
        <meshStandardMaterial
          color={gold}
          emissive={gold}
          emissiveIntensity={isSelected || isHovered ? 1.2 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.32, 0.009, 8, 24]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={isSelected || isHovered ? 1.4 : 0.5}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* 3. Soft Atmospheric Glow Halo */}
      <mesh>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={isSelected ? 0.35 : isHovered ? 0.28 : isDiscovered ? 0.18 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Ascending Starlight Pillar Beam (Activates when selected or hovered) */}
      {(isSelected || isHovered) && (
        <mesh ref={beamRef} position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.22, 2.4, 12, 1, true]} />
          <meshBasicMaterial
            color={gold}
            transparent
            opacity={isSelected ? 0.45 : 0.25}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Renders bespoke 3D geometric artifact for each of the 6 landmark themes
 */
function renderLandmarkCore(
  theme: LandmarkExperience["theme"],
  ref: React.RefObject<THREE.Mesh | null>,
  accent: THREE.Color,
  highlighted: boolean
) {
  const emissiveInt = highlighted ? 1.6 : 0.9;

  switch (theme) {
    case "gate":
      // 01: Celestial Arch Gateway Core
      return (
        <mesh ref={ref}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#FFF1D0"
            emissive={accent}
            emissiveIntensity={emissiveInt}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      );

    case "cottage":
      // 02: Hearth Amber Faceted Crystal
      return (
        <mesh ref={ref}>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#FFA86B"
            emissive={accent}
            emissiveIntensity={emissiveInt}
            roughness={0.15}
            metalness={0.3}
          />
        </mesh>
      );

    case "tree":
      // 03: Rose Quartz Cherry Blossom Icosahedron
      return (
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.17, 0]} />
          <meshStandardMaterial
            color="#FFD4E5"
            emissive={accent}
            emissiveIntensity={emissiveInt}
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>
      );

    case "lake":
      // 04: Aquamarine Ripple Crystal Sphere
      return (
        <mesh ref={ref}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshPhysicalMaterial
            color="#D0F0FF"
            emissive={accent}
            emissiveIntensity={emissiveInt}
            roughness={0.1}
            metalness={0.1}
            transmission={0.4}
            transparent
            opacity={0.9}
          />
        </mesh>
      );

    case "observatory":
      // 05: Golden Astrolabe Octahedron
      return (
        <mesh ref={ref}>
          <octahedronGeometry args={[0.18, 1]} />
          <meshStandardMaterial
            color="#FFE59E"
            emissive={accent}
            emissiveIntensity={emissiveInt}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      );

    case "horizon":
      // 06: Grand Radiant Solar Star Prism
      return (
        <mesh ref={ref}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#FFD6F8"
            emissive={accent}
            emissiveIntensity={emissiveInt + 0.4}
            roughness={0.15}
            metalness={0.5}
          />
        </mesh>
      );
  }
}
