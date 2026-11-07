"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ReasonItem } from "@/config/reasonsConfig";

interface Flower3DProps {
  reason: ReasonItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isSelected?: boolean;
  isDiscovered?: boolean;
  onSelect: (reason: ReasonItem) => void;
}

export function Flower3D({
  reason,
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
  isSelected = false,
  isDiscovered = false,
  onSelect,
}: Flower3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const innerPetalsRef = useRef<THREE.Group>(null);
  const middlePetalsRef = useRef<THREE.Group>(null);
  const outerPetalsRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);

  // Generate an organic curved petal geometry with natural edges
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.12, 0.15, 0.22, 0.45, 0.16, 0.75);
    shape.bezierCurveTo(0.1, 0.95, -0.1, 0.95, -0.16, 0.75);
    shape.bezierCurveTo(-0.22, 0.45, -0.12, 0.15, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 12);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Curl petal outward and cup slightly inward along centerline
      const curl = Math.sin((y / 0.95) * Math.PI) * 0.12 - (x * x) * 0.25;
      pos.setZ(i, curl);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Organic curved leaf geometry
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.08, 0.1, 0.14, 0.3, 0.08, 0.5);
    shape.bezierCurveTo(0.03, 0.6, -0.03, 0.6, -0.08, 0.5);
    shape.bezierCurveTo(-0.14, 0.3, -0.08, 0.1, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 8);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(y * Math.PI) * 0.05 - (x * x) * 0.15);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Curved Stem Spline Path
  const { stemGeometry, stemHeight } = useMemo(() => {
    const height = 0.9 + (reason.id % 3) * 0.15;
    const sway = ((reason.id % 5) - 2) * 0.06;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(sway * 0.4, height * 0.35, 0.03),
      new THREE.Vector3(sway * 0.8, height * 0.7, -0.02),
      new THREE.Vector3(sway, height, 0),
    ]);
    const geom = new THREE.TubeGeometry(curve, 20, 0.022, 8, false);
    return { stemGeometry: geom, stemHeight: height };
  }, [reason.id]);

  // Flower Color Palette
  const flowerColor = useMemo(() => new THREE.Color(reason.flowerColor), [reason.flowerColor]);
  const flowerAccent = useMemo(() => {
    const c = new THREE.Color(reason.flowerColor);
    c.offsetHSL(0.04, 0.1, 0.1);
    return c;
  }, [reason.flowerColor]);

  // Phase offset for natural garden desynchronization
  const phase = reason.id * 0.73;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Natural Garden Wind Sway (Harmonic wind oscillation)
    if (groupRef.current) {
      const windSway = Math.sin(time * 1.2 + phase) * 0.04 + Math.cos(time * 0.6 + phase) * 0.02;
      groupRef.current.rotation.z = rotation[2] + windSway;
      groupRef.current.rotation.x = rotation[0] + Math.sin(time * 0.9 + phase) * 0.02;

      // Hover and Selection Scaling with smooth lerping
      const targetScale = scale * (isSelected ? 1.25 : hovered ? 1.15 : 1.0);
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    // 2. Blooming Flower Head Animation
    // Idle breathing (0.55..0.65), Hover bloom (0.85), Selected full bloom (1.0)
    const targetBloom = isSelected ? 1.0 : hovered ? 0.85 : 0.6 + Math.sin(time * 1.5 + phase) * 0.06;

    if (innerPetalsRef.current && middlePetalsRef.current && outerPetalsRef.current) {
      // Outer whorl opens widest
      const outerSpread = THREE.MathUtils.lerp(0.5, 1.25, targetBloom);
      outerPetalsRef.current.children.forEach((child, i) => {
        child.rotation.x = outerSpread;
      });

      // Middle whorl blossoms gracefully
      const middleSpread = THREE.MathUtils.lerp(0.35, 0.95, targetBloom);
      middlePetalsRef.current.children.forEach((child, i) => {
        child.rotation.x = middleSpread;
      });

      // Inner whorl unfolds tenderly
      const innerSpread = THREE.MathUtils.lerp(0.18, 0.55, targetBloom);
      innerPetalsRef.current.children.forEach((child, i) => {
        child.rotation.x = innerSpread;
      });
    }

    // 3. Flower Center Starlight Stamen Light Pulse
    if (lightRef.current) {
      const baseIntensity = isSelected ? 2.5 : hovered ? 1.8 : isDiscovered ? 1.2 : 0.7;
      lightRef.current.intensity = THREE.MathUtils.damp(
        lightRef.current.intensity,
        baseIntensity + Math.sin(time * 3.0 + phase) * 0.2,
        4.0,
        delta
      );
    }

    // 4. Ground Stardust Aura Ring Pulse
    if (auraRef.current) {
      const auraPulse = 1.0 + Math.sin(time * 2.2 + phase) * 0.12;
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
      {/* Interactive Ground Stardust Aura Ring (Indicates tapability) */}
      <mesh ref={auraRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.28, 24]} />
        <meshBasicMaterial
          color={hovered || isSelected ? "#F5C77E" : isDiscovered ? "#F8B7D0" : flowerColor}
          transparent
          opacity={isSelected ? 0.8 : hovered ? 0.7 : isDiscovered ? 0.45 : 0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Flower Stem */}
      <mesh geometry={stemGeometry} castShadow>
        <meshStandardMaterial
          color="#2A4731"
          roughness={0.45}
          metalness={0.1}
          emissive="#1B3320"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Foliage Leaves growing off the stem */}
      <group position={[0.02, stemHeight * 0.35, 0]} rotation={[0.4, 0.2, 0.6]}>
        <mesh geometry={leafGeometry} scale={0.55}>
          <meshStandardMaterial color="#35583B" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>
      <group position={[-0.02, stemHeight * 0.55, 0.01]} rotation={[-0.3, -0.4, -0.7]}>
        <mesh geometry={leafGeometry} scale={0.48}>
          <meshStandardMaterial color="#305036" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>

      {/* Calyx / Sepal Cup */}
      <group position={[0, stemHeight, 0]}>
        <mesh position={[0, -0.03, 0]}>
          <coneGeometry args={[0.08, 0.1, 6]} />
          <meshStandardMaterial color="#223B27" roughness={0.5} />
        </mesh>
      </group>

      {/* Blooming Flower Head (Curved concentric petal rings) */}
      <group ref={headRef} position={[0, stemHeight, 0]}>
        {/* Outer Whorl: 6 broad petals */}
        <group ref={outerPetalsRef}>
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const angle = (idx / 6) * Math.PI * 2;
            return (
              <group key={`outer-${idx}`} rotation={[0, angle, 0]}>
                <mesh
                  geometry={petalGeometry}
                  scale={0.42}
                  position={[0, 0, 0.04]}
                  rotation={[0.7, 0, 0]}
                  castShadow
                >
                  <meshStandardMaterial
                    color={flowerColor}
                    roughness={0.25}
                    metalness={0.15}
                    emissive={flowerColor}
                    emissiveIntensity={isSelected ? 0.4 : hovered ? 0.3 : 0.12}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Middle Whorl: 5 blossoming petals (interleaved angle) */}
        <group ref={middlePetalsRef}>
          {[0, 1, 2, 3, 4].map((idx) => {
            const angle = (idx / 5) * Math.PI * 2 + 0.35;
            return (
              <group key={`mid-${idx}`} rotation={[0, angle, 0]}>
                <mesh
                  geometry={petalGeometry}
                  scale={0.34}
                  position={[0, 0.02, 0.03]}
                  rotation={[0.5, 0, 0]}
                  castShadow
                >
                  <meshStandardMaterial
                    color={flowerAccent}
                    roughness={0.22}
                    metalness={0.18}
                    emissive={flowerAccent}
                    emissiveIntensity={isSelected ? 0.45 : hovered ? 0.35 : 0.15}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Inner Whorl: 4 delicate heart petals */}
        <group ref={innerPetalsRef}>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx / 4) * Math.PI * 2 + 0.7;
            return (
              <group key={`inner-${idx}`} rotation={[0, angle, 0]}>
                <mesh
                  geometry={petalGeometry}
                  scale={0.24}
                  position={[0, 0.04, 0.02]}
                  rotation={[0.3, 0, 0]}
                  castShadow
                >
                  <meshStandardMaterial
                    color="#FFF1E6"
                    roughness={0.2}
                    metalness={0.2}
                    emissive={flowerColor}
                    emissiveIntensity={isSelected ? 0.6 : hovered ? 0.45 : 0.2}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Flower Center: Glowing Golden Stamen / Pistil */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color="#F5C77E"
            emissive="#F5C77E"
            emissiveIntensity={isSelected ? 1.0 : hovered ? 0.8 : 0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Radiating Stamen Tips (Gold stardust pistils) */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = (i / 7) * Math.PI * 2;
          return (
            <mesh key={`tip-${i}`} position={[Math.cos(a) * 0.035, 0.08, Math.sin(a) * 0.035]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#FFF1E6" />
            </mesh>
          );
        })}

        {/* Local Warm Starlight Point Light for each flower */}
        <pointLight
          ref={lightRef}
          color={reason.flowerColor}
          intensity={0.8}
          distance={1.8}
          decay={2}
          position={[0, 0.12, 0]}
        />
      </group>
    </group>
  );
}

