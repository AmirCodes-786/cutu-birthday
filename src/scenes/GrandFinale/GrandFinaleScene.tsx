"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ASSETS } from "@/config/assetsConfig";
import { Heart, X, RotateCcw, Flame, MailOpen } from "lucide-react";
import { CursorSparkles } from "@/components/ui/CursorSparkles";

// Dynamically import Three.js Canvas for 3D Birthday Cake
const FinaleCanvas = dynamic(
  () =>
    import("@/components3d/Finale/FinaleCanvas").then(
      (mod) => mod.FinaleCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-[#D95BCB]/40 border-t-[#F5C77E] animate-spin" />
          <span className="text-[11px] uppercase tracking-widest text-[#F8B7D0]/70 font-mono">
            Sculpting Birthday Cake...
          </span>
        </div>
      </div>
    ),
  }
);

interface GrandFinaleSceneProps {
  onPrevChapter?: () => void;
  onRestartJourney?: () => void;
}

export function GrandFinaleScene({
  onPrevChapter,
  onRestartJourney,
}: GrandFinaleSceneProps) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isWishing, setIsWishing] = useState(false);
  const [isExtinguishing, setIsExtinguishing] = useState(false);
  const [isCelebration, setIsCelebration] = useState(false);
  const [showRevealCard, setShowRevealCard] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Multi-step Magical Make a Wish Ceremony
  const handleMakeWish = () => {
    if (!candlesLit || isWishing || isExtinguishing) return;

    // Step 1: Camera approaches, environment dims, stardust spiral begins
    setIsWishing(true);

    // Step 2: Flames flicker wildly in the breath of the wish, then extinguish
    setTimeout(() => {
      setIsExtinguishing(true);

      setTimeout(() => {
        setCandlesLit(false);
        setIsExtinguishing(false);
        setIsWishing(false);
        setIsCelebration(true);

        // Step 3: Celebratory burst and floating birthday reveal popup
        setTimeout(() => {
          setShowRevealCard(true);
        }, 800);
      }, 750);
    }, 1300);
  };

  // Sequential Relight Candles Interaction
  const handleRelightCandles = () => {
    setShowRevealCard(false);
    setShowLetterModal(false);
    setIsCelebration(false);
    setIsWishing(false);
    setIsExtinguishing(false);

    // Re-ignite candles smoothly
    setTimeout(() => {
      setCandlesLit(true);
    }, 300);
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F] select-none flex flex-col justify-between">
      {/* Interactive Stardust Cursor */}
      <CursorSparkles />

      {/* ========================================================
          LAYER 1: FLAT ENVIRONMENTAL BACKGROUND
          (Newly supplied cake-free moonlit garden with empty gold stand)
         ======================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={ASSETS.finale.birthdayCelebration}
          alt="Moonlit Garden Birthday Celebration"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Soft Contrast Vignettes for Guaranteed UI Readability */}
        <div
          className={`absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-[#10051F]/85 via-[#10051F]/30 to-transparent transition-opacity duration-1000 ${
            isWishing ? "opacity-100" : "opacity-90"
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-[#10051F]/90 via-[#10051F]/40 to-transparent" />
      </div>

      {/* ========================================================
          LAYER 2: INDEPENDENT 3D BIRTHDAY CAKE & CELEBRATION
          (Positioned precisely on the photo's empty gold display stand)
         ======================================================== */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <FinaleCanvas
          candlesLit={candlesLit}
          isExtinguishing={isExtinguishing}
          isWishing={isWishing}
          isCelebration={isCelebration}
          onBlowCandles={handleMakeWish}
          isMobile={isMobile}
        />
      </div>

      {/* ========================================================
          LAYER 3: ULTRA-COMPACT PROTECTED HEADING (TOP)
         ======================================================== */}
      <header className="relative z-30 pt-2 sm:pt-4 px-3 sm:px-4 text-center pointer-events-none flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1 max-w-xs sm:max-w-md mx-auto"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-[#180B2E]/90 backdrop-blur-md border border-[#F5C77E]/30 text-[#F5C77E] text-[9px] sm:text-[9.5px] font-mono tracking-[0.2em] uppercase shadow-[0_0_10px_rgba(245,199,126,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C77E]" />
            <span>CHAPTER 06 &bull; GRAND FINALE</span>
            <Heart className="w-2.5 h-2.5 text-[#F28DBB] fill-current" />
          </div>

          <h2 className="text-base sm:text-2xl font-serif font-bold text-[#FFF1E6] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-wide">
            A UNIVERSE THAT CELEBRATES RUHI
          </h2>

          <p className="text-[9.5px] sm:text-[11.5px] font-serif italic text-[#F5C77E]/90 tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] px-2 leading-tight">
            {candlesLit
              ? "Close your eyes, make a heartfelt wish, and blow out the candles..."
              : "YOUR WISH HAS BEEN CARRIED INTO THE COSMOS! ✨"}
          </p>
        </motion.div>
      </header>

      {/* ========================================================
          LAYER 4: CELEBRATORY FLOATING BIRTHDAY POPUP CARD
          (Appears majestically when candles are extinguished)
         ======================================================== */}
      <AnimatePresence>
        {showRevealCard && !candlesLit && (
          <div className="absolute inset-0 z-35 flex items-center justify-center p-3 sm:p-4 pointer-events-none -translate-y-4 sm:-translate-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -15 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xs sm:max-w-md p-[1.5px] rounded-3xl bg-gradient-to-b from-[#F5C77E] via-[#D49E48]/60 to-[#F5C77E] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,199,126,0.35)] pointer-events-auto"
            >
              {/* Inner Velvet Floating Card */}
              <div className="relative rounded-[22px] bg-gradient-to-b from-[#1C0B30]/98 via-[#130722]/98 to-[#170A28]/98 backdrop-blur-2xl px-4 py-3.5 sm:px-6 sm:py-5 text-center flex flex-col items-center gap-2 sm:gap-2.5 border border-[#F5C77E]/25">
                {/* Close Button to view cake unobstructed */}
                <button
                  onClick={() => setShowRevealCard(false)}
                  className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#F5C77E]/40 bg-white/5 hover:bg-white/10 text-[#F5C77E] transition-all hover:rotate-90 duration-300 cursor-pointer shadow-sm flex items-center justify-center"
                  aria-label="Dismiss Popup"
                  title="Close to admire cake"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>

                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#F5C77E]/40 bg-[#1A0B2C]/90 text-[#F5C77E] text-[9px] sm:text-[10px] font-mono tracking-wider uppercase shadow-sm">
                  <span>✦ BIRTHDAY WISH BLESSED ✦</span>
                </div>

                {/* Romantic Glowing Headline */}
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#FFF6E9] drop-shadow-[0_2px_12px_rgba(245,199,126,0.4)] px-1 sm:px-2 leading-tight">
                  HAPPY BIRTHDAY, RUHI!
                </h3>

                {/* Heartfelt Wish Quote */}
                <p className="text-[11px] sm:text-[13px] font-serif italic text-[#FFE8C2] leading-relaxed px-1 sm:px-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  &ldquo;May every wish your heart holds find its way to you. You deserve all the happiness this world can offer.&rdquo;
                </p>

                {/* Sole Golden Envelope CTA Button */}
                <motion.button
                  onClick={() => setShowLetterModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="mt-0.5 sm:mt-1 group relative inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-[#F5C77E] via-[#FFE4A0] to-[#E5AC58] text-[#19092B] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_24px_rgba(245,199,126,0.6)] cursor-pointer transition-all duration-300"
                >
                  <MailOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#19092B]" />
                  <span>READ YOUR BIRTHDAY LETTER ♡</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          LAYER 5: INTERACTIVE CONTROLS & WISH BUTTON (BOTTOM)
         ======================================================== */}
      <footer className="relative z-30 pb-16 sm:pb-24 px-4 flex flex-col items-center gap-2 text-center pointer-events-auto max-w-lg mx-auto">
        {candlesLit ? (
          /* Primary Make a Wish Interaction */
          <motion.button
            onClick={handleMakeWish}
            disabled={isWishing}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={`group relative inline-flex items-center gap-2 px-6 py-2 sm:px-7 sm:py-2.5 rounded-full border-2 text-white font-serif text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 shadow-2xl select-none overflow-hidden cursor-pointer ${
              isWishing
                ? "bg-[#66318D] border-[#F5C77E] animate-pulse"
                : "bg-gradient-to-r from-[#FFB800] via-[#FF5722] to-[#FF0055] border-white/80 shadow-[0_0_28px_rgba(255,184,0,0.7),0_6px_22px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(255,184,0,0.95)]"
            }`}
          >
            {/* Sliding Glint Animation */}
            <motion.div
              animate={{ x: ["-130%", "280%"] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] pointer-events-none"
            />
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFFCE8] fill-current animate-pulse" />
            <span>
              {isWishing ? "Making Your Wish..." : "MAKE A WISH ✨"}
            </span>
          </motion.button>
        ) : (
          /* Controls after candles are blown out:
             Strictly ONLY Relight The Candles in footer, as Read Letter is on the popup! */
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleRelightCandles}
              className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#180B2E]/95 border border-[#F5C77E]/50 text-[#FFE4A0] hover:text-white hover:border-[#F5C77E] hover:scale-105 active:scale-95 transition-all text-xs font-serif tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F5C77E]" />
              <span>RELIGHT THE CANDLES</span>
            </button>

            {/* If popup was dismissed with 'x', allow reopening it */}
            {!showRevealCard && (
              <button
                onClick={() => setShowRevealCard(true)}
                className="text-[10.5px] sm:text-[11px] font-serif text-[#F5C77E]/80 hover:text-[#F5C77E] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                ✉ Open Birthday Letter Card
              </button>
            )}
          </div>
        )}

        {/* Back to World 05: Dream Island */}
        {onPrevChapter && (
          <button
            onClick={onPrevChapter}
            className="text-[10.5px] sm:text-[11px] font-mono text-[#F5C77E]/75 hover:text-[#F5C77E] transition-colors underline-offset-4 hover:underline cursor-pointer pt-0.5"
          >
            &larr; Back to World 05: Dream Island
          </button>
        )}
      </footer>

      {/* ========================================================
          LAYER 6: ROYAL CELEBRATORY BIRTHDAY LETTER MODAL
         ======================================================== */}
      <AnimatePresence>
        {showLetterModal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 overflow-y-auto"
            onClick={() => setShowLetterModal(false)}
          >
            {/* Soft Ambient Gold Aura */}
            <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-30 bg-[#FFB800] pointer-events-none" />

            {/* Luxurious Champagne-Gold Jewelry Bezel Card */}
            <motion.div
              initial={{ scale: 0.88, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg p-[1.5px] rounded-[28px] bg-gradient-to-b from-[#F5C77E] via-[#D49E48]/50 to-[#F5C77E] shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(245,199,126,0.3)] my-auto max-h-[90vh] flex flex-col"
            >
              {/* Inner Velvet Card */}
              <div className="relative w-full max-h-[88vh] rounded-[26px] bg-gradient-to-b from-[#1C0B30]/98 via-[#130722]/98 to-[#170A28]/98 backdrop-blur-3xl p-4 sm:p-8 text-[#FFF1E6] flex flex-col gap-2.5 sm:gap-3.5 text-center items-center overflow-y-auto no-scrollbar border border-[#F5C77E]/25 shadow-inner">
                {/* Close Button */}
                <button
                  onClick={() => setShowLetterModal(false)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full border border-[#F5C77E]/40 bg-white/5 hover:bg-white/10 text-[#F5C77E] transition-all hover:rotate-90 duration-300 cursor-pointer shadow-sm flex items-center justify-center z-20"
                  aria-label="Close Letter"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Eyebrow Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#F5C77E]/40 bg-[#1A0B2C]/90 text-[#F5C77E] text-[10.5px] font-mono tracking-wider uppercase shadow-sm">
                  <span>🎂 WISH SENT TO THE STARS</span>
                  <span className="text-[#FFE4A0]">✨</span>
                </div>

                {/* Headline */}
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF6E9] drop-shadow-[0_2px_14px_rgba(245,199,126,0.45)] px-2 leading-tight">
                  HAPPY BIRTHDAY, RUHI!
                </h3>

                {/* Golden Filigree Divider */}
                <div className="flex items-center justify-center gap-2.5 w-44 my-0.5">
                  <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F5C77E]/60 to-[#F5C77E]" />
                  <Heart className="w-3.5 h-3.5 text-[#F28DBB] fill-current animate-pulse" />
                  <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F5C77E]/60 to-[#F5C77E]" />
                </div>

                {/* Heartfelt Paragraphs */}
                <div className="flex flex-col gap-2.5 text-xs sm:text-sm font-sans text-[#FFF1E6]/90 leading-relaxed px-2 sm:px-4 text-center">
                  <p>May every wish your heart holds find its way to you. You deserve all the happiness this world can offer.</p>
                  <p>May all your wishes cross the cosmos and come true.</p>
                  <p>You are the most precious star in this entire universe, and today we celebrate everything that makes you so undeniably wonderful.</p>
                  <p>Thank you for existing, for being you, and for sharing your life with me.</p>
                </div>

                {/* Love Seal Note */}
                <div className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-[#F5C77E]/30">
                  <p className="text-xs sm:text-sm font-serif italic text-[#F5C77E] leading-relaxed text-center">
                    &ldquo;Made with infinite love by Suhel, forever yours. ♡&rdquo;
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleRelightCandles}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#F5C77E] to-[#D49E48] text-[#19092B] font-serif font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,199,126,0.5)] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Relight & Wish Again</span>
                  </button>
                  <button
                    onClick={() => setShowLetterModal(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FFF1E6] font-serif text-xs transition-all cursor-pointer"
                  >
                    <span>Admire Celebration</span>
                  </button>
                  {onRestartJourney && (
                    <button
                      onClick={onRestartJourney}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-[#F5C77E]/25 text-[#F5C77E]/80 hover:text-[#F5C77E] font-serif text-xs transition-all cursor-pointer"
                    >
                      <span>Replay Journey ↺</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
