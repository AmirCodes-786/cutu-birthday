/**
 * Asset mapping for HER UNIVERSE
 * High-performance WebP-optimized master artwork assets located in public/images/optimized/.
 * Reduces initial transfer payload by over 86% while maintaining pristine cinematic fidelity.
 */

export const ASSETS = {
  // World 01 - The Secret Portal
  portal: {
    cosmicNebula:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141560/Dreamy_Cosmic_Nebula_Over_a_Sea_of_Clouds_enscau.png",
    heartPortalRef:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141558/Celestial_Cherry_Blossom_Heart_Portal_pnh9ir.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141558/Celestial_Cherry_Blossom_Heart_Portal_pnh9ir.png",
  },
  // World 02 - The Love Letter
  letter: {
    stillLife:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141561/Romantic_Love_Letter_Still_Life_zwlakd.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141561/Romantic_Love_Letter_Still_Life_zwlakd.png",
  },
  // World 03 - The Memory Galaxy (subtle cosmic nebula texture)
  galaxy: {
    cosmicAtmosphere:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141560/Memory_Galaxy__Starry_Moments_fiqkmp.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141560/Memory_Galaxy__Starry_Moments_fiqkmp.png",
  },
  // World 04 - The Enchanted Garden of Reasons
  garden: {
    roseGazebo:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141560/Moonlit_Rose_Garden_Gazebo_uhnltu.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141560/Moonlit_Rose_Garden_Gazebo_uhnltu.png",
  },
  // World 05 - The Dream Island
  island: {
    floatingIsland: "/images/optimized/island-floating.webp",
    mobile: "/images/optimized/island-floating-mobile.webp",
    video:
      "https://res.cloudinary.com/dzly2px6w/video/upload/v1794140601/dream-island_gnsavq.mp4",
  },
  // World 06 - The Grand Birthday Finale
  finale: {
    birthdayCelebration:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141564/Moonlit_Garden_Birthday_Celebration_tqflx4.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/v1794141564/Moonlit_Garden_Birthday_Celebration_tqflx4.png",
  },
  // Shared Transitions
  transitions: {
    moonlitMeadow: "/images/optimized/transition-meadow.webp",
    mobile: "/images/optimized/transition-meadow-mobile.webp",
  },
} as const;

export type AssetsConfig = typeof ASSETS;
