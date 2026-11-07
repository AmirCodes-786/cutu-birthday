"use client";

import React from "react";
import { motion } from "framer-motion";

interface WorldLoadingIndicatorProps {
  worldTitle: string;
  subtitle?: string;
}

export function WorldLoadingIndicator({
  worldTitle,
  subtitle = "Aligning celestial coordinates...",
}: WorldLoadingIndicatorProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#10051F]/90 backdrop-blur-md pointer-events-none select-none">
      <div className="flex flex-col items-center gap-4 text-center px-6">
        {/* Glowing Celestial Starlight Ring */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <div className="absolute inset-0 rounded-full border border-[#F5C77E]/20 animate-ping opacity-40" />
          <div className="absolute inset-1 rounded-full border-2 border-[#D95BCB]/30 border-t-[#F5C77E] animate-spin" />
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#F5C77E] to-[#F28DBB] shadow-[0_0_15px_rgba(245,199,126,0.9)]"
          />
        </div>

        {/* World Title & Subtitle */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm sm:text-base font-serif font-bold text-[#FFF1E6] tracking-wider drop-shadow-[0_2px_12px_rgba(217,91,203,0.5)]">
            {worldTitle}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#F8B7D0]/70">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
