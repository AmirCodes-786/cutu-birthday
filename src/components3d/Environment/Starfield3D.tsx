"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ShootingStar {
  active: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  length: number;
  progress: number;
  life: number;
}

export function Starfield3D() {
  const starsRef = useRef<THREE.Points>(null);
  const shootingStarRef = useRef<THREE.LineSegments>(null);

  // 1,200 Background Twinkling Stars with depth
  const { starPositions, starColors, starSizes, phases } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const starPhases = new Float32Array(count);

    const cWhite = new THREE.Color("#FFFFFF");
    const cGold = new THREE.Color("#F5C77E");
    const cPink = new THREE.Color("#F8B7D0");
    const cViolet = new THREE.Color("#D95BCB");

    for (let i = 0; i < count; i++) {
      // Distribute in a spherical volume
      const radius = 25 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 10; // offset slightly behind

      const paletteRoll = Math.random();
      const col =
        paletteRoll < 0.6
          ? cWhite
          : paletteRoll < 0.75
          ? cGold
          : paletteRoll < 0.9
          ? cPink
          : cViolet;

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 0.04 + Math.random() * 0.08;
      starPhases[i] = Math.random() * Math.PI * 2;
    }

    return {
      starPositions: positions,
      starColors: colors,
      starSizes: sizes,
      phases: starPhases,
    };
  }, []);

  // Shooting star state
  const shootingStars = useRef<ShootingStar[]>([
    {
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      length: 4.5,
      progress: 0,
      life: 0,
    },
    {
      active: false,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      length: 3.5,
      progress: 0,
      life: 0,
    },
  ]);

  // Buffer geometry for shooting star trails
  const shootingGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(4 * 3); // 2 lines, each with 2 vertices
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Twinkling stars: gentle rotation of the whole celestial sphere
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.015;
      starsRef.current.rotation.x = time * 0.008;
    }

    // Shooting stars update logic
    shootingStars.current.forEach((star, index) => {
      if (!star.active) {
        // Chance to spawn
        if (Math.random() < 0.008) {
          star.active = true;
          // Spawn from top-left or top-right quadrant
          const startX = (Math.random() - 0.5) * 40;
          const startY = 15 + Math.random() * 10;
          const startZ = -15 - Math.random() * 20;
          star.position.set(startX, startY, startZ);

          // Fast diagonal direction downward
          const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.4;
          const speed = 25 + Math.random() * 15;
          star.velocity.set(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            (Math.random() - 0.5) * 5
          );
          star.progress = 0;
          star.life = 0.8 + Math.random() * 0.5;
        }
      } else {
        // Update position
        star.position.addScaledVector(star.velocity, delta);
        star.progress += delta;

        if (star.progress >= star.life) {
          star.active = false;
        }
      }

      // Update geometry positions for shooting star
      const positions = shootingGeom.attributes.position.array as Float32Array;
      if (star.active) {
        const head = star.position;
        const velLen = star.velocity.length() || 1;
        const normFactor = star.length / velLen;
        const tailX = star.position.x - star.velocity.x * normFactor;
        const tailY = star.position.y - star.velocity.y * normFactor;
        const tailZ = star.position.z - star.velocity.z * normFactor;

        positions[index * 6] = head.x;
        positions[index * 6 + 1] = head.y;
        positions[index * 6 + 2] = head.z;

        positions[index * 6 + 3] = tailX;
        positions[index * 6 + 4] = tailY;
        positions[index * 6 + 5] = tailZ;
      } else {
        // Place off-screen
        positions[index * 6] = 9999;
        positions[index * 6 + 1] = 9999;
        positions[index * 6 + 2] = 9999;
        positions[index * 6 + 3] = 9999;
        positions[index * 6 + 4] = 9999;
        positions[index * 6 + 5] = 9999;
      }
    });

    shootingGeom.attributes.position.needsUpdate = true;
  });

  // Circular soft stardust particle sprite (eliminates square pixel artifacts)
  const stardustTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.35, "rgba(245, 199, 126, 0.75)");
    grad.addColorStop(0.7, "rgba(217, 91, 203, 0.25)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Clean up procedural texture and geometry on unmount
  React.useEffect(() => {
    return () => {
      shootingGeom.dispose();
      stardustTexture?.dispose();
    };
  }, [shootingGeom, stardustTexture]);

  return (
    <group>
      {/* 3D Deep Twinkling Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          map={stardustTexture || undefined}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Occasional Shooting Stars */}
      <lineSegments ref={shootingStarRef} geometry={shootingGeom}>
        <lineBasicMaterial
          color="#F5C77E"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          linewidth={2}
        />
      </lineSegments>
    </group>
  );
}

