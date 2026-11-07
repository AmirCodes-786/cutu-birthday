"use client";

import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface Envelope3DProps {
  isOpen: boolean;
  onOpen: () => void;
  onHover?: (hovered: boolean) => void;
}

/**
 * Procedurally generates an ultra-detailed vintage parchment texture
 * with cotton paper grain, deckled border wash, and scattered gold leaf specks.
 */
function createPaperTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 1. Warm Antique Cream Radial Gradient
  const grad = ctx.createRadialGradient(512, 512, 120, 512, 512, 700);
  grad.addColorStop(0, "#FCF8F0"); // Luminous center ivory
  grad.addColorStop(0.55, "#F7EFE1"); // Warm linen body
  grad.addColorStop(0.85, "#EFE2CC"); // Aged parchment tone
  grad.addColorStop(1, "#E2CEAE"); // Soft deckled edge wash
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Microscopic Paper Pulp Fibers
  ctx.save();
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const len = 1.5 + Math.random() * 4;
    const angle = Math.random() * Math.PI * 2;
    const isDark = Math.random() > 0.4;

    ctx.strokeStyle = isDark
      ? `rgba(165, 130, 95, ${0.025 + Math.random() * 0.04})`
      : `rgba(255, 255, 255, ${0.06 + Math.random() * 0.08})`;
    ctx.lineWidth = 0.5 + Math.random() * 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Embedded Gold Leaf Flecks (Handmade paper gold dusting)
  ctx.save();
  for (let i = 0; i < 180; i++) {
    const gx = Math.random() * 1024;
    const gy = Math.random() * 1024;
    const gr = 1.2 + Math.random() * 2.4;

    const goldGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr * 2);
    goldGrad.addColorStop(0, "rgba(255, 225, 140, 0.95)");
    goldGrad.addColorStop(0.4, "rgba(218, 165, 32, 0.8)");
    goldGrad.addColorStop(1, "rgba(184, 134, 11, 0)");

    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(gx, gy, gr * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 4. Subtle Embossed Gilded Border Line
  ctx.save();
  ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 36, 952, 952);
  ctx.strokeStyle = "rgba(180, 145, 95, 0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 936, 936);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Procedurally generates a tactile bump/normal map for realistic paper tooth
 */
function createPaperBumpMap(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 512);

  // High-frequency paper grain noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 24;
    const val = Math.min(255, Math.max(0, 128 + n));
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

/**
 * Procedurally generates the handwritten calligraphy love letter inside
 */
function createLetterTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Cream parchment background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  bgGrad.addColorStop(0, "#FFFDF9");
  bgGrad.addColorStop(0.5, "#FBF5EA");
  bgGrad.addColorStop(1, "#F4EBD9");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft vintage border
  ctx.strokeStyle = "rgba(215, 160, 168, 0.4)";
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 944, 944);

  // Top Inked Crimson Heart (Matching the reference photograph!)
  ctx.save();
  ctx.translate(512, 120);
  ctx.fillStyle = "#800D1E";
  ctx.beginPath();
  ctx.moveTo(0, 15);
  ctx.bezierCurveTo(-25, -20, -50, 10, 0, 50);
  ctx.bezierCurveTo(50, 10, 25, -20, 0, 15);
  ctx.fill();

  // Gold flourish crown above the heart
  ctx.strokeStyle = "#F5C77E";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -22, 12, Math.PI * 0.2, Math.PI * 0.8, true);
  ctx.stroke();
  ctx.restore();

  // Romantic Handwritten Cursive Script Lines
  ctx.save();
  ctx.strokeStyle = "rgba(69, 25, 47, 0.72)";
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";

  const lineStarts = [
    210, 260, 310, 360, 410, 460, 510, 560, 610, 660, 710, 760, 810,
  ];

  lineStarts.forEach((y, idx) => {
    ctx.beginPath();
    const left = idx % 2 === 0 ? 110 : 130;
    const right = idx === lineStarts.length - 1 ? 520 : 910 - (idx % 3) * 40;
    ctx.moveTo(left, y);

    let currX = left;
    while (currX < right) {
      const step = 20 + Math.random() * 35;
      const cpY = y + (Math.random() - 0.5) * 8;
      const endY = y + (Math.random() - 0.5) * 4;
      ctx.quadraticCurveTo(currX + step / 2, cpY, currX + step, endY);
      currX += step;
    }
    ctx.stroke();
  });

  // Signature Flourish in script
  ctx.beginPath();
  ctx.moveTo(640, 890);
  ctx.bezierCurveTo(700, 860, 760, 930, 850, 885);
  ctx.bezierCurveTo(870, 875, 830, 915, 890, 905);
  ctx.strokeStyle = "#800D1E";
  ctx.lineWidth = 3.2;
  ctx.stroke();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Procedurally generates the royal wax stamp emblem texture
 * with embossed monogram "R" & ornate royal crest relief.
 */
function createWaxSealTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Deep Carmine Ruby Wax Bed
  const rad = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
  rad.addColorStop(0, "#9A1224");
  rad.addColorStop(0.65, "#750B19");
  rad.addColorStop(1, "#540611");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 512, 512);

  // Stamped Circular Indentation Rim
  ctx.strokeStyle = "rgba(245, 199, 126, 0.4)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(256, 256, 205, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(40, 3, 7, 0.8)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 195, 0, Math.PI * 2);
  ctx.stroke();

  // Central Embossed Monogram "R" (For Ruhi!)
  ctx.save();
  ctx.font = "bold 210px 'Cinzel', 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Bevel Highlight (Top-Left)
  ctx.fillStyle = "rgba(255, 230, 160, 0.85)";
  ctx.fillText("R", 253, 252);

  // Bevel Shadow (Bottom-Right)
  ctx.fillStyle = "rgba(45, 4, 8, 0.95)";
  ctx.fillText("R", 259, 260);

  // Gold Ingot Center Face
  ctx.fillStyle = "#E4B15B";
  ctx.fillText("R", 256, 256);

  // Surrounding Delicate Laurel / Star Garland
  ctx.strokeStyle = "#F5C77E";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(256, 256, 150, -Math.PI * 0.75, Math.PI * 0.75);
  ctx.stroke();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Procedurally generates twisted jute twine fiber texture
 */
function createTwineTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#BFA078";
  ctx.fillRect(0, 0, 256, 256);

  // Diagonal spiral cord fibers
  for (let i = -256; i < 512; i += 14) {
    ctx.strokeStyle = i % 28 === 0 ? "#8C6A42" : "#DFC49D";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
  }

  // Micro-fuzz fibers
  for (let j = 0; j < 1200; j++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(110, 80, 50, 0.25)" : "rgba(240, 225, 200, 0.35)";
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 1);
  return tex;
}

export function Envelope3D({ isOpen, onOpen, onHover }: Envelope3DProps) {
  const envelopeGroupRef = useRef<THREE.Group>(null);
  const topFlapPivotRef = useRef<THREE.Group>(null);
  const paperRef = useRef<THREE.Group>(null);
  const charmRef = useRef<THREE.Group>(null);
  const candleLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  // Procedural Textures
  const paperTex = useMemo(() => createPaperTexture(), []);
  const paperBump = useMemo(() => createPaperBumpMap(), []);
  const letterTex = useMemo(() => createLetterTexture(), []);
  const sealTex = useMemo(() => createWaxSealTexture(), []);
  const twineTex = useMemo(() => createTwineTexture(), []);

  // Envelope Geometry Dimensions
  const W = 3.6;
  const H = 2.4;
  const halfW = W / 2;
  const halfH = H / 2;

  // 1. Left triangular side flap
  const leftFlapGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-halfW, -halfH);
    shape.lineTo(-halfW, halfH);
    shape.lineTo(-0.12, 0);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [halfW, halfH]);

  // 2. Right triangular side flap
  const rightFlapGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(halfW, -halfH);
    shape.lineTo(halfW, halfH);
    shape.lineTo(0.12, 0);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [halfW, halfH]);

  // 3. Bottom triangular pocket flap
  const bottomFlapGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-halfW, -halfH);
    shape.lineTo(halfW, -halfH);
    shape.lineTo(0, 0.22);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [halfW, halfH]);

  // 4. Top articulated folding flap with hinge at y = halfH
  const topFlapGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-halfW, 0);
    shape.lineTo(halfW, 0);
    shape.lineTo(0, -1.38); // Extends downward to cover the bottom fold
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [halfW]);

  // 5. Gilded deckle edge border along the top flap's triangular contour
  // Exact diagonal geometry: length = sqrt(1.8^2 + 1.38^2) = 2.268, angle = atan2(1.38, 1.8) = 0.6546 rad
  const diagLength = useMemo(() => Math.hypot(halfW, 1.38), [halfW]);
  const diagAngle = useMemo(() => Math.atan2(1.38, halfW), [halfW]);

  // 6. Organic Melted Wax Seal Pool Geometry (Authentic 16-lobed hand-poured wax)
  const organicSealGeom = useMemo(() => {
    const shape = new THREE.Shape();
    const numPoints = 48;
    const baseR = 0.44;

    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * Math.PI * 2;
      // Organic harmonic lobe variations simulating molten wax squashing under the stamp
      const r =
        baseR +
        Math.sin(theta * 6) * 0.038 +
        Math.cos(theta * 5 + 0.8) * 0.042 +
        Math.sin(theta * 9 - 1.2) * 0.02 +
        Math.cos(theta * 3 + 2.1) * 0.025;

      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;

      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.035,
      bevelThickness: 0.03,
    });
  }, []);

  // 7. Dangling Golden Heart Charm Geometry
  const heartCharmGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.04);
    shape.bezierCurveTo(-0.06, 0.12, -0.14, 0.04, -0.07, -0.06);
    shape.bezierCurveTo(-0.04, -0.11, 0, -0.15, 0, -0.17);
    shape.bezierCurveTo(0, -0.15, 0.04, -0.11, 0.07, -0.06);
    shape.bezierCurveTo(0.14, 0.04, 0.06, 0.12, 0, 0.04);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.012,
      bevelThickness: 0.01,
    });
  }, []);

  // 8. Delicate Tied Twine Bow Geometry (Parametric curved loops)
  const bowLeftGeom = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.25, 0.22, 0.03),
      new THREE.Vector3(-0.35, -0.15, 0.04),
      new THREE.Vector3(0, 0, 0.01)
    );
    return new THREE.TubeGeometry(curve, 20, 0.018, 8, false);
  }, []);

  const bowRightGeom = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.25, 0.22, 0.03),
      new THREE.Vector3(0.35, -0.15, 0.04),
      new THREE.Vector3(0, 0, 0.01)
    );
    return new THREE.TubeGeometry(curve, 20, 0.018, 8, false);
  }, []);

  // Twine trailing ends
  const twineTailLeftGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.1, -0.18, 0.02),
      new THREE.Vector3(-0.18, -0.38, 0.03),
      new THREE.Vector3(-0.22, -0.52, 0.01),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.016, 8, false);
  }, []);

  const twineTailRightGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.08, -0.16, 0.02),
      new THREE.Vector3(0.12, -0.34, 0.025),
      new THREE.Vector3(0.09, -0.48, 0.01),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.016, 8, false);
  }, []);

  // 9. Interactive Physics & Fluid Animations
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Natural Floating & Desk Tilt Physics
    if (envelopeGroupRef.current) {
      const targetY = isOpen ? -0.72 : -0.12 + Math.sin(time * 1.3) * 0.025;
      const targetRotX = isOpen ? 0.32 : 0.18 + Math.sin(time * 0.8) * 0.018;
      const targetRotZ = isOpen ? 0 : -0.04 + Math.cos(time * 0.6) * 0.012;
      const targetScale = hovered && !isOpen ? 1.04 : 1.0;

      envelopeGroupRef.current.position.y = THREE.MathUtils.damp(
        envelopeGroupRef.current.position.y,
        targetY,
        4.2,
        delta
      );
      envelopeGroupRef.current.rotation.x = THREE.MathUtils.damp(
        envelopeGroupRef.current.rotation.x,
        targetRotX,
        4.2,
        delta
      );
      envelopeGroupRef.current.rotation.z = THREE.MathUtils.damp(
        envelopeGroupRef.current.rotation.z,
        targetRotZ,
        4.2,
        delta
      );
      envelopeGroupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08
      );
    }

    // Top Flap Opening Hinge Animation (Swings backward by ~172 degrees)
    if (topFlapPivotRef.current) {
      const targetAngle = isOpen ? Math.PI * 0.96 : 0;
      topFlapPivotRef.current.rotation.x = THREE.MathUtils.damp(
        topFlapPivotRef.current.rotation.x,
        targetAngle,
        3.6,
        delta
      );
    }

    // Letter Paper Slide-Out Animation
    if (paperRef.current) {
      const targetPaperY = isOpen ? 1.42 : 0.02;
      const targetPaperZ = isOpen ? 0.22 : 0.015;
      const targetPaperRotX = isOpen ? -0.06 : 0;
      const targetPaperScale = isOpen ? 1.1 : 0.97;

      paperRef.current.position.y = THREE.MathUtils.damp(
        paperRef.current.position.y,
        targetPaperY,
        3.2,
        delta
      );
      paperRef.current.position.z = THREE.MathUtils.damp(
        paperRef.current.position.z,
        targetPaperZ,
        3.2,
        delta
      );
      paperRef.current.rotation.x = THREE.MathUtils.damp(
        paperRef.current.rotation.x,
        targetPaperRotX,
        3.2,
        delta
      );
      paperRef.current.scale.lerp(
        new THREE.Vector3(targetPaperScale, targetPaperScale, 1),
        0.07
      );
    }

    // Dangling Heart Charm Natural Sway
    if (charmRef.current) {
      const swayZ = Math.sin(time * 2.8) * 0.12;
      const swayX = Math.cos(time * 1.9) * 0.08;
      charmRef.current.rotation.z = THREE.MathUtils.damp(
        charmRef.current.rotation.z,
        swayZ,
        5,
        delta
      );
      charmRef.current.rotation.x = THREE.MathUtils.damp(
        charmRef.current.rotation.x,
        swayX,
        5,
        delta
      );
    }

    // Warm Antique Candlelight Flicker
    if (candleLightRef.current) {
      candleLightRef.current.intensity =
        3.4 + Math.sin(time * 7.5) * 0.45 + Math.cos(time * 12.0) * 0.25;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onOpen();
  };

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
  };

  return (
    <group
      ref={envelopeGroupRef}
      position={[0, -0.12, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* ========================================================
          1. BACK ENVELOPE BODY & LINEN PARCHMENT PLATE
         ======================================================== */}
      {/* Main Back Plate */}
      <mesh position={[0, 0, -0.015]} receiveShadow castShadow>
        <boxGeometry args={[W, H, 0.03]} />
        <meshStandardMaterial
          map={paperTex ?? undefined}
          bumpMap={paperBump ?? undefined}
          bumpScale={0.03}
          color="#FAF4EA"
          roughness={0.68}
          metalness={0.06}
        />
      </mesh>

      {/* Elegant Gilded Border Framing the Back Edge */}
      <mesh position={[0, 0, -0.022]}>
        <boxGeometry args={[W + 0.05, H + 0.05, 0.012]} />
        <meshStandardMaterial
          color="#F5C77E" // Champagne gold leaf
          roughness={0.28}
          metalness={0.88}
        />
      </mesh>

      {/* Dark Silk Interior Pocket Lining (Visible when top flap opens) */}
      <mesh position={[0, 0.05, 0.005]}>
        <planeGeometry args={[W - 0.16, H - 0.16]} />
        <meshStandardMaterial
          color="#42142B" // Deep royal burgundy silk lining
          roughness={0.5}
          metalness={0.25}
        />
      </mesh>

      {/* ========================================================
          2. SLIDING CALLIGRAPHY LOVE LETTER (Nested in pocket)
         ======================================================== */}
      <group ref={paperRef} position={[0, 0.02, 0.015]}>
        {/* Parchment Sheet */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[W - 0.32, H - 0.22, 0.012]} />
          <meshStandardMaterial
            map={letterTex ?? undefined}
            bumpMap={paperBump ?? undefined}
            bumpScale={0.02}
            color="#FFFDF9"
            roughness={0.72}
            metalness={0.04}
          />
        </mesh>

        {/* Faint Gilded Top Edge on the letter */}
        <mesh position={[0, (H - 0.22) / 2, 0.006]}>
          <boxGeometry args={[W - 0.32, 0.012, 0.004]} />
          <meshStandardMaterial
            color="#F5C77E"
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* ========================================================
          3. FRONT FOLDED POCKET FLAPS (Left, Right, Bottom)
         ======================================================== */}
      {/* Left triangular fold */}
      <mesh geometry={leftFlapGeom} position={[0, 0, 0.028]} receiveShadow>
        <meshStandardMaterial
          map={paperTex ?? undefined}
          bumpMap={paperBump ?? undefined}
          bumpScale={0.025}
          color="#F6EFE2"
          roughness={0.65}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right triangular fold */}
      <mesh geometry={rightFlapGeom} position={[0, 0, 0.032]} receiveShadow>
        <meshStandardMaterial
          map={paperTex ?? undefined}
          bumpMap={paperBump ?? undefined}
          bumpScale={0.025}
          color="#F3E9D9"
          roughness={0.65}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom triangular fold */}
      <mesh geometry={bottomFlapGeom} position={[0, 0, 0.038]} receiveShadow>
        <meshStandardMaterial
          map={paperTex ?? undefined}
          bumpMap={paperBump ?? undefined}
          bumpScale={0.025}
          color="#EFE3CF"
          roughness={0.65}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle Gold Foil Accent Line Along Bottom Triangle Edge */}
      <mesh
        position={[-halfW / 2, -halfH + 0.71, 0.042]}
        rotation={[0, 0, -Math.atan2(1.42, halfW)]}
      >
        <boxGeometry args={[Math.hypot(halfW, 1.42), 0.015, 0.004]} />
        <meshStandardMaterial
          color="#F5C77E"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <mesh
        position={[halfW / 2, -halfH + 0.71, 0.042]}
        rotation={[0, 0, Math.atan2(1.42, halfW)]}
      >
        <boxGeometry args={[Math.hypot(halfW, 1.42), 0.015, 0.004]} />
        <meshStandardMaterial
          color="#F5C77E"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* ========================================================
          4. ARTICULATED TOP FLAP & ORGANIC RUBY WAX SEAL
         ======================================================== */}
      <group ref={topFlapPivotRef} position={[0, halfH, 0.048]}>
        {/* Top Triangular Flap */}
        <mesh geometry={topFlapGeom} castShadow receiveShadow>
          <meshStandardMaterial
            map={paperTex ?? undefined}
            bumpMap={paperBump ?? undefined}
            bumpScale={0.03}
            color="#FAF4EA"
            roughness={0.62}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Gilded Deckle Border: Left Diagonal (Aligned with sub-millimeter precision, ZERO PROTRUSION) */}
        <mesh
          position={[-halfW / 2, -1.38 / 2, 0.006]}
          rotation={[0, 0, diagAngle]}
        >
          <boxGeometry args={[diagLength, 0.022, 0.006]} />
          <meshStandardMaterial
            color="#F5C77E"
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>

        {/* Gilded Deckle Border: Right Diagonal */}
        <mesh
          position={[halfW / 2, -1.38 / 2, 0.006]}
          rotation={[0, 0, -diagAngle]}
        >
          <boxGeometry args={[diagLength, 0.022, 0.006]} />
          <meshStandardMaterial
            color="#F5C77E"
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>

        {/* ----------------------------------------------------
            ORGANIC HAND-POURED MELTED WAX SEAL (Centered at flap tip)
           ---------------------------------------------------- */}
        <group position={[0, -1.18, 0.045]}>
          {/* Organic Melted Wax Outer Puddle */}
          <mesh geometry={organicSealGeom} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#840D1C" // Deep imperial ruby red wax
              emissive="#4A050E"
              emissiveIntensity={hovered && !isOpen ? 0.65 : 0.22}
              roughness={0.22}
              metalness={0.08}
              clearcoat={0.92}
              clearcoatRoughness={0.12}
            />
          </mesh>

          {/* Stamped Center Inset Medallion (Stamped Monogram "R" & Laurel Crest) */}
          <mesh position={[0, 0, 0.042]}>
            <cylinderGeometry args={[0.34, 0.34, 0.012, 36]} />
            <meshStandardMaterial
              map={sealTex ?? undefined}
              roughness={0.25}
              metalness={0.45}
            />
          </mesh>

          {/* Raised Wax Impression Ring Rim */}
          <mesh position={[0, 0, 0.046]}>
            <torusGeometry args={[0.33, 0.024, 16, 36]} />
            <meshPhysicalMaterial
              color="#951022"
              roughness={0.2}
              metalness={0.12}
              clearcoat={0.95}
              clearcoatRoughness={0.1}
            />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          5. NATURAL RUSTIC JUTE TWINE & TIED BOW
          (Authentic detail matching the still life reference photograph!)
         ======================================================== */}
      <group position={[0, -0.38, 0.052]}>
        {/* Horizontal Twine Wrap Band around the envelope body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[W + 0.02, 0.04, 0.016]} />
          <meshStandardMaterial
            map={twineTex ?? undefined}
            color="#C7A57B" // Natural earthy jute cord
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Tied Twine Bow Assembly on the Left */}
        <group position={[-0.65, 0, 0.022]}>
          {/* Center Bow Knot */}
          <mesh castShadow>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial
              map={twineTex ?? undefined}
              color="#BFA078"
              roughness={0.9}
            />
          </mesh>

          {/* Left Looped Ribbon */}
          <mesh geometry={bowLeftGeom} castShadow>
            <meshStandardMaterial
              map={twineTex ?? undefined}
              color="#C7A57B"
              roughness={0.85}
            />
          </mesh>

          {/* Right Looped Ribbon */}
          <mesh geometry={bowRightGeom} castShadow>
            <meshStandardMaterial
              map={twineTex ?? undefined}
              color="#C7A57B"
              roughness={0.85}
            />
          </mesh>

          {/* Left Trailing String Tail */}
          <mesh geometry={twineTailLeftGeom} castShadow>
            <meshStandardMaterial
              map={twineTex ?? undefined}
              color="#C7A57B"
              roughness={0.85}
            />
          </mesh>

          {/* Right Trailing String Tail */}
          <mesh geometry={twineTailRightGeom} castShadow>
            <meshStandardMaterial
              map={twineTex ?? undefined}
              color="#C7A57B"
              roughness={0.85}
            />
          </mesh>

          {/* Small Antique Brass Heart Charm (Sways dynamically) */}
          <group ref={charmRef} position={[0, -0.06, 0.02]}>
            {/* Tiny Gold Jump Ring */}
            <mesh position={[0, 0.03, 0]}>
              <torusGeometry args={[0.018, 0.005, 8, 16]} />
              <meshStandardMaterial
                color="#F5C77E"
                roughness={0.2}
                metalness={0.95}
              />
            </mesh>

            {/* Polished Gold Heart Pendant */}
            <mesh geometry={heartCharmGeom} castShadow>
              <meshStandardMaterial
                color="#F5C77E" // Warm antique gold
                roughness={0.18}
                metalness={0.92}
              />
            </mesh>
          </group>
        </group>

        {/* ----------------------------------------------------
            DELICATE DRIED GYPSOPHILA / BABY'S BREATH SPRIG
            (Tucked under the twine cord just like the photo!)
           ---------------------------------------------------- */}
        <group position={[-0.95, 0.12, 0.025]} rotation={[0, 0, 0.28]}>
          {/* Main Slender Botanical Stem */}
          <mesh>
            <cylinderGeometry args={[0.008, 0.012, 0.55, 8]} />
            <meshStandardMaterial color="#6B5945" roughness={0.9} />
          </mesh>

          {/* Side Twig 1 */}
          <mesh position={[-0.06, 0.14, 0.01]} rotation={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.005, 0.007, 0.22, 6]} />
            <meshStandardMaterial color="#7D6952" roughness={0.9} />
          </mesh>
          {/* Tiny Blossom Bud 1 */}
          <mesh position={[-0.12, 0.24, 0.015]}>
            <sphereGeometry args={[0.024, 10, 10]} />
            <meshStandardMaterial color="#FFF9EE" roughness={0.7} />
          </mesh>

          {/* Side Twig 2 */}
          <mesh position={[0.05, 0.18, -0.01]} rotation={[0, 0, -0.45]}>
            <cylinderGeometry args={[0.005, 0.007, 0.2, 6]} />
            <meshStandardMaterial color="#7D6952" roughness={0.9} />
          </mesh>
          {/* Tiny Blossom Bud 2 */}
          <mesh position={[0.1, 0.26, -0.012]}>
            <sphereGeometry args={[0.026, 10, 10]} />
            <meshStandardMaterial color="#FFF9EE" roughness={0.7} />
          </mesh>

          {/* Top Blossom Bud */}
          <mesh position={[0, 0.28, 0.01]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial color="#FFF9EE" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          6. CANDLELIGHT & ROMANTIC LANTERN LIGHTING
         ======================================================== */}
      {/* Warm Golden Key Light (Flickering candlelight from desk lantern) */}
      <pointLight
        ref={candleLightRef}
        color="#F5C77E"
        distance={9}
        decay={2}
        position={[-2.4, 1.8, 2.4]}
      />

      {/* Soft Romantic Ambient Fill */}
      <pointLight
        color="#FFF1E6"
        intensity={1.8}
        distance={8}
        decay={2}
        position={[2.2, 1.2, 2.6]}
      />

      {/* Warm Rim Light on Top Flap & Wax Seal */}
      <pointLight
        color="#F8B7D0"
        intensity={1.1}
        distance={5}
        decay={2}
        position={[0, -1.8, 2.0]}
      />
    </group>
  );
}
