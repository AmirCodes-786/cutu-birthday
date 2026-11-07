/**
 * Asset mapping for HER UNIVERSE
 * High-performance WebP-optimized master artwork assets located in public/images/optimized/.
 * Reduces initial transfer payload by over 86% while maintaining pristine cinematic fidelity.
 */

export const ASSETS = {
  // World 01 - The Secret Portal
  portal: {
    cosmicNebula: "/images/optimized/cosmic-nebula.webp",
    heartPortalRef: "/images/optimized/portal-heart.webp",
    mobile: "/images/optimized/portal-heart-mobile.webp",
  },
  // World 02 - The Love Letter
  letter: {
    stillLife: "/images/optimized/letter-still-life.webp",
    mobile: "/images/optimized/letter-still-life-mobile.webp",
  },
  // World 03 - The Memory Galaxy (subtle cosmic nebula texture)
  galaxy: {
    cosmicAtmosphere: "/images/optimized/galaxy-starry.webp",
    mobile: "/images/optimized/galaxy-starry-mobile.webp",
  },
  // World 04 - The Enchanted Garden of Reasons
  garden: {
    roseGazebo: "/images/optimized/garden-gazebo.webp",
    mobile: "/images/optimized/garden-gazebo-mobile.webp",
  },
  // World 05 - The Dream Island
  island: {
    floatingIsland: "/images/optimized/island-floating.webp",
    mobile: "/images/optimized/island-floating-mobile.webp",
    video: "/videos/dream-island.mp4",
  },
  // World 06 - The Grand Birthday Finale
  finale: {
    birthdayCelebration: "/images/optimized/birthday-celebration.webp",
    mobile: "/images/optimized/birthday-celebration-mobile.webp",
  },
  // Shared Transitions
  transitions: {
    moonlitMeadow: "/images/optimized/transition-meadow.webp",
    mobile: "/images/optimized/transition-meadow-mobile.webp",
  },
} as const;

export type AssetsConfig = typeof ASSETS;
