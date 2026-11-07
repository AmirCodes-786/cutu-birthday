"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, ChevronLeft, ChevronRight, X, Compass } from "lucide-react";
import { dreamsConfig, LandmarkExperience } from "@/config/dreamsConfig";
import { DreamIslandVideoBackground } from "@/components/island/DreamIslandVideoBackground";
import { DreamLandmarkNode } from "@/components/island/DreamLandmarkNode";

// Dynamically import 3D Atmosphere
const DreamIslandAtmosphere = dynamic(
  () =>
    import("@/components3d/DreamIsland/DreamIslandAtmosphere").then(
      (mod) => mod.DreamIslandAtmosphere
    ),
  { ssr: false }
);

interface DreamIslandSceneProps {
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

interface FloatingParticle {
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
  tag: string;
}

export function DreamIslandScene({
  onNextChapter,
  onPrevChapter,
}: DreamIslandSceneProps) {
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkExperience | null>(null);

  // Discovery progress persists across visitor session
  const [discoveredIds, setDiscoveredIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("her_universe_dream_island_discovered");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [dreamsConfig.landmarks[0].id];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "her_universe_dream_island_discovered",
          JSON.stringify(discoveredIds)
        );
      } catch {}
    }
  }, [discoveredIds]);

  const [isMobile, setIsMobile] = useState(false);
  const [showPanHint, setShowPanHint] = useState(true);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [wishCounts, setWishCounts] = useState<{ [id: string]: number }>({});
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [floatingPlusOnes, setFloatingPlusOnes] = useState<FloatingPlusOne[]>([]);
  const [isWishJiggling, setIsWishJiggling] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelectLandmark = useCallback((landmark: LandmarkExperience, dir: 1 | -1 = 1) => {
    setShowPanHint(false);
    setSlideDirection(dir);
    setSelectedLandmark(landmark);
    setDiscoveredIds((prev) => (prev.includes(landmark.id) ? prev : [...prev, landmark.id]));
  }, []);

  const handlePrevLandmark = useCallback(() => {
    if (!selectedLandmark) return;
    const currentIdx = dreamsConfig.landmarks.findIndex((l) => l.id === selectedLandmark.id);
    const prevIdx = (currentIdx - 1 + dreamsConfig.landmarks.length) % dreamsConfig.landmarks.length;
    handleSelectLandmark(dreamsConfig.landmarks[prevIdx], -1);
  }, [selectedLandmark, handleSelectLandmark]);

  const handleNextLandmark = useCallback(() => {
    if (!selectedLandmark) return;
    const currentIdx = dreamsConfig.landmarks.findIndex((l) => l.id === selectedLandmark.id);
    const nextIdx = (currentIdx + 1) % dreamsConfig.landmarks.length;
    handleSelectLandmark(dreamsConfig.landmarks[nextIdx], 1);
  }, [selectedLandmark, handleSelectLandmark]);

  // Keyboard navigation (Arrow keys + Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLandmark) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevLandmark();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextLandmark();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedLandmark(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLandmark, handlePrevLandmark, handleNextLandmark]);

  // Theme-specific emoji showers when interacting with each landmark
  const getThemeEmojis = (theme: LandmarkExperience["theme"]): string[] => {
    switch (theme) {
      case "gate":
        return ["🕊️", "✨", "⛩️", "💖", "🌸", "💫"];
      case "cottage":
        return ["🏡", "☕", "🍯", "💛", "✨", "🍂"];
      case "tree":
        return ["🌸", "🎀", "🍃", "💕", "✨", "🌺"];
      case "lake":
        return ["🌊", "✈️", "💙", "🗺️", "💫", "💎"];
      case "observatory":
        return ["⭐", "🔭", "✨", "👑", "💛", "🌙"];
      case "horizon":
        return ["🏮", "🌅", "🎂", "💖", "✨", "💫"];
    }
  };

  // Interactive Tactile Wish Click
  const handleWishClick = (e: React.MouseEvent) => {
    if (!selectedLandmark) return;
    const id = selectedLandmark.id;
    setWishCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    setIsWishJiggling(true);
    setTimeout(() => setIsWishJiggling(false), 450);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top;

    const newPlusOne: FloatingPlusOne = {
      id: Date.now() + Math.random(),
      x: centerX,
      y: centerY - 10,
      tag: selectedLandmark.emoji,
    };
    setFloatingPlusOnes((prev) => [...prev, newPlusOne]);
    setTimeout(() => {
      setFloatingPlusOnes((prev) => prev.filter((p) => p.id !== newPlusOne.id));
    }, 1000);

    const emojis = getThemeEmojis(selectedLandmark.theme);
    const newParticles: FloatingParticle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: centerX + (Math.random() - 0.5) * 40,
      y: centerY - 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      vx: (Math.random() - 0.5) * 85,
      vy: -(60 + Math.random() * 65),
      rotate: (Math.random() - 0.5) * 60,
      scale: 0.9 + Math.random() * 0.5,
    }));

    setFloatingParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1300);
  };

  const currentIdx = selectedLandmark
    ? dreamsConfig.landmarks.findIndex((l) => l.id === selectedLandmark.id)
    : -1;

  const currentWishCount = selectedLandmark ? wishCounts[selectedLandmark.id] || 0 : 0;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F] flex flex-col justify-between select-none">
      {/* Floating "+1" Badges */}
      {floatingPlusOnes.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: 0, scale: 0.6 }}
          animate={{ opacity: 0, y: -50, scale: 1.3 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180B2E]/95 border-2 border-[#FFE4A0] text-[#FFE4A0] font-mono font-bold text-xs shadow-[0_0_15px_#F5C77E]"
          style={{ left: p.x, top: p.y }}
        >
          <span>+1</span>
          <span>{p.tag}</span>
        </motion.div>
      ))}

      {/* Floating Wish Particles Burst */}
      {floatingParticles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, y: 0, scale: 0.7, x: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            y: p.vy,
            x: p.vx,
            scale: p.scale,
            rotate: p.rotate,
          }}
          transition={{ duration: 1.15, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none text-2xl select-none"
          style={{ left: p.x, top: p.y }}
        >
          {p.emoji}
        </motion.span>
      ))}

      {/* ========================================================
          LAYER 1: CINEMATIC 10-SECOND VIDEO BACKGROUND & ANCHORED HOTSPOTS
          Full-screen environmental video with seamless looping crossfade,
          interactive touch-pan exploration on mobile & mathematically locked hotspots
         ======================================================== */}
      <DreamIslandVideoBackground
        isPaused={Boolean(selectedLandmark)}
        focusedLandmarkX={selectedLandmark?.position.x}
        onUserPan={() => setShowPanHint(false)}
      >
        {() => (
          // Hotspots are anchored inside the exact 16:9 video frame
          <div className="relative w-full h-full pointer-events-none">
            {dreamsConfig.landmarks.map((landmark) => {
              const isDiscovered = discoveredIds.includes(landmark.id);
              const isSelected = selectedLandmark?.id === landmark.id;

              return (
                <DreamLandmarkNode
                  key={`landmark-beacon-${landmark.id}`}
                  landmark={landmark}
                  isDiscovered={isDiscovered}
                  isSelected={isSelected}
                  onSelect={(l) => handleSelectLandmark(l, 1)}
                />
              );
            })}
          </div>
        )}
      </DreamIslandVideoBackground>

      {/* ========================================================
          LAYER 2: DELICATE AMBIENT ATMOSPHERIC PARTICLES
          Translucent cherry blossom petals & golden stardust
         ======================================================== */}
      <DreamIslandAtmosphere isMobile={isMobile} />

      {/* Gentle Floating Swipe Hint on Mobile */}
      <AnimatePresence>
        {showPanHint && !selectedLandmark && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 z-20 pointer-events-none md:hidden flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180B2E]/92 backdrop-blur-md border border-[#F5C77E]/40 text-[#FFE4A0] text-[10.5px] font-mono shadow-[0_4px_20px_rgba(0,0,0,0.85)] whitespace-nowrap"
          >
            <span className="text-[#F5C77E] animate-pulse">←</span>
            <span>Swipe island to explore</span>
            <span className="text-[#F5C77E] animate-pulse">→</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          LAYER 3: ULTRA-COMPACT PROTECTED HEADING REGION (TOP)
          Streamlined to top band so NO landmarks are hidden behind text
         ======================================================== */}
      <header className="relative z-30 pt-2.5 sm:pt-4 px-4 text-center pointer-events-none flex flex-col items-center">
        {/* Soft atmospheric text backdrop vignette for pristine contrast against the video */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#10051F]/90 via-[#10051F]/40 to-transparent -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1 max-w-sm sm:max-w-md mx-auto"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#180B2E]/90 backdrop-blur-md border border-[#F5C77E]/30 text-[#F5C77E] text-[9.5px] font-mono tracking-[0.2em] uppercase shadow-[0_0_10px_rgba(245,199,126,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C77E]" />
            <span>{dreamsConfig.chapter}</span>
            <Heart className="w-2.5 h-2.5 text-[#F28DBB] fill-current" />
          </div>

          <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#FFF1E6] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-wide">
            {dreamsConfig.title}
          </h2>

          <p className="text-[10px] sm:text-[11.5px] font-serif italic text-[#F5C77E]/90 tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] px-2 leading-tight">
            {dreamsConfig.subtitle}
          </p>
        </motion.div>
      </header>

      {/* ========================================================
          LAYER 4: BOTTOM CONTROLS, MOBILE HORIZON DOCK & NAVIGATION
          All discovery tracking placed cleanly at the bottom
          so it NEVER obscures the island, waterfalls, or landmarks!
         ======================================================== */}
      <footer className="relative z-30 pb-20 sm:pb-24 px-3 sm:px-4 flex flex-col items-center gap-2 text-center pointer-events-auto">
        {/* Soft bottom atmospheric vignette for guaranteed high contrast */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#10051F]/95 via-[#10051F]/60 to-transparent -z-10 pointer-events-none" />

        {/* Mobile Horizon Dock: Radiant Floating Jewel Carousel */}
        <div className="w-full max-w-md px-1 py-1 md:hidden pointer-events-auto">
          {/* Glass Dock Capsule */}
          <div className="relative flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-2.5 rounded-full bg-[#130626]/85 backdrop-blur-2xl border border-[#F5C77E]/25 shadow-[0_8px_32px_rgba(0,0,0,0.85)] touch-pan-x">
            {dreamsConfig.landmarks.map((l) => {
              const isDiscovered = discoveredIds.includes(l.id);
              const isSelected = selectedLandmark?.id === l.id;
              const accent = l.accentColor;

              const shortName =
                l.id === "dream-gate"
                  ? "Gate"
                  : l.id === "dream-cottage"
                  ? "Cottage"
                  : l.id === "wishing-tree"
                  ? "Wishing Tree"
                  : l.id === "lake-of-dreams"
                  ? "Lake"
                  : l.id === "star-observatory"
                  ? "Observatory"
                  : "Horizon";

              return (
                <motion.button
                  key={`mobile-dock-${l.id}`}
                  onClick={() => handleSelectLandmark(l, 1)}
                  whileTap={{ scale: 0.93 }}
                  className={`shrink-0 flex items-center gap-1.5 py-1 px-2.5 rounded-full transition-all duration-300 cursor-pointer select-none border relative overflow-hidden ${
                    isSelected ? "scale-105 z-10" : ""
                  }`}
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${accent}45 0%, #1A0730 100%)`
                      : `linear-gradient(135deg, ${accent}22 0%, #120524 100%)`,
                    borderColor: isSelected ? "#FFFFFF" : `${accent}99`,
                    boxShadow: isSelected
                      ? `0 0 18px ${accent}, 0 0 30px ${accent}80, 0 4px 14px rgba(0,0,0,0.85)`
                      : `0 0 10px ${accent}55, 0 3px 10px rgba(0,0,0,0.7)`,
                  }}
                >
                  {/* Miniature 3D Glowing Gem Orb */}
                  <div
                    className="relative w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-white/60 shadow-sm"
                    style={{
                      background: `radial-gradient(circle at 35% 28%, #FFFFFF 0%, ${accent} 65%, #130526 100%)`,
                      boxShadow: `0 0 8px ${accent}`,
                    }}
                  >
                    <span className="text-[10px] select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {l.emoji}
                    </span>
                  </div>

                  {/* Horizon Number */}
                  <span className="font-mono text-[9px] font-bold text-[#F5C77E] tracking-tight">
                    {l.number}
                  </span>

                  {/* Horizon Name */}
                  <span className="font-serif text-[11px] font-semibold text-[#FFF8F0] tracking-wide whitespace-nowrap">
                    {shortName}
                  </span>

                  {/* Discovery Starlight Indicator */}
                  {isDiscovered && (
                    <span
                      className="text-[#FFE4A0] text-[10px] filter drop-shadow-[0_0_5px_#FFE4A0]"
                      title="Discovered"
                    >
                      ✦
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Discovery Counter & Interactive Instruction Pill */}
        <motion.div
          key={discoveredIds.length}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180B2E]/92 backdrop-blur-md border border-[#F5C77E]/35 text-[#FFF1E6] text-[10.5px] sm:text-xs font-mono shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
        >
          <Compass className="w-3.5 h-3.5 text-[#FFA26B]" />
          <span>
            <strong className="text-[#F5C77E] font-bold">{discoveredIds.length}</strong> of{" "}
            {dreamsConfig.landmarks.length} Horizons Discovered
          </span>
          <span className="text-[#F5C77E]/40">&bull;</span>
          <span className="text-[#F5C77E]/90 italic">Touch any glowing beacon ♡</span>
        </motion.div>

        {/* Explore Grand Finale Button */}
        {onNextChapter && (
          <button
            onClick={onNextChapter}
            className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#392057] to-[#66318D] border border-[#F5C77E]/50 text-[#FFF1E6] hover:scale-105 active:scale-95 transition-all text-xs font-serif tracking-wider shadow-[0_4px_20px_rgba(217,91,203,0.35)] hover:shadow-[0_4px_25px_rgba(245,199,126,0.45)] cursor-pointer"
          >
            <span>Explore Chapter 06 &bull; Grand Finale</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F5C77E] group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </footer>

      {/* ========================================================
          LAYER 5: DEDICATED IMMERSIVE LANDMARK EXPERIENCE MODAL
          Camera-style transition, champagne-gold bezel, midnight velvet card & 3D tactile button
         ======================================================== */}
      <AnimatePresence>
        {selectedLandmark && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 overflow-y-auto"
            onClick={() => setSelectedLandmark(null)}
          >
            {/* Soft Ambient Floral/Sunset Aura */}
            <div
              className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: selectedLandmark.accentColor }}
            />

            {/* Continuous Champagne-Gold Jewelry Bezel with Smooth Camera Zoom Entry */}
            <motion.div
              initial={{ scale: 0.88, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg p-[1.5px] rounded-[28px] bg-gradient-to-b from-[#F5C77E]/70 via-[#D49E48]/35 to-[#F5C77E]/50 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_25px_rgba(245,199,126,0.15)] my-auto max-h-[90vh] flex flex-col"
            >
              {/* Inner Luxurious Card — Deep Midnight Velvet */}
              <div className="relative w-full max-h-[88vh] rounded-[26px] bg-gradient-to-b from-[#1C0B30]/98 via-[#130722]/98 to-[#170A28]/98 backdrop-blur-3xl p-4 sm:p-7 text-[#FFF1E6] flex flex-col gap-2.5 sm:gap-3 text-center items-center overflow-y-auto border border-[#F5C77E]/20 shadow-inner">
                {/* Close Button in Champagne Gold */}
                <button
                  onClick={() => setSelectedLandmark(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full border border-[#F5C77E]/40 bg-white/5 hover:bg-white/10 text-[#F5C77E] transition-all hover:rotate-90 duration-300 cursor-pointer shadow-sm flex items-center justify-center z-20"
                  aria-label="Return to Dream Island"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Landmark Pill Badge */}
                <motion.div
                  key={`badge-${selectedLandmark.id}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#F5C77E]/40 bg-[#1A0B2C]/90 text-[#F5C77E] text-[11px] font-mono tracking-wider uppercase shadow-sm"
                >
                  <span className="text-base select-none">{selectedLandmark.emoji}</span>
                  <span className="font-semibold tracking-wide">
                    HORIZON {selectedLandmark.number} &bull; {selectedLandmark.subtitle}
                  </span>
                </motion.div>

                {/* Directional Slide Animated Content */}
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={`content-${selectedLandmark.id}`}
                    custom={slideDirection}
                    initial={{ opacity: 0, x: slideDirection * 35 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideDirection * 35 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-2.5 w-full"
                  >
                    {/* Landmark Name */}
                    <h3 className="text-xl sm:text-3xl font-serif font-bold text-[#FFF6E9] drop-shadow-[0_2px_14px_rgba(245,199,126,0.35)] px-2 leading-tight">
                      {selectedLandmark.name}
                    </h3>

                    {/* Tagline */}
                    <span className="text-xs font-mono tracking-widest text-[#F5C77E]/90 uppercase">
                      {selectedLandmark.tagline}
                    </span>

                    {/* Golden Filigree Decorative Divider */}
                    <div className="flex items-center justify-center gap-2.5 w-40 my-0.5">
                      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F5C77E]/60 to-[#F5C77E]" />
                      <Heart className="w-3.5 h-3.5 text-[#F28DBB] fill-current animate-pulse" />
                      <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F5C77E]/60 to-[#F5C77E]" />
                    </div>

                    {/* Description Story */}
                    <p className="text-xs sm:text-sm font-sans text-[#FFF1E6]/90 leading-relaxed px-2 sm:px-4 text-center">
                      {selectedLandmark.story}
                    </p>

                    {/* Whisper Quote */}
                    <div className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-[#F5C77E]/25">
                      <p className="text-xs sm:text-sm font-serif italic text-[#F5C77E] leading-relaxed text-center">
                        <span className="text-base font-serif mr-1 leading-none">&ldquo;</span>
                        {selectedLandmark.whisper}
                        <span className="text-base font-serif ml-1 leading-none">&rdquo;</span>
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Interactive Playful 3D Wish Button */}
                <motion.button
                  onClick={handleWishClick}
                  animate={
                    isWishJiggling
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
                  aria-label="Send a wish"
                >
                  {/* Sliding Glint */}
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

                  {/* Bouncing Icon */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1, 1.2, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex items-center justify-center pointer-events-none text-base"
                  >
                    {selectedLandmark.emoji}
                  </motion.div>

                  {/* Button Label */}
                  <span className="font-bold tracking-wide text-xs sm:text-sm drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] text-[#19092B]">
                    {currentWishCount > 0
                      ? selectedLandmark.wishConfirmedText
                      : selectedLandmark.wishPrompt}
                  </span>

                  {/* Dynamic Counter Badge */}
                  {currentWishCount > 0 ? (
                    <motion.span
                      key={currentWishCount}
                      initial={{ scale: 1.6, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 14 }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1A0B2C] text-[#FFE4A0] text-xs font-mono font-bold shadow-md border border-[#F5C77E]/80"
                    >
                      <span>{selectedLandmark.emoji}</span>
                      <span>{currentWishCount}</span>
                    </motion.span>
                  ) : (
                    <Heart className="w-3.5 h-3.5 text-[#8F5E12] fill-current pointer-events-none" />
                  )}
                </motion.button>

                {/* 6 Pagination Dots */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1.5">
                  {dreamsConfig.landmarks.map((l, i) => {
                    const isCur = l.id === selectedLandmark.id;
                    const isDisc = discoveredIds.includes(l.id);
                    return (
                      <button
                        key={`dot-${l.id}`}
                        onClick={() =>
                          handleSelectLandmark(
                            l,
                            i > dreamsConfig.landmarks.findIndex((x) => x.id === selectedLandmark.id)
                              ? 1
                              : -1
                          )
                        }
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          isCur
                            ? "w-7 h-2 bg-gradient-to-r from-[#FFE4A0] to-[#F5C77E] shadow-[0_0_14px_#F5C77E]"
                            : isDisc
                            ? "w-2 h-2 bg-[#F5C77E]/85 hover:scale-125 shadow-[0_0_8px_rgba(245,199,126,0.6)]"
                            : "w-1.5 h-1.5 bg-[#F5C77E]/30 hover:bg-[#F5C77E]/60"
                        }`}
                        aria-label={`Jump to landmark ${l.name}`}
                      />
                    );
                  })}
                </div>

                {/* Prev / Counter / Next */}
                <div className="flex items-center justify-between w-full pt-2.5 border-t border-[#F5C77E]/30 mt-0.5">
                  <button
                    onClick={handlePrevLandmark}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F5C77E]/20 to-[#E5A855]/20 hover:from-[#F5C77E]/35 hover:to-[#E5A855]/35 text-[#FFE4A0] text-xs font-mono font-semibold transition-all hover:scale-105 cursor-pointer shadow-[0_0_16px_rgba(245,199,126,0.3)] border border-[#F5C77E]"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#FFE4A0]" />
                    <span>Prev</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-[#F5C77E] tracking-widest drop-shadow-[0_0_10px_rgba(245,199,126,0.7)]">
                    {currentIdx + 1} of {dreamsConfig.landmarks.length}
                  </span>

                  <button
                    onClick={handleNextLandmark}
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
