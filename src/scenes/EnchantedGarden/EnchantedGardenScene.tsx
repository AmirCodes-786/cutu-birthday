"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Heart, ArrowRight, ChevronLeft, ChevronRight, X, Flower } from "lucide-react";
import { getSceneBackgroundUrl } from "@/config/assetsConfig";
import { reasonsConfig, ReasonItem } from "@/config/reasonsConfig";
import { GardenBlossomNode } from "@/components/garden/GardenBlossomNode";

// Dynamically import 3D Enchanted Garden Canvas
const EnchantedGardenCanvas = dynamic(
  () =>
    import("@/components3d/EnchantedGarden/EnchantedGardenCanvas").then(
      (mod) => mod.EnchantedGardenCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-[#D95BCB]/40 border-t-[#F5C77E] animate-spin" />
          <span className="text-[11px] uppercase tracking-widest text-[#F8B7D0]/70 font-mono">
            Awakening Midnight Blossoms...
          </span>
        </div>
      </div>
    ),
  }
);

interface EnchantedGardenSceneProps {
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  rotate: number;
  scale: number;
}

interface FloatingPlusOne {
  id: number;
  x: number;
  y: number;
}

export function EnchantedGardenScene({
  onNextChapter,
  onPrevChapter,
}: EnchantedGardenSceneProps) {
  const [selectedReason, setSelectedReason] = useState<ReasonItem | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([1]); // First reason discovered by default
  const [isMobile, setIsMobile] = useState(false);
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);
  const smoothX = useSpring(motionX, { stiffness: 70, damping: 22 });
  const smoothY = useSpring(motionY, { stiffness: 70, damping: 22 });
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [cherishCounts, setCherishCounts] = useState<{ [id: number]: number }>({});
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [floatingPlusOnes, setFloatingPlusOnes] = useState<FloatingPlusOne[]>([]);
  const [isCherishJiggling, setIsCherishJiggling] = useState(false);

  // Natural botanical coordinates mapped onto the master garden artwork:
  const blossomCoordinates: { [id: number]: { x: number; y: number } } = {
    1: { x: 15, y: 38 }, // High climbing roses on left arch
    2: { x: 23, y: 58 }, // Beside the cosy romantic bench
    3: { x: 10, y: 52 }, // Under the glowing arch lantern
    4: { x: 31, y: 63 }, // In the vibrant path rosebed
    5: { x: 38, y: 51 }, // Under the flowering cherry tree
    6: { x: 42, y: 69 }, // Beside the warm path lantern
    7: { x: 53, y: 62 }, // Beside the curved cobblestone path
    8: { x: 62, y: 68 }, // Blossoms bordering the rock pool
    9: { x: 71, y: 56 }, // Beside the cascading moonlit waterfall
    10: { x: 77, y: 46 }, // Foot of the stone gazebo steps
    11: { x: 83, y: 36 }, // On the gazebo step balustrade
    12: { x: 88, y: 26 }, // Inside the illuminated gazebo pavilion
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth GPU-accelerated mouse parallax for the living canvas (0 React re-renders)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      const px = -(e.clientX / window.innerWidth - 0.5) * 20;
      const py = -(e.clientY / window.innerHeight - 0.5) * 12;
      motionX.set(px);
      motionY.set(py);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, motionX, motionY]);

  const handleSelectReason = useCallback((reason: ReasonItem, dir: 1 | -1 = 1) => {
    setSlideDirection(dir);
    setSelectedReason(reason);
    setDiscoveredIds((prev) => (prev.includes(reason.id) ? prev : [...prev, reason.id]));
  }, []);

  const handlePrevReason = useCallback(() => {
    if (!selectedReason) return;
    const currentIdx = reasonsConfig.reasons.findIndex((r) => r.id === selectedReason.id);
    const prevIdx = (currentIdx - 1 + reasonsConfig.reasons.length) % reasonsConfig.reasons.length;
    handleSelectReason(reasonsConfig.reasons[prevIdx], -1);
  }, [selectedReason, handleSelectReason]);

  const handleNextReason = useCallback(() => {
    if (!selectedReason) return;
    const currentIdx = reasonsConfig.reasons.findIndex((r) => r.id === selectedReason.id);
    const nextIdx = (currentIdx + 1) % reasonsConfig.reasons.length;
    handleSelectReason(reasonsConfig.reasons[nextIdx], 1);
  }, [selectedReason, handleSelectReason]);

  // Keyboard navigation for reason modal (Arrow keys + Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedReason) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevReason();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextReason();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedReason(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedReason, handlePrevReason, handleNextReason]);

  // Interactive "Cherish / Send Love" heart burst & playful micro-interactions
  const handleCherishClick = (e: React.MouseEvent) => {
    if (!selectedReason) return;
    const id = selectedReason.id;
    setCherishCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    // Trigger button squash & stretch jiggle
    setIsCherishJiggling(true);
    setTimeout(() => setIsCherishJiggling(false), 450);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top;

    // 1. Spawn Floating "+1 💖" badge
    const newPlusOne: FloatingPlusOne = {
      id: Date.now() + Math.random(),
      x: centerX,
      y: centerY - 10,
    };
    setFloatingPlusOnes((prev) => [...prev, newPlusOne]);
    setTimeout(() => {
      setFloatingPlusOnes((prev) => prev.filter((p) => p.id !== newPlusOne.id));
    }, 1000);

    // 2. Spawn 6 playful love emojis bursting outward in an energetic arc
    const emojis = ["💖", "🌸", "✨", "💕", "💛", "🕊️", "👑", "🌹", "💫"];
    const newHearts: FloatingHeart[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: centerX + (Math.random() - 0.5) * 40,
      y: centerY - 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      vx: (Math.random() - 0.5) * 80,
      vy: -(60 + Math.random() * 60),
      rotate: (Math.random() - 0.5) * 60,
      scale: 0.9 + Math.random() * 0.5,
    }));

    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1300);
  };

  const currentIdx = selectedReason
    ? reasonsConfig.reasons.findIndex((r) => r.id === selectedReason.id)
    : -1;

  const currentCherishCount = selectedReason ? cherishCounts[selectedReason.id] || 0 : 0;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F] flex flex-col justify-between select-none">
      {/* Floating "+1 💖" Badges */}
      {floatingPlusOnes.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, y: -50, scale: 1.3 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#180B2E]/95 border-2 border-[#FFE4A0] text-[#FFE4A0] font-mono font-bold text-xs shadow-[0_0_15px_#F5C77E]"
          style={{ left: p.x, top: p.y }}
        >
          <span>+1</span>
          <span>💖</span>
        </motion.div>
      ))}

      {/* Floating Love Particles Burst in Energetic Arc */}
      {floatingHearts.map((h) => (
        <motion.span
          key={h.id}
          initial={{ opacity: 1, y: 0, scale: 0.7, x: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            y: h.vy,
            x: h.vx,
            scale: h.scale,
            rotate: h.rotate,
          }}
          transition={{ duration: 1.15, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none text-2xl select-none"
          style={{ left: h.x, top: h.y }}
        >
          {h.emoji}
        </motion.span>
      ))}

      {/* ========================================================
          LAYER 1: FULL-BLEED LIVING GARDEN CANVAS
          Zero black void: The master artwork covers 100% of the screen
          with smooth interactive depth parallax
         ======================================================== */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          scale: 1.05,
        }}
        className="absolute inset-[-2%] z-0 pointer-events-none"
      >
        <Image
          src={getSceneBackgroundUrl("garden")}
          alt="Moonlit Rose Garden Gazebo"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Soft edge atmospheric vignettes to maintain pristine text contrast */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#10051F]/80 via-[#10051F]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#10051F]/85 via-[#10051F]/30 to-transparent pointer-events-none" />
      </motion.div>

      {/* ========================================================
          LAYER 2: LIVING 3D ENVIRONMENTAL PARTICLES
          Flying fairy butterflies, wandering fireflies & drifting petals
         ======================================================== */}
      <EnchantedGardenCanvas isMobile={isMobile} />

      {/* ========================================================
          LAYER 3: THE 12 INTEGRATED BOTANICAL BLOSSOMS
          Positioned naturally across the real garden scenery
         ======================================================== */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {reasonsConfig.reasons.map((reason) => {
          const coord = blossomCoordinates[reason.id] || { x: 50, y: 50 };
          const isDiscovered = discoveredIds.includes(reason.id);
          const isSelected = selectedReason?.id === reason.id;

          return (
            <GardenBlossomNode
              key={`blossom-node-${reason.id}`}
              reason={reason}
              xPercent={coord.x}
              yPercent={coord.y}
              isDiscovered={isDiscovered}
              isSelected={isSelected}
              onSelect={(r) => handleSelectReason(r, 1)}
            />
          );
        })}
      </div>

      {/* ========================================================
          LAYER 4: CINEMATIC SCREEN-SPACE USER INTERFACE
         ======================================================== */}
      {/* Top Header: Protected Heading Region */}
      <header className="relative z-30 pt-6 sm:pt-8 px-6 text-center pointer-events-none flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1.5 max-w-xl mx-auto"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#180B2E]/90 backdrop-blur-md border border-[#F5C77E]/30 text-[#F5C77E] text-[10px] font-mono tracking-[0.25em] uppercase shadow-[0_0_12px_rgba(245,199,126,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C77E]" />
            <span>Chapter 04 &bull; Enchanted Garden</span>
            <Heart className="w-2.5 h-2.5 text-[#F28DBB] fill-current" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#FFF1E6] drop-shadow-[0_2px_22px_rgba(217,91,203,0.45)] mt-0.5 tracking-wide">
            THE GARDEN OF INFINITE REASONS
          </h2>

          <p className="text-xs sm:text-sm font-serif italic text-[#F5C77E]/95 tracking-wide text-glow-gold whitespace-normal sm:whitespace-nowrap px-4 leading-relaxed">
            Every blossom holds a quiet reason why my heart chose you. ♡
          </p>

          {/* Compact Discovery Tracker */}
          <motion.div
            key={discoveredIds.length}
            initial={{ scale: 0.92, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5 mt-0.5 px-3 py-0.5 rounded-full bg-[#180B2E]/85 backdrop-blur-md border border-[#F5C77E]/30 text-[#FFF1E6] text-[11px] font-mono shadow-sm"
          >
            <Flower className="w-3 h-3 text-[#F28DBB]" />
            <span>
              <strong className="text-[#F5C77E]">{discoveredIds.length}</strong> of {reasonsConfig.reasons.length} Reasons Discovered
            </span>
          </motion.div>
        </motion.div>
      </header>

      {/* Bottom Controls: Instruction Row, Next Chapter Action & Spacing */}
      <footer className="relative z-30 pb-20 sm:pb-24 px-4 flex flex-col items-center text-center gap-2.5 pointer-events-auto">
        {/* Centered Instruction Row */}
        <p className="text-xs sm:text-sm text-[#F5C77E] font-serif italic tracking-wide text-glow-gold select-none bg-[#180B2E]/70 backdrop-blur-md px-4 py-1 rounded-full border border-[#F5C77E]/20">
          Select any glowing blossom in the garden to reveal a quiet reason ♡
        </p>

        {onNextChapter && (
          <button
            onClick={onNextChapter}
            className="group inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-gradient-to-r from-[#392057] to-[#66318D] border border-[#F5C77E]/50 text-[#FFF1E6] hover:scale-105 active:scale-95 transition-all text-xs font-serif tracking-wider shadow-[0_4px_20px_rgba(217,91,203,0.35)] hover:shadow-[0_4px_25px_rgba(245,199,126,0.45)] cursor-pointer"
          >
            <span>Explore Chapter 05 &bull; Dream Island</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F5C77E] group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </footer>

      {/* ========================================================
          PREMIUM INTERACTIVE REASON REVELATION MODAL
          Jewelry-grade framing, ambient backlight, interactive love button & animated slide
         ======================================================== */}
      <AnimatePresence>
        {selectedReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedReason(null)}
          >
            {/* Ambient Soft Floral Aura */}
            <div
              className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: selectedReason.flowerColor }}
            />

            {/* Sleek Champagne-Gold Jewelry Frame */}
            <motion.div
              initial={{ scale: 0.9, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg p-[1.5px] rounded-[28px] bg-gradient-to-b from-[#F5C77E]/70 via-[#D49E48]/35 to-[#F5C77E]/50 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_25px_rgba(245,199,126,0.15)] my-auto"
            >
              {/* Inner Luxurious Card — Deep Midnight Velvet */}
              <div className="relative w-full rounded-[26px] bg-gradient-to-b from-[#1C0B30]/98 via-[#130722]/98 to-[#170A28]/98 backdrop-blur-3xl p-6 sm:p-8 text-[#FFF1E6] flex flex-col gap-4 text-center items-center overflow-hidden border border-[#F5C77E]/20 shadow-inner">
                {/* Close Button in Champagne Gold */}
                <button
                  onClick={() => setSelectedReason(null)}
                  className="absolute top-4 right-4 p-2 rounded-full border border-[#F5C77E]/40 bg-white/5 hover:bg-white/10 text-[#F5C77E] transition-all hover:rotate-90 duration-300 cursor-pointer shadow-sm"
                  aria-label="Close message"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Species Pill Badge */}
                <motion.div
                  key={`badge-${selectedReason.id}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F5C77E]/40 bg-[#1A0B2C]/90 text-[#F5C77E] text-xs font-mono tracking-wider uppercase shadow-sm"
                >
                  <span className="text-base select-none">{selectedReason.emoji}</span>
                  <span className="font-semibold tracking-wide">
                    BLOSSOM {selectedReason.id.toString().padStart(2, "0")} &bull; {selectedReason.flowerType}
                  </span>
                </motion.div>

                {/* Directional Slide Animated Content */}
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={`content-${selectedReason.id}`}
                    custom={slideDirection}
                    initial={{ opacity: 0, x: slideDirection * 35 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideDirection * 35 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-3 w-full"
                  >
                    {/* Reason Title */}
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF6E9] drop-shadow-[0_2px_14px_rgba(245,199,126,0.35)] px-2">
                      {selectedReason.title}
                    </h3>

                    {/* Clean Golden Filigree Decorative Divider */}
                    <div className="flex items-center justify-center gap-2.5 w-40 my-0.5">
                      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F5C77E]/60 to-[#F5C77E]" />
                      <Heart className="w-3.5 h-3.5 text-[#F28DBB] fill-current animate-pulse" />
                      <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F5C77E]/60 to-[#F5C77E]" />
                    </div>

                    {/* Heartfelt Reason Content with Emojis & Golden Quotes */}
                    <p className="text-base sm:text-lg font-serif italic text-[#FFF8F0] leading-relaxed px-2 sm:px-5 text-center">
                      <span className="text-[#F5C77E] text-2xl sm:text-3xl font-serif mr-1 leading-none">“</span>
                      {selectedReason.reason}
                      <span className="text-[#F5C77E] text-2xl sm:text-3xl font-serif ml-1 leading-none">”</span>
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Interactive Playful 3D "Cherish / Send Love" Button */}
                <motion.button
                  onClick={handleCherishClick}
                  animate={
                    isCherishJiggling
                      ? {
                          scale: [1, 0.9, 1.14, 0.94, 1.06, 1],
                          rotate: [0, -3, 3, -2, 1, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.93, y: 3 }}
                  className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#FFF5CE] via-[#F5C77E] to-[#CF9234] border-t-2 border-[#FFFFFF] border-b-2 border-[#94691B] text-[#19092B] font-serif transition-shadow duration-200 shadow-[0_5px_0_#8F5E12,0_12px_28px_rgba(245,199,126,0.65)] hover:shadow-[0_7px_0_#8F5E12,0_16px_34px_rgba(245,199,126,0.85)] active:shadow-[0_1px_0_#8F5E12,0_4px_12px_rgba(245,199,126,0.4)] cursor-pointer mt-1 select-none overflow-hidden"
                  aria-label="Cherish this reason"
                >
                  {/* Sliding Starlight Light Beam / Glint */}
                  <motion.div
                    animate={{ x: ["-130%", "280%"] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 1.6,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] pointer-events-none"
                  />

                  {/* Playfully Bouncing Heart Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.35, 1, 1.25, 1],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative flex items-center justify-center pointer-events-none"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#B81E57] fill-[#FF3377] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                  </motion.div>

                  {/* Button Label */}
                  <span className="font-bold tracking-wide text-xs sm:text-sm drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] text-[#19092B]">
                    {currentCherishCount > 0 ? "Cherished with Love! 💕" : "Cherish this reason ♡"}
                  </span>

                  {/* Interactive Dynamic Counter Badge with Spring Pop */}
                  {currentCherishCount > 0 ? (
                    <motion.span
                      key={currentCherishCount}
                      initial={{ scale: 1.6, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 14 }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1A0B2C] text-[#FFE4A0] text-xs font-mono font-bold shadow-md border border-[#F5C77E]/80"
                    >
                      <span>💖</span>
                      <span>{currentCherishCount}</span>
                    </motion.span>
                  ) : (
                    <Heart className="w-3.5 h-3.5 text-[#8F5E12] fill-current pointer-events-none" />
                  )}
                </motion.button>

                {/* 12 Interactive Golden Pagination Dots */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2">
                  {reasonsConfig.reasons.map((r, i) => {
                    const isCur = r.id === selectedReason.id;
                    const isDisc = discoveredIds.includes(r.id);
                    return (
                      <button
                        key={`dot-${r.id}`}
                        onClick={() => handleSelectReason(r, r.id > selectedReason.id ? 1 : -1)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          isCur
                            ? "w-7 h-2 bg-gradient-to-r from-[#FFE4A0] to-[#F5C77E] shadow-[0_0_14px_#F5C77E]"
                            : isDisc
                            ? "w-2 h-2 bg-[#F5C77E]/85 hover:scale-125 shadow-[0_0_8px_rgba(245,199,126,0.6)]"
                            : "w-1.5 h-1.5 bg-[#F5C77E]/30 hover:bg-[#F5C77E]/60"
                        }`}
                        aria-label={`Jump to reason ${r.id}`}
                      />
                    );
                  })}
                </div>

                {/* Bottom Navigation Controls: Previous Reason, Counter, Next Reason */}
                <div className="flex items-center justify-between w-full pt-3 border-t border-[#F5C77E]/30 mt-1">
                  <button
                    onClick={handlePrevReason}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F5C77E]/20 to-[#E5A855]/20 hover:from-[#F5C77E]/35 hover:to-[#E5A855]/35 text-[#FFE4A0] text-xs font-mono font-semibold transition-all hover:scale-105 cursor-pointer shadow-[0_0_16px_rgba(245,199,126,0.3)] border border-[#F5C77E]"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#FFE4A0]" />
                    <span>Prev</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-[#F5C77E] tracking-widest drop-shadow-[0_0_10px_rgba(245,199,126,0.7)]">
                    {currentIdx + 1} of {reasonsConfig.reasons.length}
                  </span>

                  <button
                    onClick={handleNextReason}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F5C77E]/20 to-[#E5A855]/20 hover:from-[#F5C77E]/30 hover:to-[#E5A855]/35 text-[#FFE4A0] text-xs font-mono font-semibold transition-all hover:scale-105 cursor-pointer shadow-[0_0_16px_rgba(245,199,126,0.3)] border border-[#F5C77E]"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4 text-[#FFE4A0]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
