"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ASSETS } from "@/config/assetsConfig";

interface SceneTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
}

export function SceneTransition({
  isTransitioning,
  onTransitionComplete,
}: SceneTransitionProps) {
  return (
    <AnimatePresence onExitComplete={onTransitionComplete}>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#10051F]"
        >
          {/* Subtle reference texture layer with low opacity */}
          <div className="absolute inset-0 opacity-25 mix-blend-screen scale-105">
            <Image
              src={ASSETS.transitions.moonlitMeadow}
              alt="Cinematic Transition Meadow"
              fill
              className="object-cover"
            />
          </div>

          {/* Starlight cosmic glow aura in center */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.4, 1.8],
              opacity: [0, 0.9, 0],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-96 h-96 rounded-full bg-radial from-[#F5C77E]/40 via-[#D95BCB]/20 to-transparent blur-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

