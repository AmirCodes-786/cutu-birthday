"use client";

import React, { useState, useEffect } from "react";
import { ChapterId } from "@/config/siteConfig";
import { SecretPortalScene } from "@/scenes/SecretPortal/SecretPortalScene";
import { LoveLetterScene } from "@/scenes/LoveLetter/LoveLetterScene";
import { MemoryGalaxyScene } from "@/scenes/MemoryGalaxy/MemoryGalaxyScene";
import { EnchantedGardenScene } from "@/scenes/EnchantedGarden/EnchantedGardenScene";
import { DreamIslandScene } from "@/scenes/DreamIsland/DreamIslandScene";
import { GrandFinaleScene } from "@/scenes/GrandFinale/GrandFinaleScene";
import { ChapterNav } from "@/components/navigation/ChapterNav";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { SceneTransition } from "@/components/transitions/SceneTransition";
import { CinematicPreloader } from "@/components/ui/CinematicPreloader";
import { assetLoader } from "@/services/loadingManager";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isUniverseReady, setIsUniverseReady] = useState(false);
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

  useEffect(() => {
    const handleUnload = () => {
      assetLoader.cleanup();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      assetLoader.cleanup();
    };
  }, []);

  const handlePortalEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setUnlockedChapters((prev) =>
        prev.includes("letter") ? prev : [...prev, "letter"]
      );
      setCurrentChapter("letter");
      setIsTransitioning(false);
    }, 450);
  };

  const handleSelectChapter = (id: ChapterId) => {
    if (id === currentChapter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setUnlockedChapters((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setCurrentChapter(id);
      setIsTransitioning(false);
    }, 320);
  };

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-[#10051F]">
      {/* Real Full-Screen Cinematic Preloader with Weighted Browser Asset Tracking */}
      {!isUniverseReady && (
        <CinematicPreloader onLoaded={() => setIsUniverseReady(true)} />
      )}

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
