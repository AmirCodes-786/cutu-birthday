import { type Variants } from "framer-motion";

/**
 * Standard cinematic motion easing curves
 */
export const EASINGS = {
  cinematic: [0.25, 0.1, 0.25, 1.0],
  smoothOut: [0.16, 1, 0.3, 1],
  gentleFloat: [0.45, 0.05, 0.55, 0.95],
} as const;

/**
 * Fade up motion variant for headlines and romantic reveals
 */
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(6px)",
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      delay: custom,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Soft starlight pulse / glow animation variant
 */
export const glowPulseVariant: Variants = {
  initial: { opacity: 0.6, scale: 0.98 },
  animate: {
    opacity: [0.6, 0.95, 0.6],
    scale: [0.98, 1.02, 0.98],
    transition: {
      duration: 4.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Clean entrance for modal cards / overlays
 */
export const overlayCardVariant: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

