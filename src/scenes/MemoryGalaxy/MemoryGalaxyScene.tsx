"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { getSceneBackgroundUrl } from "@/config/assetsConfig";
import { memoriesConfig, MemoryItem } from "@/config/memoriesConfig";
import { Heart, ChevronLeft, ChevronRight, X, ArrowRight, Camera, Star } from "lucide-react";
import { CursorSparkles } from "@/components/ui/CursorSparkles";

// Dynamically import 3D Memory Galaxy Canvas
const MemoryGalaxyCanvas = dynamic(
  () =>
    import("@/components3d/MemoryGalaxy/MemoryGalaxyCanvas").then(
      (mod) => mod.MemoryGalaxyCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-[#D95BCB]/40 border-t-[#F5C77E] animate-spin" />
          <span className="text-[11px] uppercase tracking-widest text-[#F8B7D0]/70 font-mono">
            Aligning Memory Stars...
          </span>
        </div>
      </div>
    ),
  }
);

// Spring slide animation variants for smooth, GPU-accelerated memory switching
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 110 : -110,
    opacity: 0,
    scale: 0.95,
    filter: "blur(3px)",
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 320, damping: 30 },
      opacity: { duration: 0.26, ease: "easeOut" },
      scale: { duration: 0.26, ease: "easeOut" },
      filter: { duration: 0.22 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -110 : 110,
    opacity: 0,
    scale: 0.95,
    filter: "blur(3px)",
    transition: {
      x: { type: "spring", stiffness: 320, damping: 30 },
      opacity: { duration: 0.2, ease: "easeIn" },
      scale: { duration: 0.2, ease: "easeIn" },
      filter: { duration: 0.18 },
    },
  }),
};

const textVariants: Variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 14 : -14,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -14 : 14,
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  }),
};

interface MemoryGalaxySceneProps {
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export function MemoryGalaxyScene({
  onNextChapter,
  onPrevChapter,
}: MemoryGalaxySceneProps) {
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentIndex = selectedMemory
    ? memoriesConfig.memories.findIndex((m) => m.id === selectedMemory.id)
    : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    if (currentIndex > 0) {
      setSelectedMemory(memoriesConfig.memories[currentIndex - 1]);
    } else {
      setSelectedMemory(
        memoriesConfig.memories[memoriesConfig.memories.length - 1]
      );
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    if (currentIndex < memoriesConfig.memories.length - 1) {
      setSelectedMemory(memoriesConfig.memories[currentIndex + 1]);
    } else {
      setSelectedMemory(memoriesConfig.memories[0]);
    }
  };

  const handleSelectDot = (targetIndex: number) => {
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setSelectedMemory(memoriesConfig.memories[targetIndex]);
  };

  // Keyboard navigation for memories
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMemory) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedMemory(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMemory, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F] select-none flex flex-col justify-between">
      {/* Interactive Cursor Stardust Trail */}
      <CursorSparkles />

      {/* ========================================================
          LAYER 1: CINEMATIC ENVIRONMENT (Deep Cosmic Atmosphere)
         ======================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={getSceneBackgroundUrl("galaxy")}
          alt="Cosmic Starry Nebula"
          fill
          className="object-cover object-center mix-blend-screen opacity-25"
          sizes="100vw"
        />

        {/* Cinematic deep space midnight plum vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#10051F]/40 to-[#10051F]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10051F] via-transparent to-[#10051F]/80" />
      </div>

      {/* ========================================================
          LAYER 2 & 3: 3D CELESTIAL CONSTELLATION & SPIRAL GALAXY
          - Slot 0: Center Featured Memory (1.4x scale)
          - Slots 1-5: 5 Surrounding Memories (Upper-L, Upper-R, Mid-R, Lower-R, Lower-L)
         ======================================================== */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <MemoryGalaxyCanvas
          featuredIndex={featuredIndex}
          onSelectFeatured={(idx) => setFeaturedIndex(idx)}
          onOpenViewer={(mem) => setSelectedMemory(mem)}
          selectedMemory={selectedMemory}
          isMobile={isMobile}
        />
      </div>

      {/* ========================================================
          LAYER 4: CINEMATIC INTERFACE
         ======================================================== */}
      {/* Top Header: Protected Heading Region (Zero overlap with 3D frames) */}
      <header className="relative z-20 pt-6 sm:pt-8 px-6 text-center pointer-events-none flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1.5 max-w-xl mx-auto"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#180B2E]/90 backdrop-blur-md border border-[#F5C77E]/40 text-[#F5C77E] text-[10px] font-mono tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(245,199,126,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C77E]" />
            <span>Chapter 03 &bull; Starlit Moments</span>
            <Heart className="w-2.5 h-2.5 text-[#F28DBB] fill-current" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#FFF1E6] drop-shadow-[0_2px_22px_rgba(217,91,203,0.45)] mt-0.5 tracking-wide">
            {memoriesConfig.title}
          </h2>

          <p className="text-xs sm:text-sm font-serif italic text-[#F5C77E]/95 tracking-wide text-glow-gold whitespace-normal sm:whitespace-nowrap px-4 leading-relaxed">
            {memoriesConfig.subtitle}
          </p>
        </motion.div>
      </header>

      {/* Bottom Controls: Instruction Row, Explore Chapter 04, and Navigation Spacing */}
      <footer className="relative z-20 pb-20 sm:pb-24 px-4 flex flex-col items-center text-center gap-2.5 pointer-events-auto">
        {/* Mobile Swipeable Carousel of Surrounding Memories */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm px-2 mb-1"
          >
            <div className="flex items-center justify-center gap-2 py-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {memoriesConfig.memories.map((mem, idx) => {
                const isFeatured = idx === featuredIndex;
                return (
                  <button
                    key={mem.id}
                    onClick={() => setFeaturedIndex(idx)}
                    className={`relative flex-shrink-0 w-12 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md ${
                      isFeatured
                        ? "border-[#F5C77E] scale-110 shadow-[0_0_14px_rgba(245,199,126,0.85)] ring-1 ring-[#F5C77E]"
                        : "border-[#D7A0A8]/40 opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`Select memory ${idx + 1} as featured`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={mem.image}
                        alt={mem.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 inset-x-0 bg-[#180B2E]/90 text-[9px] font-mono text-[#F5C77E] py-0.5 text-center border-t border-[#F5C77E]/30">
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Centered Gallery Instruction in its own clean row beneath all frames */}
        <p className="text-xs sm:text-sm text-[#F5C77E] font-serif italic tracking-wide text-glow-gold select-none">
          {memoriesConfig.instruction}
        </p>

        {onNextChapter && (
          <button
            onClick={onNextChapter}
            className="group inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-gradient-to-r from-[#392057] to-[#66318D] border border-[#F5C77E]/50 text-[#FFF1E6] hover:scale-105 active:scale-95 transition-all text-xs font-serif tracking-wider shadow-[0_4px_20px_rgba(217,91,203,0.35)] hover:shadow-[0_4px_25px_rgba(245,199,126,0.45)] cursor-pointer"
          >
            <span>Explore Chapter 04 &bull; Enchanted Garden</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F5C77E] group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </footer>

      {/* ========================================================
          FULLSCREEN CINEMATIC PHOTO VIEWER MODAL
          Preserves 100% exact aspect ratio with zero zoom & zero black bars!
         ======================================================== */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[94dvh] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-y-auto my-auto p-4 sm:p-6 rounded-3xl bg-[#180B2E]/95 backdrop-blur-2xl border-2 border-[#D7A0A8]/50 text-[#FFF1E6] shadow-[0_24px_60px_rgba(16,5,31,0.95)] flex flex-col gap-3"
            >
              {/* Top Bar: Date badge, counter, Set-as-Featured, and close button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#392057] border border-[#F5C77E]/40 text-[#F5C77E] text-[10px] font-mono tracking-wider uppercase">
                    {selectedMemory.date || "Constellation Memory"}
                  </span>
                  <span className="text-[11px] font-mono text-white/50">
                    {currentIndex + 1} of {memoriesConfig.memories.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (currentIndex >= 0) setFeaturedIndex(currentIndex);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 transition-all ${
                      featuredIndex === currentIndex
                        ? "bg-[#F5C77E]/20 border border-[#F5C77E] text-[#F5C77E]"
                        : "bg-white/5 border border-white/20 text-white/70 hover:text-white hover:border-[#F5C77E]/60"
                    }`}
                    title="Make this the central featured memory"
                  >
                    <Star className="w-3 h-3 text-[#F5C77E] fill-current" />
                    <span>{featuredIndex === currentIndex ? "Featured Star" : "Set Featured"}</span>
                  </button>

                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close memory viewer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Photo Display Frame with Slide Arrows:
                  - Left and Right slide arrows flanking the picture
                  - Smooth, optimized directional sliding animation on next/prev
                  - Hugs the photograph border exactly: ZERO black bars, ZERO crop/zoom */}
              <div
                className="relative w-full flex items-center justify-center my-0.5 px-8 sm:px-10"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Left Slide Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-[#180B2E]/90 hover:bg-[#392057] border border-[#F5C77E]/50 text-[#F5C77E] transition-all hover:scale-110 active:scale-90 cursor-pointer shadow-xl backdrop-blur-md"
                  aria-label="Previous memory"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Animated Photo Slide Page */}
                <div className="relative flex items-center justify-center min-h-[46vh] sm:min-h-[52vh] w-full overflow-hidden">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={selectedMemory.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="relative inline-flex items-center justify-center rounded-2xl overflow-hidden border-2 border-[#F5C77E]/75 shadow-[0_12px_40px_rgba(0,0,0,0.85)] bg-[#10051F] max-w-full cursor-pointer will-change-transform"
                      onClick={handleNext}
                      title="Click or tap to view next memory"
                    >
                      <Image
                        src={selectedMemory.image}
                        alt={selectedMemory.title}
                        width={600}
                        height={800}
                        className="max-h-[48vh] sm:max-h-[52vh] max-w-full w-auto h-auto object-contain rounded-xl block select-none pointer-events-none"
                        sizes="(max-width: 768px) 90vw, 500px"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Slide Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-[#180B2E]/90 hover:bg-[#392057] border border-[#F5C77E]/50 text-[#F5C77E] transition-all hover:scale-110 active:scale-90 cursor-pointer shadow-xl backdrop-blur-md"
                  aria-label="Next memory"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Memory Constellation Dots */}
              <div className="flex items-center justify-center gap-2 py-0.5">
                {memoriesConfig.memories.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectDot(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentIndex
                        ? "w-6 h-2 bg-[#F5C77E] shadow-[0_0_10px_#F5C77E]"
                        : "w-2 h-2 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Jump to memory ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Memory Story Content with Directional Slide & Fade Animation */}
              <div className="min-h-[75px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={selectedMemory.id + "-text"}
                    custom={direction}
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col gap-1 text-center sm:text-left mt-0.5"
                  >
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5C77E] text-glow-gold">
                      {selectedMemory.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-serif italic text-[#F8B7D0]">
                      &ldquo;{selectedMemory.caption}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-[#FFF1E6]/85 font-sans leading-relaxed mt-0.5">
                      {selectedMemory.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
