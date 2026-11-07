"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assetLoader, LoadingProgress } from "@/services/loadingManager";
import { Sparkles, Heart } from "lucide-react";

interface CinematicPreloaderProps {
  onLoaded: () => void;
}

export function CinematicPreloader({ onLoaded }: CinematicPreloaderProps) {
  const [progressData, setProgressData] = useState<LoadingProgress>(() =>
    assetLoader.getProgressSnapshot()
  );
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

  // Subscribe to real loading progress events
  useEffect(() => {
    // Start asset loading pipeline
    assetLoader.start();

    const unsubscribe = assetLoader.subscribe((snapshot) => {
      setProgressData(snapshot);
    });

    return () => unsubscribe();
  }, []);

  // Smoothly interpolate display percentage to match real progress
  useEffect(() => {
    let animId: number;
    const target = progressData.percentage;

    const animateStep = () => {
      setDisplayPercentage((prev) => {
        if (prev < target) {
          const step = Math.max(1, Math.ceil((target - prev) * 0.15));
          return Math.min(target, prev + step);
        } else if (prev > target) {
          return target;
        }
        return prev;
      });

      if (displayPercentage < target) {
        animId = requestAnimationFrame(animateStep);
      }
    };

    animId = requestAnimationFrame(animateStep);
    return () => cancelAnimationFrame(animId);
  }, [progressData.percentage, displayPercentage]);

  // When 100% loaded and tasks complete, trigger graceful cinematic exit
  useEffect(() => {
    if (
      displayPercentage >= 100 &&
      progressData.isComplete &&
      !hasFinishedRef.current
    ) {
      hasFinishedRef.current = true;
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onLoaded();
        }, 850);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [displayPercentage, progressData.isComplete, onLoaded]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 bg-[#10051F] text-[#FFF1E6] select-none overflow-hidden"
        >
          {/* ========================================================
              BACKGROUND: ATMOSPHERIC NEBULA & SPARKLING STARDUST
             ======================================================== */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Soft Radial Ambient Lights */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#66318D]/25 via-[#D95BCB]/15 to-transparent blur-3xl opacity-80" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#F5C77E]/10 blur-2xl" />

            {/* Vignettes for cinematic contrast */}
            <div className="absolute inset-0 bg-radial from-transparent via-[#10051F]/40 to-[#10051F]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#10051F]/80 via-transparent to-[#10051F]" />

            {/* Subtle floating background star specks (CSS, 0% CPU cost) */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-[#FFF1E6] animate-pulse"
                  style={{
                    left: `${(i * 17) % 96}%`,
                    top: `${(i * 23) % 94}%`,
                    opacity: 0.2 + ((i % 5) * 0.15),
                    animationDuration: `${2.0 + (i % 4) * 0.8}s`,
                    animationDelay: `${(i % 6) * 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ========================================================
              HEADER: CINEMATIC BRAND IDENTITY
             ======================================================== */}
          <header className="relative z-10 pt-4 flex flex-col items-center gap-2 text-center">
            {/* Glowing Champagne Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180B2E]/80 backdrop-blur-md border border-[#F5C77E]/30 text-[#F5C77E] text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase shadow-[0_0_15px_rgba(245,199,126,0.2)]"
            >
              <Sparkles className="w-3 h-3 text-[#F5C77E]" />
              <span>HER UNIVERSE</span>
              <Sparkles className="w-3 h-3 text-[#F5C77E]" />
            </motion.div>

            {/* Subtitle */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[10px] sm:text-[11.5px] font-serif tracking-[0.25em] text-[#D7A0A8] uppercase"
            >
              A Little World Made Just for You
            </motion.span>
          </header>

          {/* ========================================================
              CENTERPIECE: LUMINOUS ORBIT & MAIN MESSAGE
             ======================================================== */}
          <main className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md px-4 text-center">
            {/* Concentric Celestial Orbit Ring */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center">
              {/* Outer Pulsing Aura */}
              <div className="absolute inset-0 rounded-full border border-[#D95BCB]/30 animate-ping opacity-30" />

              {/* Rotating Dashed Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 rounded-full border border-dashed border-[#F5C77E]/40"
              >
                {/* Orbiting Stardust Diamond */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#FFFFFF] shadow-[0_0_10px_#FFFFFF]" />
              </motion.div>

              {/* Counter-Rotating Inner Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-t-[#F28DBB] border-r-transparent border-b-[#D95BCB]/40 border-l-transparent"
              />

              {/* Glowing Center Jewel */}
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  boxShadow: [
                    "0 0 20px rgba(217,91,203,0.6)",
                    "0 0 35px rgba(245,199,126,0.9)",
                    "0 0 20px rgba(217,91,203,0.6)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#66318D] via-[#D95BCB] to-[#F5C77E] flex items-center justify-center border-2 border-white/80"
              >
                <Heart className="w-5 h-5 text-white fill-current drop-shadow-md" />
              </motion.div>
            </div>

            {/* Main Title */}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF1E6] drop-shadow-[0_2px_15px_rgba(217,91,203,0.4)] tracking-wide mb-2">
              Preparing your universe...
            </h2>

            {/* Rotating Dynamic Stage Supporting Message */}
            <motion.p
              key={progressData.stageMessage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs sm:text-sm font-serif italic text-[#F5C77E] tracking-wider mb-8 drop-shadow-sm min-h-[1.5rem]"
            >
              {progressData.stageMessage}
            </motion.p>

            {/* ========================================================
                PROGRESS BAR & REAL ASSET TELEMETRY
               ======================================================== */}
            <div className="w-full flex flex-col gap-2.5">
              {/* Outer Bar Shell */}
              <div className="relative w-full h-2 rounded-full bg-[#180B2E] border border-[#F5C77E]/25 overflow-hidden p-[1px] shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
                {/* Glowing Progress Fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#D95BCB] via-[#F28DBB] to-[#F5C77E] shadow-[0_0_12px_rgba(245,199,126,0.8)] relative will-change-[width]"
                  style={{ width: `${displayPercentage}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                >
                  {/* Leading Edge Shimmer Beam */}
                  <span className="absolute right-0 top-0 bottom-0 w-3 bg-white/70 blur-[1px] rounded-full" />
                </motion.div>
              </div>

              {/* Progress Labels: Percentage & Completed Tasks */}
              <div className="flex items-center justify-between text-[11px] font-mono tracking-wider">
                <span className="text-[#F8B7D0]/70 uppercase tracking-widest text-[9.5px]">
                  {progressData.completedTasks} of {progressData.totalTasks} Assets Ready
                </span>
                <span className="text-[#F5C77E] font-bold text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(245,199,126,0.5)]">
                  {displayPercentage}%
                </span>
              </div>

              {/* Current Asset Name Indicator */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#D7A0A8]/80 font-mono tracking-tight truncate max-w-full px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D95BCB] shrink-0 animate-ping" />
                <span className="truncate">Loading: {progressData.currentTaskName}</span>
              </div>
            </div>
          </main>

          {/* ========================================================
              FOOTER: ELEGANT DEDICATION TAG
             ======================================================== */}
          <footer className="relative z-10 pb-4 text-center">
            <span className="text-[10px] font-serif text-[#F8B7D0]/50 tracking-[0.2em] uppercase">
              ✦ Six Worlds of Wonder, Memories & Love ✦
            </span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
