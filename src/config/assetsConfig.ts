/**
 * Asset mapping for HER UNIVERSE
 * Authoritative Cloudinary-hosted media configuration with automatic format and quality delivery (f_auto, q_auto)
 * and responsive width variants for mobile (w_1080) and desktop (native resolution).
 */

export const ASSETS = {
  // World 01 - The Secret Portal
  portal: {
    cosmicNebula:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto/v1794141560/Dreamy_Cosmic_Nebula_Over_a_Sea_of_Clouds_enscau.png",
    heartPortalRef:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto/v1794141558/Celestial_Cherry_Blossom_Heart_Portal_pnh9ir.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto,w_1080,c_limit/v1794141558/Celestial_Cherry_Blossom_Heart_Portal_pnh9ir.png",
  },
  // World 02 - The Love Letter
  letter: {
    stillLife:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto/v1794141561/Romantic_Love_Letter_Still_Life_zwlakd.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto,w_1080,c_limit/v1794141561/Romantic_Love_Letter_Still_Life_zwlakd.png",
  },
  // World 03 - The Memory Galaxy (subtle cosmic nebula texture)
  galaxy: {
    cosmicAtmosphere:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto/v1794141560/Memory_Galaxy__Starry_Moments_fiqkmp.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto,w_1080,c_limit/v1794141560/Memory_Galaxy__Starry_Moments_fiqkmp.png",
  },
  // World 04 - The Enchanted Garden of Reasons
  garden: {
    roseGazebo:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto/v1794141560/Moonlit_Rose_Garden_Gazebo_uhnltu.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto,w_1080,c_limit/v1794141560/Moonlit_Rose_Garden_Gazebo_uhnltu.png",
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
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto/v1794141564/Moonlit_Garden_Birthday_Celebration_tqflx4.png",
    mobile:
      "https://res.cloudinary.com/dzly2px6w/image/upload/f_auto,q_auto,w_1080,c_limit/v1794141564/Moonlit_Garden_Birthday_Celebration_tqflx4.png",
  },
  // Shared Transitions
  transitions: {
    moonlitMeadow: "/images/optimized/transition-meadow.webp",
    mobile: "/images/optimized/transition-meadow-mobile.webp",
  },
} as const;

export type AssetsConfig = typeof ASSETS;

/**
 * Helper to retrieve the optimal asset URL based on device viewport.
 * Guarantees that the preloader and the scene components request the exact
 * same URL on any device, eliminating duplicate network downloads.
 */
export function getDeviceAssetUrl(desktopUrl: string, mobileUrl?: string): string {
  if (typeof window !== "undefined" && window.innerWidth < 768 && mobileUrl) {
    return mobileUrl;
  }
  return desktopUrl;
}

/**
 * Returns the canonical responsive background URL for a given world.
 * Directly shared by loadingManager and scene renderers for 100% cache hits.
 */
export function getSceneBackgroundUrl(
  category: "portal" | "letter" | "galaxy" | "garden" | "finale"
): string {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  switch (category) {
    case "portal":
      return isMobile ? ASSETS.portal.mobile : ASSETS.portal.heartPortalRef;
    case "letter":
      return isMobile ? ASSETS.letter.mobile : ASSETS.letter.stillLife;
    case "galaxy":
      return isMobile ? ASSETS.galaxy.mobile : ASSETS.galaxy.cosmicAtmosphere;
    case "garden":
      return isMobile ? ASSETS.garden.mobile : ASSETS.garden.roseGazebo;
    case "finale":
      return isMobile ? ASSETS.finale.mobile : ASSETS.finale.birthdayCelebration;
  }
}

/**
 * Utility to generate Cloudinary transformation URLs dynamically.
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options?: { width?: number; quality?: string | number }
): string {
  if (!url || !url.includes("res.cloudinary.com") || url.includes("/video/")) {
    return url;
  }
  const parts: string[] = ["f_auto", "q_auto"];
  if (options?.width) {
    parts.push(`w_${options.width}`, "c_limit");
  }
  const transform = parts.join(",");

  const match = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:[^/]+\/)?(v\d+\/.+)$/
  );
  if (match) {
    return `${match[1]}${transform}/${match[2]}`;
  }
  return url;
}
