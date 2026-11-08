/**
 * World 05: Dream Island Configuration
 * 6 heartfelt personal milestones, wishes, and future horizons written from Suhel to Ruhi.
 * Genuine, loving, warm, and filled with real emotions and emojis.
 */

export interface LandmarkExperience {
  id: string;
  number: string;
  name: string;
  theme: "gate" | "cottage" | "tree" | "lake" | "observatory" | "horizon";
  subtitle: string;
  tagline: string;
  emoji: string;
  accentColor: string;
  glowColor: string;
  position: { x: number; y: number }; // Percentage coords on 2D artwork
  threePosition: [number, number, number]; // 3D Camera focus coordinates [x, y, z]
  description: string;
  story: string;
  whisper: string;
  wishPrompt: string;
  wishConfirmedText: string;
}

export const dreamsConfig: {
  chapter: string;
  title: string;
  subtitle: string;
  landmarks: LandmarkExperience[];
} = {
  chapter: "CHAPTER 05 · DREAM ISLAND",
  title: "THE FLOATING SANCTUARY OF DREAMS",
  subtitle: "Every little corner here holds a tomorrow I wish to live with you. ♡",
  landmarks: [
    {
      id: "dream-gate",
      number: "01",
      name: "The Dream Gate",
      theme: "gate",
      subtitle: "Where My Heart Found Home",
      tagline: "The sweetest blessing in my life ♡",
      emoji: "⛩️",
      accentColor: "#FF0055",
      glowColor: "rgba(255, 0, 85, 0.95)",
      position: { x: 39, y: 37 },
      threePosition: [-1.2, -1.8, 2.2],
      description:
        "Ruhi, you make even my ordinary days feel magical. Every beautiful journey feels better when I imagine you beside me. ❤️",
      story:
        "Ruhi, you make even my ordinary days feel magical. Every beautiful journey feels better when I imagine you beside me. ❤️",
      whisper: "My favourite adventure will always be us. 🥹💗",
      wishPrompt: "Step into our world with me 🫂",
      wishConfirmedText: "Holding your hand forever! 💖✨",
    },
    {
      id: "dream-cottage",
      number: "02",
      name: "Little Dream Cottage",
      theme: "cottage",
      subtitle: "Our Cozy Safe Haven",
      tagline: "Warm tea, rainy mornings & quiet cuddles ♡",
      emoji: "🏡",
      accentColor: "#FFB300",
      glowColor: "rgba(255, 179, 0, 0.95)",
      position: { x: 88, y: 40 },
      threePosition: [-0.6, -0.3, 1.8],
      description:
        "With you, even the simplest moments feel like home. Your smile is my favourite place to return to. 🫶",
      story:
        "With you, even the simplest moments feel like home. Your smile is my favourite place to return to. 🫶",
      whisper: "You're my little piece of peace. 🌷",
      wishPrompt: "Wish for cozy mornings & peace 🏡",
      wishConfirmedText: "Warm hugs & cozy cuddles saved! ☕💛",
    },
    {
      id: "wishing-tree",
      number: "03",
      name: "The Wishing Tree",
      theme: "tree",
      subtitle: "A Thousand Birthday Prayers",
      tagline: "For your health, happiness & radiant smile ♡",
      emoji: "🌸",
      accentColor: "#FF1493",
      glowColor: "rgba(255, 20, 147, 0.95)",
      position: { x: 77, y: 19 },
      threePosition: [0.5, 1.1, 1.6],
      description:
        "May all your dreams find their way to you, Ruhi. And may life always give you a thousand reasons to smile. 🌸",
      story:
        "May all your dreams find their way to you, Ruhi. And may life always give you a thousand reasons to smile. 🌸",
      whisper: "One of my biggest wishes is your endless happiness. 💖",
      wishPrompt: "Tie your birthday ribbon 🎀",
      wishConfirmedText: "A million blessings sent to you! 🌸✨",
    },
    {
      id: "lake-of-dreams",
      number: "04",
      name: "Lake of Dreams",
      theme: "lake",
      subtitle: "Our Uncharted Adventures",
      tagline: "Late night drives, road trips & getting lost together ♡",
      emoji: "🌊",
      accentColor: "#00E5FF",
      glowColor: "rgba(0, 229, 255, 0.95)",
      position: { x: 31, y: 53 },
      threePosition: [-2.2, -1.2, 2.0],
      description:
        "Late-night drives, silly laughs, random adventures and beautiful sunsets — I want all of them with you. 🚗💕",
      story:
        "Late-night drives, silly laughs, random adventures and beautiful sunsets — I want all of them with you. 🚗💕",
      whisper: "Anywhere feels magical when I'm with you. ✨",
      wishPrompt: "Wish for our next road trip 🌊",
      wishConfirmedText: "Road trip promise locked in! 💙🚙",
    },
    {
      id: "star-observatory",
      number: "05",
      name: "The Star Observatory",
      theme: "observatory",
      subtitle: "Looking Into Our Future",
      tagline: "Cheering for you in everything you do ♡",
      emoji: "🏛️",
      accentColor: "#B026FF",
      glowColor: "rgba(176, 38, 255, 0.95)",
      position: { x: 63, y: 31 },
      threePosition: [2.1, -0.1, 1.9],
      description:
        "Never stop chasing your dreams, Ruhi. I believe in you more than you know, and I'll always be your loudest cheerleader. 🥹",
      story:
        "Never stop chasing your dreams, Ruhi. I believe in you more than you know, and I'll always be your loudest cheerleader. 🥹",
      whisper: "Go shine, my girl. The stars are waiting for you. 🌙",
      wishPrompt: "Make a wish for your future 🔭",
      wishConfirmedText: "Always cheering for you, my star! ⭐👑",
    },
    {
      id: "secret-horizon",
      number: "06",
      name: "The Secret Horizon",
      theme: "horizon",
      subtitle: "The Final Birthday Surprise",
      tagline: "Take my hand, the party is waiting for you! 🎂",
      emoji: "🌅",
      accentColor: "#FF5722",
      glowColor: "rgba(255, 87, 34, 0.95)",
      position: { x: 12, y: 33 },
      threePosition: [3.0, 1.2, 1.4],
      description:
        "Our best memories are still waiting to happen. Here's to endless laughter, countless adventures and a beautiful future together. ❤️",
      story:
        "Our best memories are still waiting to happen. Here's to endless laughter, countless adventures and a beautiful future together. ❤️",
      whisper: "My favourite future has you in it. 💍💕",
      wishPrompt: "Light the birthday lantern 🏮",
      wishConfirmedText: "Ready for your Birthday Cake! 🎂💖",
    },
  ],
};
