"use client";

import React, { useEffect, useState, useRef } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export function CursorSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const lastSpawnTime = useRef(0);

  useEffect(() => {
    // Respect reduced motion and bypass on pure touch devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window && window.innerWidth < 768) return;

    let idCounter = 0;
    const colors = ["#F5C77E", "#F8B7D0", "#D95BCB", "#FFF1E6"];

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle to at most one sparkle spawn every 60ms (~16 spawns/sec max)
      if (now - lastSpawnTime.current < 60) return;
      lastSpawnTime.current = now;

      const newSparkle: Sparkle = {
        id: idCounter++,
        x: e.clientX + (Math.random() - 0.5) * 16,
        y: e.clientY + (Math.random() - 0.5) * 16,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setSparkles((prev) => [...prev.slice(-14), newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 650);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: s.x,
            top: s.y,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 8px ${s.color}`,
            transform: "translate(-50%, -50%)",
            animationDuration: "0.65s",
          }}
        />
      ))}
    </div>
  );
}
