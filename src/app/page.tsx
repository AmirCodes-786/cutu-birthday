"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ChapterId } from "@/config/siteConfig";
import { ASSETS } from "@/config/assetsConfig";
import { memoriesConfig } from "@/config/memoriesConfig";
import { SecretPortalScene } from "@/scenes/SecretPortal/SecretPortalScene";
import { ChapterNav } from "@/components/navigation/ChapterNav";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { SceneTransition } from "@/components/transitions/SceneTransition";
import { WorldLoadingIndicator } from "@/components/ui/WorldLoadingIndicator";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic scene imports: only World 01 is bundled into the initial page load.
// Worlds 02-06 and their respective 3D assets/materials are loaded on-demand when visited.
const LoveLetterScene = dynamic(
  () =>
    import("@/scenes/LoveLetter/LoveLetterScene").then(
      (mod) => mod.LoveLetterScene
    ),
  {
    ssr: false,
    loading: () => (
      <WorldLoadingIndicator
        worldTitle="Chapter 02 · The Love Letter"
        subtitle="Unfolding antique parchment..."
      />
    ),
  }
);

const MemoryGalaxyScene = dynamic(
  () =>
    import("@/scenes/MemoryGalaxy/MemoryGalaxyScene").then(
      (mod) => mod.MemoryGalaxyScene
    ),
  {
    ssr: false,
    loading: () => (
      <WorldLoadingIndicator
        worldTitle="Chapter 03 · The Memory Galaxy"
        subtitle="Aligning celestial constellations..."
      />
    ),
  }
);

const EnchantedGardenScene = dynamic(
  () =>
    import("@/scenes/EnchantedGarden/EnchantedGardenScene").then(
      (mod) => mod.EnchantedGardenScene
    ),
  {
    ssr: false,
    loading: () => (
      <WorldLoadingIndicator
        worldTitle="Chapter 04 · The Enchanted Garden"
        subtitle="Awakening midnight blossoms..."
      />
    ),
  }
);

const DreamIslandScene = dynamic(
  () =>
    import("@/scenes/DreamIsland/DreamIslandScene").then(
      (mod) => mod.DreamIslandScene
    ),
  {
    ssr: false,
    loading: () => (
      <WorldLoadingIndicator
        worldTitle="Chapter 05 · The Dream Island"
        subtitle="Approaching twilight sanctuary..."
      />
    ),
  }
);

const GrandFinaleScene = dynamic(
  () =>
    import("@/scenes/GrandFinale/GrandFinaleScene").then(
      (mod) => mod.GrandFinaleScene
    ),
  {
    ssr: false,
    loading: () => (
      <WorldLoadingIndicator
        worldTitle="Chapter 06 · The Grand Finale"
        subtitle="Illuminating birthday celebration..."
      />
    ),
  }
);

export default function Home() {
  const [currentChapter, setCurrentChapter] = useState<ChapterId>("portal");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [unlockedChapters, setUnlockedChapters] = useState<ChapterId[]>([
    "portal",
    "letter",
    "galaxy",
    "garden",
    "island",
    "finale",
  ]);

  // Intelligent Background Asset Preloader:
  // Pre-caches upcoming world artworks & memory photos during idle browser time
  // so that world navigation and 3D constellation frames load instantaneously!
  useEffect(() => {
    if (typeof window === "undefined") return;

    const assetsToPreload = [
      ASSETS.portal.heartPortalRef,
      ASSETS.portal.cosmicNebula,
      ASSETS.letter.stillLife,
      ASSETS.galaxy.cosmicAtmosphere,
      ASSETS.garden.roseGazebo,
      ASSETS.island.floatingIsland,
      ASSETS.finale.birthdayCelebration,
      ...memoriesConfig.memories.map((m) => m.image),
    ];

    const preload = () => {
      assetsToPreload.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preload);
    } else {
      setTimeout(preload, 800);
    }
  }, []);

  const handlePortalEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setUnlockedChapters((prev) =>
        prev.includes("letter") ? prev : [...prev, "letter"]
      );
      setCurrentChapter("letter");
      setIsTransitioning(false);
    }, 1200);
  };

  const handleSelectChapter = (id: ChapterId) => {
    if (id === currentChapter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setUnlockedChapters((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setCurrentChapter(id);
      setIsTransitioning(false);
    }, 700);
  };

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F]">
      {/* Audio Atmosphere Player */}
      <AudioPlayer />

      {/* Chapter Views — Unmounts inactive scenes automatically on transition */}
      <AnimatePresence mode="wait">
        {currentChapter === "portal" && (
          <motion.div
            key="portal-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <SecretPortalScene onEnterUniverse={handlePortalEnter} />
          </motion.div>
        )}

        {currentChapter === "letter" && (
          <motion.div
            key="letter-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <LoveLetterScene
              onNextChapter={() => handleSelectChapter("galaxy")}
              onPrevChapter={() => handleSelectChapter("portal")}
            />
          </motion.div>
        )}

        {currentChapter === "galaxy" && (
          <motion.div
            key="galaxy-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <MemoryGalaxyScene
              onNextChapter={() => handleSelectChapter("garden")}
              onPrevChapter={() => handleSelectChapter("letter")}
            />
          </motion.div>
        )}

        {currentChapter === "garden" && (
          <motion.div
            key="garden-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <EnchantedGardenScene
              onNextChapter={() => handleSelectChapter("island")}
              onPrevChapter={() => handleSelectChapter("galaxy")}
            />
          </motion.div>
        )}

        {currentChapter === "island" && (
          <motion.div
            key="island-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <DreamIslandScene
              onNextChapter={() => handleSelectChapter("finale")}
              onPrevChapter={() => handleSelectChapter("garden")}
            />
          </motion.div>
        )}

        {currentChapter === "finale" && (
          <motion.div
            key="finale-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <GrandFinaleScene
              onPrevChapter={() => handleSelectChapter("island")}
              onRestartJourney={() => handleSelectChapter("portal")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Celestial Chapter Navigation */}
      <ChapterNav
        currentChapter={currentChapter}
        onSelectChapter={handleSelectChapter}
        unlockedChapters={unlockedChapters}
      />

      {/* Cinematic Transition Layer */}
      <SceneTransition isTransitioning={isTransitioning} />
    </main>
  );
}
