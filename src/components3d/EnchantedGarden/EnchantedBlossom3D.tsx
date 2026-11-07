"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ReasonItem } from "@/config/reasonsConfig";

interface EnchantedBlossom3DProps {
  reason: ReasonItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isSelected?: boolean;
  isDiscovered?: boolean;
  onSelect: (reason: ReasonItem) => void;
}

export function EnchantedBlossom3D({
  reason,
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
  isSelected = false,
  isDiscovered = false,
  onSelect,
}: EnchantedBlossom3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const outerPetalsRef = useRef<THREE.Group>(null);
  const midPetalsRef = useRef<THREE.Group>(null);
  const innerPetalsRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);

  // Organic curved botanical petal geometry
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.08, 0.1, 0.14, 0.28, 0.11, 0.48);
    shape.bezierCurveTo(0.07, 0.62, -0.07, 0.62, -0.11, 0.48);
    shape.bezierCurveTo(-0.14, 0.28, -0.08, 0.1, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 12);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Delicate convex cup curvature
      const cup = Math.sin((y / 0.62) * Math.PI) * 0.08 - (x * x) * 0.35;
      pos.setZ(i, cup);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Delicate botanical leaf geometry
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.04, 0.06, 0.08, 0.18, 0.05, 0.32);
    shape.bezierCurveTo(0.02, 0.38, -0.02, 0.38, -0.05, 0.32);
    shape.bezierCurveTo(-0.08, 0.18, -0.04, 0.06, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 8);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(y * Math.PI) * 0.03 - (x * x) * 0.2);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Slim, natural curved stem
  const { stemGeometry, stemHeight } = useMemo(() => {
    const height = 0.52 + (reason.id % 4) * 0.06;
    const sway = ((reason.id % 5) - 2) * 0.035;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(sway * 0.4, height * 0.35, 0.015),
      new THREE.Vector3(sway * 0.8, height * 0.7, -0.01),
      new THREE.Vector3(sway, height, 0),
    ]);
    const geom = new THREE.TubeGeometry(curve, 16, 0.014, 8, false);
    return { stemGeometry: geom, stemHeight: height };
  }, [reason.id]);

  // Flower Color Palette
  const flowerColor = useMemo(() => new THREE.Color(reason.flowerColor), [reason.flowerColor]);
  const flowerAccent = useMemo(() => {
    const c = new THREE.Color(reason.flowerColor);
    c.offsetHSL(0.02, 0.08, 0.1);
    return c;
  }, [reason.flowerColor]);

  // Unique phase for natural desynchronization
  const phase = reason.id * 0.85;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Gentle natural garden breeze sway
    if (groupRef.current) {
      const windSway = Math.sin(time * 1.1 + phase) * 0.03 + Math.cos(time * 0.5 + phase) * 0.015;
      groupRef.current.rotation.z = rotation[2] + windSway;
      groupRef.current.rotation.x = rotation[0] + Math.sin(time * 0.8 + phase) * 0.015;

      const targetScale = scale * (isSelected ? 1.25 : hovered ? 1.15 : 1.0);
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    // 2. Blooming Flower Head Animation
    // Idle breathing (0.55), Hover bloom (0.85), Selected full bloom (1.0)
    const targetBloom = isSelected ? 1.0 : hovered ? 0.85 : 0.58 + Math.sin(time * 1.4 + phase) * 0.05;

    if (outerPetalsRef.current && midPetalsRef.current && innerPetalsRef.current) {
      const outerSpread = THREE.MathUtils.lerp(0.45, 1.15, targetBloom);
      outerPetalsRef.current.children.forEach((child) => {
        child.rotation.x = outerSpread;
      });

      const midSpread = THREE.MathUtils.lerp(0.32, 0.85, targetBloom);
      midPetalsRef.current.children.forEach((child) => {
        child.rotation.x = midSpread;
      });

      const innerSpread = THREE.MathUtils.lerp(0.18, 0.5, targetBloom);
      innerPetalsRef.current.children.forEach((child) => {
        child.rotation.x = innerSpread;
      });
    }

    // 3. Starlight Stamen Light Pulse
    if (lightRef.current) {
      const baseIntensity = isSelected ? 1.8 : hovered ? 1.3 : isDiscovered ? 0.9 : 0.5;
      lightRef.current.intensity = THREE.MathUtils.damp(
        lightRef.current.intensity,
        baseIntensity + Math.sin(time * 2.8 + phase) * 0.15,
        4.0,
        delta
      );
    }

    // 4. Ground Starlight Indicator Ring Pulse
    if (auraRef.current) {
      const auraPulse = 1.0 + Math.sin(time * 2.0 + phase) * 0.1;
      auraRef.current.scale.set(auraPulse, auraPulse, 1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(reason);
      }}
    >
      {/* 1. Delicate Starlight Ground Indicator (Subtle, elegant ring indicating tapability) */}
      <mesh ref={auraRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.15, 24]} />
        <meshBasicMaterial
          color={hovered || isSelected ? "#F5C77E" : isDiscovered ? "#F8B7D0" : flowerColor}
          transparent
          opacity={isSelected ? 0.8 : hovered ? 0.7 : isDiscovered ? 0.45 : 0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Natural Botanical Stem */}
      <mesh geometry={stemGeometry} castShadow>
        <meshStandardMaterial
          color="#2C4D35"
          roughness={0.4}
          metalness={0.08}
          emissive="#1B3322"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 3. Delicate Foliage Leaves */}
      <group position={[0.015, stemHeight * 0.35, 0]} rotation={[0.3, 0.2, 0.5]}>
        <mesh geometry={leafGeometry} scale={0.45}>
          <meshStandardMaterial color="#35583B" roughness={0.38} metalness={0.08} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[-0.015, stemHeight * 0.55, 0.01]} rotation={[-0.25, -0.3, -0.6]}>
        <mesh geometry={leafGeometry} scale={0.4}>
          <meshStandardMaterial color="#2E4E34" roughness={0.38} metalness={0.08} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 4. Sepal / Calyx Base */}
      <group position={[0, stemHeight, 0]}>
        <mesh position={[0, -0.02, 0]}>
          <coneGeometry args={[0.05, 0.06, 6]} />
          <meshStandardMaterial color="#223C27" roughness={0.45} />
        </mesh>
      </group>

      {/* 5. Blooming Flower Head */}
      <group ref={headRef} position={[0, stemHeight, 0]}>
        {/* Outer Whorl: 5 naturally curved petals */}
        <group ref={outerPetalsRef}>
          {[0, 1, 2, 3, 4].map((idx) => {
            const angle = (idx / 5) * Math.PI * 2;
            return (
              <group key={`outer-${idx}`} rotation={[0, angle, 0]}>
                <mesh
                  geometry={petalGeometry}
                  scale={0.32}
                  position={[0, 0, 0.025]}
                  rotation={[0.65, 0, 0]}
                  castShadow
                >
                  <meshStandardMaterial
                    color={flowerColor}
                    roughness={0.3}
                    metalness={0.12}
                    emissive={flowerColor}
                    emissiveIntensity={isSelected ? 0.35 : hovered ? 0.25 : 0.08}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Middle Whorl: 5 interleaved blossoming petals */}
        <group ref={midPetalsRef}>
          {[0, 1, 2, 3, 4].map((idx) => {
            const angle = (idx / 5) * Math.PI * 2 + 0.35;
            return (
              <group key={`mid-${idx}`} rotation={[0, angle, 0]}>
                <mesh
                  geometry={petalGeometry}
                  scale={0.25}
                  position={[0, 0.015, 0.02]}
                  rotation={[0.45, 0, 0]}
                  castShadow
                >
                  <meshStandardMaterial
                    color={flowerAccent}
                    roughness={0.28}
                    metalness={0.14}
                    emissive={flowerAccent}
                    emissiveIntensity={isSelected ? 0.4 : hovered ? 0.3 : 0.12}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Inner Cup: 4 heart petals */}
        <group ref={innerPetalsRef}>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx / 4) * Math.PI * 2 + 0.7;
            return (
              <group key={`inner-${idx}`} rotation={[0, angle, 0]}>
                <mesh
                  geometry={petalGeometry}
                  scale={0.18}
                  position={[0, 0.03, 0.015]}
                  rotation={[0.25, 0, 0]}
                  castShadow
                >
                  <meshStandardMaterial
                    color="#FFF1E6"
                    roughness={0.25}
                    metalness={0.15}
                    emissive={flowerColor}
                    emissiveIntensity={isSelected ? 0.5 : hovered ? 0.35 : 0.15}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Golden Starlight Stamen Core */}
        <mesh position={[0, 0.045, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial
            color="#F5C77E"
            emissive="#F5C77E"
            emissiveIntensity={isSelected ? 1.0 : hovered ? 0.8 : 0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Delicate Stamen Pollen Tips */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={`tip-${i}`} position={[Math.cos(a) * 0.022, 0.06, Math.sin(a) * 0.022]}>
              <sphereGeometry args={[0.008, 8, 8]} />
              <meshBasicMaterial color="#FFF1E6" />
            </mesh>
          );
        })}

        {/* Local Restrained Warm Starlight Point Light */}
        <pointLight
          ref={lightRef}
          color={reason.flowerColor}
          intensity={0.6}
          distance={1.4}
          decay={2}
          position={[0, 0.08, 0]}
        />
      </group>
    </group>
  );
}

