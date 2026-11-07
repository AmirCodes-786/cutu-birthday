"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ASSETS } from "@/config/assetsConfig";
import { letterConfig } from "@/config/letterConfig";
import { Heart, MailOpen, X, ArrowRight, RotateCcw } from "lucide-react";
import { CursorSparkles } from "@/components/ui/CursorSparkles";

// Dynamically import 3D Envelope Canvas
const EnvelopeCanvas = dynamic(
  () =>
    import("@/components3d/Envelope/EnvelopeCanvas").then(
      (mod) => mod.EnvelopeCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-[#D95BCB]/40 border-t-[#F5C77E] animate-spin" />
          <span className="text-[11px] uppercase tracking-widest text-[#F8B7D0]/70 font-mono">
            Preparing Antique Letter...
          </span>
        </div>
      </div>
    ),
  }
);

interface LoveLetterSceneProps {
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export function LoveLetterScene({
  onNextChapter,
  onPrevChapter,
}: LoveLetterSceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Allow flap opening and paper slide-out to animate first, then reveal readable parchment
    setTimeout(() => {
      setShowLetterModal(true);
    }, 950);
  };

  const handleCloseLetter = () => {
    setShowLetterModal(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 350);
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F] select-none flex flex-col justify-between">
      {/* Interactive Cursor Stardust Trail */}
      <CursorSparkles />

      {/* ========================================================
          LAYER 1: CINEMATIC ENVIRONMENT (Romantic Love Letter Still Life)
         ======================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={ASSETS.letter.stillLife}
          alt="Romantic Love Letter and Envelope"
          fill
          className="object-cover object-[center_35%] sm:object-center"
          sizes="100vw"
        />

        {/* Soft Warm Romantic Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#180B2E]/30 to-[#10051F]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10051F] via-transparent to-[#10051F]/65" />
      </div>

      {/* ========================================================
          LAYER 2 & 3: 3D ENVELOPE, CANDLELIGHT & DRIFTING ROSE PETALS
         ======================================================== */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <EnvelopeCanvas
          isOpen={isOpen}
          onOpen={handleOpenEnvelope}
          onHover={setIsHovered}
        />
      </div>

      {/* ========================================================
          LAYER 4: CINEMATIC INTERFACE & PARCHMENT LETTER MODAL
         ======================================================== */}
      {/* Top Header / Chapter Eyebrow */}
      <header className="relative z-20 pt-16 sm:pt-20 px-6 text-center pointer-events-none flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1.5 max-w-md mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180B2E]/80 backdrop-blur-md border border-[#F5C77E]/30 text-[#F5C77E] text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(245,199,126,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C77E]" />
            <span>Chapter 02 &bull; Words from the Heart</span>
            <Heart className="w-2.5 h-2.5 text-[#F28DBB] fill-current" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FFF1E6] drop-shadow-[0_2px_20px_rgba(217,91,203,0.4)] mt-1">
            The Love Letter
          </h2>
        </motion.div>
      </header>

      {/* Bottom Prompt when Envelope is Closed */}
      <footer className="relative z-20 pb-20 sm:pb-24 px-6 flex flex-col items-center text-center">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-2"
            >
              <button
                onClick={handleOpenEnvelope}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#45192F] via-[#66318D] to-[#45192F] border border-[#F5C77E]/60 text-[#FFF1E6] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_28px_rgba(217,91,203,0.4)] cursor-pointer"
              >
                <MailOpen className="w-4 h-4 text-[#F5C77E] group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-serif font-semibold tracking-wider text-glow-gold">
                  ✦ UNSEAL HER BIRTHDAY LETTER ✦
                </span>
              </button>
              <span className="text-[10px] sm:text-[11px] text-[#F8B7D0]/70 font-mono tracking-widest uppercase">
                Tap the ruby wax seal or button to open
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>

      {/* ========================================================
          READABLE PARCHMENT LETTER MODAL (HTML Typography)
         ======================================================== */}
      <AnimatePresence>
        {showLetterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
            onClick={handleCloseLetter}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[85dvh] overflow-y-auto my-auto p-5 sm:p-10 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8] to-[#F5ECE0] text-[#2D162A] shadow-[0_24px_60px_rgba(16,5,31,0.85)] border-2 border-[#D7A0A8]/60"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseLetter}
                className="absolute top-5 right-5 p-2 rounded-full text-[#45192F]/60 hover:text-[#45192F] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Close letter"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Wax Seal Crest on Top of Letter */}
              <div className="flex items-center justify-between border-b border-[#D7A0A8]/40 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#800D1E] text-[#F5C77E] flex items-center justify-center text-xs font-serif font-bold shadow-md">
                    {letterConfig.waxSealInitial}
                  </span>
                  <span className="text-xs uppercase tracking-widest font-mono text-[#800D1E] font-medium">
                    A Sealed Letter For Her
                  </span>
                </div>
                <span className="text-xs font-serif italic text-[#45192F]/70">
                  {letterConfig.date}
                </span>
              </div>

              {/* Salutation */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#45192F] mb-4">
                {letterConfig.salutation}
              </h3>

              {/* Letter Paragraphs */}
              <div className="flex flex-col gap-3.5 text-sm sm:text-base font-serif leading-relaxed text-[#3D1E36]">
                {letterConfig.paragraphs.map((p, idx) => {
                  const isHighlight = idx === letterConfig.paragraphs.length - 1;
                  return (
                    <p
                      key={idx}
                      className={
                        isHighlight
                          ? "font-bold text-base sm:text-lg text-[#800D1E] pt-2"
                          : ""
                      }
                    >
                      {p}
                    </p>
                  );
                })}
              </div>

              {/* Closing & Signature */}
              <div className="mt-6 pt-4 border-t border-[#D7A0A8]/40 flex flex-col items-end">
                <span className="text-xs font-serif italic text-[#45192F]/80">
                  {letterConfig.closing}
                </span>
                <span className="text-lg font-script text-[#800D1E] mt-1 font-bold">
                  {letterConfig.signature}
                </span>
              </div>

              {/* Letter Actions (Re-fold or Next World Gate) */}
              <div className="mt-8 pt-4 flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={handleCloseLetter}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#45192F]/30 text-[#45192F] text-xs font-serif hover:bg-[#45192F]/5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fold Letter</span>
                </button>

                {onNextChapter && (
                  <button
                    onClick={() => {
                      handleCloseLetter();
                      onNextChapter();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#45192F] hover:bg-[#66318D] text-[#FFF1E6] text-xs font-serif tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    <span>Proceed to World 03</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F5C77E]" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
