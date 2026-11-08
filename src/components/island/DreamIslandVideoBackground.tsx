"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ASSETS } from "@/config/assetsConfig";
import { assetLoader } from "@/services/loadingManager";

export interface VideoBounds {
  width: number;
  height: number;
  top: number;
  left: number;
  containerWidth: number;
  containerHeight: number;
  isPannable: boolean;
  minPanX: number;
  maxPanX: number;
}

interface DreamIslandVideoBackgroundProps {
  onBoundsChange?: (bounds: VideoBounds) => void;
  children?: (bounds: VideoBounds) => React.ReactNode;
  isPaused?: boolean;
  focusedLandmarkX?: number; // Target landmark X percentage (0-100) to auto-pan on mobile
  onUserPan?: () => void;
}

export function DreamIslandVideoBackground({
  onBoundsChange,
  children,
  isPaused = false,
  focusedLandmarkX,
  onUserPan,
}: DreamIslandVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [bounds, setBounds] = useState<VideoBounds>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    containerWidth: 0,
    containerHeight: 0,
    isPannable: false,
    minPanX: 0,
    maxPanX: 0,
  });

  const motionPanX = useMotionValue(0);

  // Calculate exact rendered video dimensions matching 16:9 ratio
  const updateVideoBounds = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    if (w === 0 || h === 0) return;

    const videoAspect = 16 / 9; // 1280 x 720
    const containerAspect = w / h;

    let renderWidth = w;
    let renderHeight = h;
    let top = 0;
    let isPannable = false;
    let minPanX = 0;
    let maxPanX = 0;
    let initialPanX = 0;

    if (containerAspect >= videoAspect) {
      // Desktop / Ultrawide Viewports (whole landscape fits on screen)
      renderWidth = w;
      renderHeight = w / videoAspect;
      top = (h - renderHeight) / 2;
      isPannable = false;
      minPanX = 0;
      maxPanX = 0;
      initialPanX = 0;
    } else {
      // Mobile Portrait / Tablet Viewports (pannable panoramic landscape)
      renderHeight = h;
      renderWidth = h * videoAspect;
      top = 0;
      isPannable = true;
      minPanX = w - renderWidth; // e.g. 390 - 1500 = -1110
      maxPanX = 0;
      // Start centered on the sanctuary (waterfalls and dream gate)
      initialPanX = (w - renderWidth) / 2;
    }

    const newBounds: VideoBounds = {
      width: Math.round(renderWidth),
      height: Math.round(renderHeight),
      top: Math.round(top),
      left: Math.round(initialPanX),
      containerWidth: w,
      containerHeight: h,
      isPannable,
      minPanX: Math.round(minPanX),
      maxPanX: Math.round(maxPanX),
    };

    setBounds(newBounds);
    motionPanX.set(Math.round(initialPanX));
    if (onBoundsChange) onBoundsChange(newBounds);
  }, [onBoundsChange, motionPanX]);

  useEffect(() => {
    updateVideoBounds();
    window.addEventListener("resize", updateVideoBounds, { passive: true });
    return () => window.removeEventListener("resize", updateVideoBounds);
  }, [updateVideoBounds]);

  // Smooth Auto-Pan when a Landmark is Selected on Mobile
  useEffect(() => {
    if (
      typeof focusedLandmarkX === "number" &&
      bounds.isPannable &&
      bounds.width > 0 &&
      bounds.containerWidth > 0
    ) {
      const targetPixelX = (focusedLandmarkX / 100) * bounds.width;
      const idealPanX = bounds.containerWidth / 2 - targetPixelX;
      const clampedPanX = Math.max(bounds.minPanX, Math.min(0, idealPanX));

      animate(motionPanX, Math.round(clampedPanX), {
        type: "spring",
        stiffness: 220,
        damping: 26,
      });
    }
  }, [focusedLandmarkX, bounds.isPannable, bounds.width, bounds.containerWidth, bounds.minPanX, motionPanX]);

  // Video element ref callback & robust playback controller
  const startVideoPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");

    if (!isPaused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch((err) => {
            console.log("Mobile autoplay waiting for user tap:", err);
          });
      }
    } else {
      video.pause();
    }
  }, [isPaused]);

  // Ref callback ensures properties are bound the exact moment node mounts
  const setVideoNode = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node) {
        node.defaultMuted = true;
        node.muted = true;
        node.volume = 0;
        node.playsInline = true;
        node.setAttribute("muted", "");
        node.setAttribute("playsinline", "");
        node.setAttribute("webkit-playsinline", "true");
        node.setAttribute("x5-playsinline", "true");

        // Force mobile browsers to immediately buffer stream metadata
        node.load();
        startVideoPlayback();
      }
    },
    [startVideoPlayback]
  );

  // Re-evaluate playback whenever isPaused changes or bounds initialize
  useEffect(() => {
    startVideoPlayback();
  }, [startVideoPlayback, bounds.width]);

  // Universal first-touch unlock (unblocks mobile Safari and Chrome strict policies)
  useEffect(() => {
    const handleFirstTouch = () => {
      const video = videoRef.current;
      if (video && !isPaused) {
        video.defaultMuted = true;
        video.muted = true;
        video.volume = 0;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "true");

        if (video.paused || video.readyState < 2) {
          video
            .play()
            .then(() => setVideoLoaded(true))
            .catch(() => {});
        }
      }
    };

    window.addEventListener("pointerdown", handleFirstTouch, { passive: true });
    window.addEventListener("touchstart", handleFirstTouch, { passive: true });
    window.addEventListener("touchend", handleFirstTouch, { passive: true });
    window.addEventListener("click", handleFirstTouch, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstTouch);
      window.removeEventListener("touchstart", handleFirstTouch);
      window.removeEventListener("touchend", handleFirstTouch);
      window.removeEventListener("click", handleFirstTouch);
    };
  }, [isPaused]);

  // Handle Tab Visibility Change & Reduced Motion
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibility = () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (document.hidden || isPaused || prefersReducedMotion) {
        if (!video.paused) video.pause();
      } else {
        startVideoPlayback();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isPaused, startVideoPlayback]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#10051F] select-none z-0"
    >
      {/* Pannable Unified Video & Hotspots Stage */}
      {bounds.width > 0 && (
        <motion.div
          drag={bounds.isPannable ? "x" : false}
          dragConstraints={{
            left: bounds.minPanX,
            right: bounds.maxPanX,
          }}
          dragElastic={0.12}
          onDragStart={() => {
            setIsDragging(true);
            if (onUserPan) onUserPan();
            startVideoPlayback();
          }}
          onDragEnd={() => setIsDragging(false)}
          style={{
            x: motionPanX,
            width: bounds.width,
            height: bounds.height,
            top: bounds.top,
          }}
          className={`absolute left-0 will-change-transform ${
            bounds.isPannable
              ? isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : "cursor-default"
          }`}
        >
          {/* Instant Lightweight WebP Backdrop Poster */}
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 pointer-events-none z-0 ${
              videoLoaded ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundImage: `url('${ASSETS.island.floatingIsland}')`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          />

          {/* Single High-Performance Looping Video Player (Uses Pre-downloaded Blob Stream) */}
          <video
            ref={setVideoNode}
            src={assetLoader.getVideoBlobUrl(ASSETS.island.video) || ASSETS.island.video}
            poster={ASSETS.island.floatingIsland}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            onCanPlay={() => {
              startVideoPlayback();
            }}
            onLoadedData={() => {
              setVideoLoaded(true);
              startVideoPlayback();
              updateVideoBounds();
            }}
            onPlaying={() => {
              setVideoLoaded(true);
            }}
            onTimeUpdate={() => {
              if (videoRef.current && videoRef.current.currentTime > 0) {
                setVideoLoaded(true);
              }
            }}
          />

          {/* Video-Anchored Hotspots (100% mathematically locked to video pixels, elevated above overlays) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {children && children(bounds)}
          </div>
        </motion.div>
      )}

      {/* Atmospheric Contrast Vignettes (Top and Bottom) */}
      <div className="absolute inset-x-0 top-0 h-36 sm:h-44 bg-gradient-to-b from-[#10051F]/90 via-[#10051F]/30 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-[#10051F]/90 via-[#10051F]/30 to-transparent pointer-events-none z-10" />
    </div>
  );
}
