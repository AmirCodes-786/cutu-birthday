"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReasonItem } from "@/config/reasonsConfig";

interface GardenBlossomNodeProps {
  reason: ReasonItem;
  xPercent: number; // Percentage X on garden artwork (0..100)
  yPercent: number; // Percentage Y on garden artwork (0..100)
  isDiscovered: boolean;
  isSelected: boolean;
  onSelect: (reason: ReasonItem) => void;
}

export function GardenBlossomNode({
  reason,
  xPercent,
  yPercent,
  isDiscovered,
  isSelected,
  onSelect,
}: GardenBlossomNodeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    >
      {/* Floating Hover Tooltip Badge */}
      <AnimatePresence>
        {(hovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: -44, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-30"
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl border shadow-[0_6px_25px_rgba(0,0,0,0.65)] text-xs font-serif tracking-wide"
              style={{
                backgroundColor: "rgba(24, 11, 46, 0.95)",
                borderColor: `${reason.flowerColor}90`,
                color: "#FFF1E6",
                boxShadow: `0 0 20px ${reason.flowerColor}50`,
              }}
            >
              <span className="text-sm">{reason.emoji}</span>
              <span>
                <strong className="text-[#F5C77E]">Blossom {reason.id.toString().padStart(2, "0")}</strong> &bull; {reason.flowerType}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Starlight Blossom Button */}
      <button
        onClick={() => onSelect(reason)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Discover blossom ${reason.id}: ${reason.title}`}
        className="relative group p-2.5 focus:outline-none cursor-pointer"
      >
        {/* 1. Outer Pulsing Starlight Aura */}
        <motion.span
          animate={{
            scale: hovered || isSelected ? [1.25, 1.55, 1.25] : [1.0, 1.25, 1.0],
            opacity: hovered || isSelected ? [0.75, 0.95, 0.75] : isDiscovered ? [0.4, 0.65, 0.4] : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2.0 + (reason.id % 3) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full blur-md pointer-events-none"
          style={{
            backgroundColor: hovered || isSelected ? "#F5C77E" : reason.flowerColor,
          }}
        />

        {/* 2. Rotating Celestial Stardust Petal Ring */}
        <motion.span
          animate={{ rotate: 360 }}
          transition={{
            duration: 12 + (reason.id % 4) * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -inset-1 rounded-full border border-dashed pointer-events-none"
          style={{
            borderColor: hovered || isSelected ? "rgba(245, 199, 126, 0.7)" : `${reason.flowerColor}50`,
          }}
        />

        {/* 3. The Core Blossom Jewel Node */}
        <motion.div
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.92 }}
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isSelected
              ? "bg-gradient-to-br from-[#F5C77E] to-[#E5A855] text-[#180B2E] ring-2 ring-[#FFF1E6] shadow-[0_0_24px_rgba(245,199,126,0.95)]"
              : isDiscovered
              ? "bg-[#25123D]/95 text-[#FFF1E6] border border-[#F5C77E]/70 shadow-[0_0_16px_rgba(242,141,187,0.6)]"
              : "bg-[#180B2E]/90 text-[#FFF1E6] border border-white/35 hover:border-[#F5C77E]/90 shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          }`}
          style={{
            boxShadow: hovered
              ? `0 0 24px ${reason.flowerColor}, 0 0 40px ${reason.flowerColor}90`
              : isDiscovered
              ? `0 0 16px ${reason.flowerColor}70`
              : undefined,
          }}
        >
          {/* Flower Emoji Icon */}
          <span className="text-base sm:text-lg select-none transform group-hover:scale-110 transition-transform">
            {reason.emoji}
          </span>

          {/* Tiny Golden Starlight Pin on top corner */}
          <span
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border border-white/80 shadow-md animate-pulse flex items-center justify-center text-[8px] font-mono font-bold text-[#180B2E]"
            style={{ backgroundColor: isSelected ? "#FFF1E6" : reason.flowerColor }}
          >
            {reason.id}
          </span>
        </motion.div>
      </button>
    </div>
  );
}
