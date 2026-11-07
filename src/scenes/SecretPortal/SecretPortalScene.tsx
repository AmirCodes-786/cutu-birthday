"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ASSETS } from "@/config/assetsConfig";
import { siteConfig } from "@/config/siteConfig";
import { ArrowRight, Heart } from "lucide-react";
import { CursorSparkles } from "@/components/ui/CursorSparkles";

// Dynamically import 3D Canvas
const PortalCanvas = dynamic(
  () =>
    import("@/components3d/Portal/PortalCanvas").then(
      (mod) => mod.PortalCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#D95BCB]/40 border-t-[#F5C77E] animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-[#F8B7D0]/70 font-mono">
            Unveiling Starlit Realm...
          </span>
        </div>
      </div>
    ),
  }
);

interface SecretPortalSceneProps {
  onEnterUniverse: () => void;
}

export function SecretPortalScene({ onEnterUniverse }: SecretPortalSceneProps) {
  const [stage, setStage] = useState<"dark" | "stars" | "ready">("dark");
  const [isEntering, setIsEntering] = useState(false);
  const [isPortalHovered, setIsPortalHovered] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("stars"), 200);
    const t2 = setTimeout(() => setStage("ready"), 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleEnterClick = () => {
    if (isEntering) return;
    setIsEntering(true);
  };

  const handleDiveComplete = () => {
    onEnterUniverse();
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F] select-none flex flex-col justify-between">
      {/* Interactive Cursor Stardust Trail */}
      <CursorSparkles />

      {/* ========================================================
          LAYER 1: CINEMATIC ENVIRONMENT (Living Background Art)
         ======================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{
          opacity: stage === "dark" ? 0 : 0.95,
          scale: isEntering ? 1.15 : 1,
        }}
        transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src={ASSETS.portal.heartPortalRef}
          alt="Celestial Cherry Blossom Heart Portal"
          fill
          priority
          className="object-cover object-[center_35%] sm:object-center"
          sizes="100vw"
        />

        {/* Upper Cosmic Clouds Layer */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <Image
            src={ASSETS.portal.cosmicNebula}
            alt="Cosmic Clouds"
            fill
            className="object-cover object-top"
          />
        </div>

        {/* Soft atmospheric vignettes */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#10051F]/25 to-[#10051F]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10051F] via-transparent to-[#10051F]/60" />
      </motion.div>

      {/* ========================================================
          LAYER 2 & 3: 3D LIVING WORLD, PETALS & CELESTIAL STARDUST
         ======================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "dark" ? 0 : 1 }}
        transition={{ duration: 1.4 }}
        className="absolute inset-0 z-10 pointer-events-auto"
      >
        <PortalCanvas
          isEntering={isEntering}
          onEnterComplete={handleDiveComplete}
          onPortalClick={handleEnterClick}
          onPortalHover={setIsPortalHovered}
        />
      </motion.div>

      {/* ========================================================
          LAYER 4: MASTER BIRTHDAY HERO COMPOSITION
          Framed perfectly in the center of the living heart portal
         ======================================================== */}
      <div className="absolute top-[48%] sm:top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center w-full max-w-xl px-4 pointer-events-none">
        <AnimatePresence>
          {stage === "ready" && !isEntering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center gap-3 sm:gap-4 w-full p-4 sm:p-6"
            >
              {/* Soft radial contrast veil ensuring 100% crystal-clear readability */}
              <div className="absolute inset-0 -z-10 rounded-full bg-radial from-[#10051F]/70 via-[#10051F]/35 to-transparent blur-xl pointer-events-none" />

              {/* Eyebrow Banner */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#180B2E]/80 backdrop-blur-md border border-[#F5C77E]/30 text-[#F5C77E] text-[9px] sm:text-xs font-mono tracking-[0.25em] uppercase shadow-[0_0_16px_rgba(245,199,126,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C77E]" />
                <span className="truncate">{siteConfig.portal.eyebrow}</span>
                <Heart className="w-2.5 h-2.5 text-[#F28DBB] fill-current" />
              </div>

              {/* Main Heading: HAPPY BIRTHDAY + RUHI */}
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl sm:text-3xl md:text-4xl font-serif font-bold uppercase tracking-[0.2em] text-[#FFF1E6] drop-shadow-[0_2px_16px_rgba(16,5,31,0.9)]">
                  HAPPY BIRTHDAY
                </span>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-[#F5C77E] text-glow-gold drop-shadow-[0_4px_30px_rgba(245,199,126,0.6)] leading-none mt-0.5">
                  RUHI
                </h1>
              </div>

              {/* Supporting Romantic Message */}
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-[#FFF1E6] max-w-md tracking-wide drop-shadow-[0_2px_12px_rgba(16,5,31,0.95)]">
                {siteConfig.portal.supportingMessage}
              </p>

              {/* Primary Action Button */}
              <motion.button
                onClick={handleEnterClick}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Let the magic begin"
                className="pointer-events-auto group relative mt-1 sm:mt-2 inline-flex items-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full overflow-hidden cursor-pointer shadow-[0_8px_32px_rgba(217,91,203,0.5)]"
              >
                {/* Glowing layered gradient borders and fill */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#392057] via-[#66318D] to-[#392057] rounded-full" />
                <span className="absolute inset-0 rounded-full border border-[#F5C77E]/70 group-hover:border-[#F5C77E] transition-colors" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-radial from-[#F5C77E]/30 via-transparent to-transparent" />
                <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D95BCB]/50 to-[#F5C77E]/50 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Button Content */}
                <Heart className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5C77E] fill-current group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 text-xs sm:text-sm md:text-base font-serif font-semibold tracking-wider text-[#FFF1E6] group-hover:text-white">
                  {siteConfig.portal.buttonText}
                </span>
                <ArrowRight className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5C77E] group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entering transition state */}
        <AnimatePresence>
          {isEntering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center px-4"
            >
              <p className="font-serif italic text-xl sm:text-2xl text-[#F5C77E] text-glow-gold drop-shadow-lg">
                Entering a universe made just for you...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen flash on portal plunge */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 1.0] }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-b from-[#FFF1E6] via-[#F8B7D0] to-[#392057] mix-blend-screen"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
