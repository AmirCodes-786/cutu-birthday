"use client";

import React, { useState } from "react";
import { siteConfig, ChapterId } from "@/config/siteConfig";
import { ChevronLeft, ChevronRight, Compass, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChapterNavProps {
  currentChapter: ChapterId;
  onSelectChapter: (id: ChapterId) => void;
  unlockedChapters?: ChapterId[]; // Progressive unlock or all available
}

export function ChapterNav({
  currentChapter,
  onSelectChapter,
  unlockedChapters,
}: ChapterNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const chapters = siteConfig.chapters;
  const currentIndex = chapters.findIndex((c) => c.id === currentChapter);
  const activeChapter = chapters[currentIndex] || chapters[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectChapter(chapters[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      onSelectChapter(chapters[currentIndex + 1].id);
    }
  };

  return (
    <nav
      aria-label="Universe Navigation"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#180B2E]/75 backdrop-blur-md border border-[#D7A0A8]/25 shadow-[0_8px_32px_rgba(16,5,31,0.6)]"
    >
      {/* Previous Chapter */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        aria-label="Previous world"
        className={`p-2 rounded-full transition-all duration-300 ${
          currentIndex === 0
            ? "text-white/20 cursor-not-allowed"
            : "text-[#F5C77E] hover:bg-[#392057]/60 active:scale-95"
        }`}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Center status & constellation drawer trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#392057]/40 transition-colors group"
      >
        <span className="font-mono text-xs text-[#D95BCB] tracking-wider">
          {activeChapter.number}
        </span>
        <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#F5C77E]/50" />
        <span className="text-xs sm:text-sm font-medium tracking-wide text-[#FFF1E6] group-hover:text-[#F5C77E] transition-colors font-serif">
          {activeChapter.title}
        </span>
        <Compass className="w-3.5 h-3.5 text-[#F5C77E]/70 group-hover:rotate-45 transition-transform duration-300 ml-1" />
      </button>

      {/* Next Chapter */}
      <button
        onClick={handleNext}
        disabled={currentIndex === chapters.length - 1}
        aria-label="Next world"
        className={`p-2 rounded-full transition-all duration-300 ${
          currentIndex === chapters.length - 1
            ? "text-white/20 cursor-not-allowed"
            : "text-[#F5C77E] hover:bg-[#392057]/60 active:scale-95"
        }`}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Expandable constellation menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click dismiss */}
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-[#180B2E]/95 border border-[#D7A0A8]/30 shadow-[0_16px_40px_rgba(16,5,31,0.85)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#392057]/80">
                <span className="text-xs uppercase tracking-widest text-[#F5C77E] font-medium">
                  Celestial Compass
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {chapters.map((ch) => {
                  const isActive = ch.id === currentChapter;
                  const isLocked =
                    unlockedChapters && !unlockedChapters.includes(ch.id);

                  return (
                    <button
                      key={ch.id}
                      disabled={isLocked}
                      onClick={() => {
                        onSelectChapter(ch.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#392057] to-[#66318D]/50 border border-[#D95BCB]/40 text-[#FFF1E6]"
                          : isLocked
                          ? "opacity-35 cursor-not-allowed text-white/40"
                          : "hover:bg-[#392057]/40 text-[#FFF1E6]/80 hover:text-[#FFF1E6]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-xs ${
                            isActive ? "text-[#F5C77E]" : "text-[#D95BCB]/70"
                          }`}
                        >
                          {ch.number}
                        </span>
                        <div>
                          <div className="text-xs sm:text-sm font-serif font-medium">
                            {ch.title}
                          </div>
                          <div className="text-[10px] text-white/50 tracking-wide">
                            {ch.subtitle}
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#F5C77E] shadow-[0_0_8px_#F5C77E]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

