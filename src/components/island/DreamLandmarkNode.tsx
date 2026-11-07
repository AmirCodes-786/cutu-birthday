"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LandmarkExperience } from "@/config/dreamsConfig";

interface DreamLandmarkNodeProps {
  landmark: LandmarkExperience;
  isDiscovered: boolean;
  isSelected: boolean;
  onSelect: (landmark: LandmarkExperience) => void;
}

interface JewelTheme {
  primary: string;
  secondary: string;
  deep: string;
  glow: string;
  radarColor: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  shadow: string;
}

const JEWEL_THEMES: Record<string, JewelTheme> = {
  // Horizon 01: The Dream Gate — Imperial Electric Ruby
  gate: {
    primary: "#FF0055",
    secondary: "#FF6699",
    deep: "#6B0024",
    glow: "rgba(255, 0, 85, 0.95)",
    radarColor: "#FF0055",
    badgeBg: "#2B000E",
    badgeText: "#FFE4EC",
    gradient: "radial-gradient(circle at 35% 28%, #FFFFFF 0%, #FF5288 28%, #FF0055 65%, #6B0024 100%)",
    shadow: "0 0 24px #FF0055, 0 0 45px rgba(255, 0, 85, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.8)",
  },
  // Horizon 02: Little Dream Cottage — Honey Amber Citrine Gold
  cottage: {
    primary: "#FFB300",
    secondary: "#FFE082",
    deep: "#664200",
    glow: "rgba(255, 179, 0, 0.95)",
    radarColor: "#FFB300",
    badgeBg: "#2B1A00",
    badgeText: "#FFF8E1",
    gradient: "radial-gradient(circle at 35% 28%, #FFFFFF 0%, #FFD54F 28%, #FFB300 65%, #664200 100%)",
    shadow: "0 0 24px #FFB300, 0 0 45px rgba(255, 179, 0, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.8)",
  },
  // Horizon 03: The Wishing Tree — Radiant Sakura Fuchsia / Neon Pink
  tree: {
    primary: "#FF1493",
    secondary: "#FF80BF",
    deep: "#660038",
    glow: "rgba(255, 20, 147, 0.95)",
    radarColor: "#FF1493",
    badgeBg: "#2A0017",
    badgeText: "#FFE4F3",
    gradient: "radial-gradient(circle at 35% 28%, #FFFFFF 0%, #FF69B4 28%, #FF1493 65%, #660038 100%)",
    shadow: "0 0 24px #FF1493, 0 0 45px rgba(255, 20, 147, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.8)",
  },
  // Horizon 04: Lake of Dreams — Ultra-Vivid Electric Cyan / Aqua Diamond
  lake: {
    primary: "#00E5FF",
    secondary: "#A7F3D0",
    deep: "#004D66",
    glow: "rgba(0, 229, 255, 0.95)",
    radarColor: "#00E5FF",
    badgeBg: "#001F29",
    badgeText: "#E0F7FA",
    gradient: "radial-gradient(circle at 35% 28%, #FFFFFF 0%, #80F3FF 28%, #00E5FF 65%, #004D66 100%)",
    shadow: "0 0 24px #00E5FF, 0 0 45px rgba(0, 229, 255, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.8)",
  },
  // Horizon 05: The Star Observatory — Cosmic Celestial Amethyst / Neon Purple
  observatory: {
    primary: "#B026FF",
    secondary: "#E099FF",
    deep: "#47007A",
    glow: "rgba(176, 38, 255, 0.95)",
    radarColor: "#B026FF",
    badgeBg: "#1F0036",
    badgeText: "#F3E8FF",
    gradient: "radial-gradient(circle at 35% 28%, #FFFFFF 0%, #D480FF 28%, #B026FF 65%, #47007A 100%)",
    shadow: "0 0 24px #B026FF, 0 0 45px rgba(176, 38, 255, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.8)",
  },
  // Horizon 06: The Secret Horizon — Twilight Solar Tangerine / Sunset Flare
  horizon: {
    primary: "#FF5722",
    secondary: "#FFAB91",
    deep: "#6E1B00",
    glow: "rgba(255, 87, 34, 0.95)",
    radarColor: "#FF5722",
    badgeBg: "#2B0B00",
    badgeText: "#FBE9E7",
    gradient: "radial-gradient(circle at 35% 28%, #FFFFFF 0%, #FF8A65 28%, #FF5722 65%, #6E1B00 100%)",
    shadow: "0 0 24px #FF5722, 0 0 45px rgba(255, 87, 34, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.8)",
  },
};

export function DreamLandmarkNode({
  landmark,
  isDiscovered,
  isSelected,
  onSelect,
}: DreamLandmarkNodeProps) {
  const [hovered, setHovered] = useState(false);
  const isActive = hovered || isSelected;

  const jewel = JEWEL_THEMES[landmark.theme] || JEWEL_THEMES.gate;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
      style={{ left: `${landmark.position.x}%`, top: `${landmark.position.y}%` }}
    >
      {/* Floating Glassmorphic Hover / Selected Tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -52, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-30"
          >
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl backdrop-blur-2xl border text-xs font-serif tracking-wide"
              style={{
                backgroundColor: "rgba(16, 5, 31, 0.96)",
                borderColor: jewel.primary,
                color: "#FFF1E6",
                boxShadow: `0 0 25px ${jewel.glow}, 0 10px 30px rgba(0,0,0,0.9)`,
              }}
            >
              <span className="text-base select-none">{landmark.emoji}</span>
              <div className="flex flex-col text-left">
                <span
                  className="text-[9px] font-mono uppercase tracking-wider font-bold"
                  style={{ color: jewel.secondary }}
                >
                  Horizon {landmark.number} &bull; {landmark.subtitle}
                </span>
                <span className="font-semibold text-xs text-[#FFF8F0] drop-shadow-sm">
                  {landmark.name}
                </span>
              </div>
            </div>
            {/* Tooltip Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2.5 h-2.5 rotate-45"
              style={{
                backgroundColor: "rgba(16, 5, 31, 0.96)",
                borderRight: `1.5px solid ${jewel.primary}`,
                borderBottom: `1.5px solid ${jewel.primary}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main High-Contrast Radiant Jewel Beacon */}
      <button
        onClick={() => onSelect(landmark)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Explore Horizon ${landmark.number}: ${landmark.name}`}
        className="relative group p-2 focus:outline-none cursor-pointer select-none flex items-center justify-center"
      >
        {/* Layer 1: Continuous Sonar Radar Ping Wave in Vivid Jewel Color */}
        <span
          className="absolute inset-0 rounded-full border-2 opacity-90 animate-ping pointer-events-none"
          style={{
            borderColor: jewel.radarColor,
            animationDuration: "2.4s",
          }}
        />

        {/* Layer 2: Radiant Jewel Color Ambient Bloom Halo */}
        <motion.div
          animate={{
            scale: isActive ? [1.3, 1.6, 1.3] : [1.05, 1.35, 1.05],
            opacity: isActive ? [0.9, 1.0, 0.9] : [0.65, 0.85, 0.65],
          }}
          transition={{
            duration: 2.0 + (parseInt(landmark.number, 10) % 3) * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-[-4px] rounded-full blur-md pointer-events-none"
          style={{ backgroundColor: jewel.primary }}
        />

        {/* Layer 3: Rotating Celestial Stardust Orbit Ring with Dual Diamonds */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 11 + (parseInt(landmark.number, 10) % 4) * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -inset-2 rounded-full border border-dashed pointer-events-none"
          style={{ borderColor: `${jewel.secondary}CC` }}
        >
          {/* Top Orbiting Diamond */}
          <span
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 shadow-[0_0_8px_#FFF]"
            style={{ backgroundColor: "#FFFFFF" }}
          />
          {/* Bottom Orbiting Diamond */}
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 shadow-[0_0_8px_#FFF]"
            style={{ backgroundColor: jewel.secondary }}
          />
        </motion.div>

        {/* Layer 4: Shimmering 4-Point Starlight Flare Rays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="w-12 h-[2px] opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              background: `linear-gradient(90deg, transparent, ${jewel.secondary}, ${jewel.primary}, transparent)`,
            }}
          />
          <span
            className="w-[2px] h-12 opacity-80 group-hover:opacity-100 transition-opacity absolute"
            style={{
              background: `linear-gradient(180deg, transparent, ${jewel.secondary}, ${jewel.primary}, transparent)`,
            }}
          />
        </div>

        {/* Layer 5: Luminous 3D Gemstone Crystal Orb (Ultra Eye-Catching) */}
        <motion.div
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl overflow-visible"
          style={{
            background: jewel.gradient,
            border: "2.5px solid #FFFFFF",
            boxShadow: isActive
              ? `0 0 28px ${jewel.primary}, 0 0 52px ${jewel.glow}, inset 0 0 12px rgba(255, 255, 255, 0.95)`
              : jewel.shadow,
          }}
        >
          {/* 3D Glass Specular Curved Gloss Highlight */}
          <div className="absolute top-0.5 left-1.5 right-1.5 h-3 rounded-full bg-gradient-to-b from-white/85 via-white/40 to-transparent pointer-events-none" />

          {/* Theme Emoji Glyph with Crisp 3D Drop Shadow */}
          <span className="text-lg sm:text-xl select-none transform group-hover:scale-115 transition-transform filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {landmark.emoji}
          </span>

          {/* Golden Horizon Number Badge (Embossed & High-Contrast) */}
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full border shadow-md flex items-center justify-center text-[8.5px] font-mono font-bold leading-none tracking-tight"
            style={{
              backgroundColor: jewel.badgeBg,
              borderColor: jewel.primary,
              color: jewel.badgeText,
              boxShadow: `0 0 10px ${jewel.glow}`,
            }}
          >
            {landmark.number}
          </span>
        </motion.div>
      </button>
    </div>
  );
}
