"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Play, Pause, Sliders, Info, Music } from "lucide-react";
import { audioConfig } from "@/config/audioConfig";
import { motion, AnimatePresence } from "framer-motion";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudioFile, setHasAudioFile] = useState(true);
  const [volume, setVolume] = useState(audioConfig.defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumePanel, setShowVolumePanel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lazy audio initialization: zero network transfer until user explicitly plays
  const initAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    if (typeof window === "undefined") return null;

    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;

    const handleCanPlay = () => setHasAudioFile(true);
    const handleError = () => {
      if (audioConfig.fallbackTrackSrc && audio.src.includes(audioConfig.trackSrc)) {
        audio.src = audioConfig.fallbackTrackSrc;
        audio.load();
      } else {
        setHasAudioFile(false);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    audio.src = audioConfig.trackSrc;
    audioRef.current = audio;
    return audio;
  }, [isMuted, volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    const audio = initAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasAudioFile(true);
        })
        .catch((err) => {
          console.warn("Audio play blocked by browser policy:", err);
          setIsPlaying(false);
          setShowVolumePanel(true);
        });
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      const restored = volume || 0.5;
      if (audioRef.current) audioRef.current.volume = restored;
      setIsMuted(false);
    } else {
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed top-3 left-3 sm:top-5 sm:left-5 z-40 flex items-center gap-2">
      {/* ========================================================
          MOBILE ONLY: ULTRA-COMPACT GLOWING CIRCULAR ICON BUTTON
         ======================================================== */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onClick={togglePlay}
        className="flex sm:hidden relative items-center justify-center w-9 h-9 rounded-full bg-[#180B2E]/90 backdrop-blur-md border border-[#F5C77E]/40 hover:border-[#F5C77E]/80 shadow-[0_4px_16px_rgba(24,11,46,0.7)] cursor-pointer select-none shrink-0"
        aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
      >
        {/* Subtle ambient pulse ring when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-[#D95BCB] animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Center Glowing Disc with Music/Pause Icon */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#66318D] to-[#D95BCB] text-[#FFF1E6] shadow-[0_0_12px_rgba(217,91,203,0.7)]">
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Music className="w-3.5 h-3.5" />
          )}
        </div>
      </motion.button>

      {/* ========================================================
          DESKTOP ONLY: FULL BRANDED PILL WITH EQUALIZER & SLIDERS
         ======================================================== */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Primary Pill Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={togglePlay}
          className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#180B2E]/90 backdrop-blur-md border border-[#F5C77E]/30 hover:border-[#F5C77E]/70 shadow-[0_4px_20px_rgba(24,11,46,0.6)] transition-all cursor-pointer select-none"
          aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
        >
          {/* Play/Pause Icon with Glow */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-[#66318D] to-[#D95BCB] text-[#FFF1E6] shadow-[0_0_10px_rgba(217,91,203,0.5)] shrink-0">
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current translate-x-[0.5px]" />
            )}
          </div>

          {/* Desktop Track Title & Subtitle */}
          <div className="flex flex-col items-start pr-1">
            <span className="text-[11px] font-serif font-semibold text-[#FFF1E6] tracking-wider group-hover:text-[#F5C77E] transition-colors leading-tight">
              {audioConfig.trackTitle}
            </span>
            <span className="text-[9px] font-mono text-[#F8B7D0]/70 uppercase tracking-widest leading-none">
              {isPlaying ? "Playing atmosphere" : "Click to play soundtrack"}
            </span>
          </div>

          {/* Equalizer Visualizer */}
          <div className="flex items-end gap-[2px] h-3 px-1">
            {[0.3, 0.7, 1.0, 0.5, 0.8].map((factor, i) => (
              <motion.span
                key={i}
                className="w-[2px] rounded-full bg-[#F5C77E]"
                animate={{
                  height: isPlaying ? ["20%", `${factor * 100}%`, "20%"] : "20%",
                }}
                transition={{
                  duration: 0.8 + i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.button>

        {/* Volume Controls Toggle Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={() => setShowVolumePanel((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-[#180B2E]/90 backdrop-blur-md border border-[#F5C77E]/30 hover:border-[#F5C77E]/60 text-[#FFF1E6] flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0"
          aria-label="Audio settings"
        >
          <Sliders className="w-3.5 h-3.5 text-[#F5C77E]" />
        </motion.button>
      </div>

      {/* Floating Volume Slider & Help Panel */}
      <AnimatePresence>
        {showVolumePanel && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 p-3.5 rounded-2xl bg-[#180B2E]/95 backdrop-blur-xl border border-[#F5C77E]/30 shadow-[0_12px_36px_rgba(16,5,31,0.9)] flex flex-col gap-3 min-w-[210px]"
          >
            {/* Volume Control */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleMute}
                className="text-[#F5C77E] hover:text-[#FFF1E6] transition-colors cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#F28DBB]" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#F5C77E] h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-[#F8B7D0] w-7 text-right">
                {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Track Info Status */}
            <div className="pt-2 border-t border-[#F5C77E]/20 flex items-start gap-1.5 text-[10px] text-[#F8B7D0]/80 font-sans leading-snug">
              <Info className="w-3.5 h-3.5 text-[#F5C77E] flex-shrink-0 mt-[1px]" />
              {hasAudioFile ? (
                <span>Soundtrack active: {audioConfig.trackTitle}</span>
              ) : (
                <span>
                  Soundtrack ready. Click play to listen.
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
