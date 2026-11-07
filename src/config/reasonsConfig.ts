/**
 * World 04: Enchanted Garden of Reasons Configuration
 * 12 customizable reasons why you cherish and love her.
 */

export interface ReasonItem {
  id: number;
  flowerType: string;
  flowerColor: string;
  emoji: string;
  title: string;
  reason: string;
}

export const reasonsConfig: {
  title: string;
  subtitle: string;
  reasons: ReasonItem[];
} = {
  title: "The Garden of Infinite Reasons",
  subtitle: "Every blossom holds a quiet reason why my heart chose you. ♡",
  reasons: [
    {
      id: 1,
      flowerType: "Velvet Rose",
      flowerColor: "#F28DBB",
      emoji: "🌹",
      title: "Your Unconditional Kindness",
      reason: "The way you treat people, animals, and every gentle thing with boundless empathy and warmth. You have the softest heart I've ever known. 🌸✨",
    },
    {
      id: 2,
      flowerType: "Moonlit Lotus",
      flowerColor: "#F5C77E",
      emoji: "🪷",
      title: "Your Infectious Laughter",
      reason: "That cute little crinkle in your eyes and genuine laugh that instantly erases every worry from my day. It's my favorite sound in the universe. 🥺💛",
    },
    {
      id: 3,
      flowerType: "Starlight Orchid",
      flowerColor: "#D95BCB",
      emoji: "✨",
      title: "The Way You Truly Listen",
      reason: "How you hear what I say with complete presence, and understand even the thoughts I struggle to put into words. Being heard by you feels like home. 💫🤍",
    },
    {
      id: 4,
      flowerType: "Crystal Peony",
      flowerColor: "#F8B7D0",
      emoji: "🌸",
      title: "Your Unstoppable Passion",
      reason: "Watching your eyes illuminate whenever you talk about the dreams, art, and people you love. Your enthusiasm is pure contagious magic. 💖🔥",
    },
    {
      id: 5,
      flowerType: "Golden Dahlia",
      flowerColor: "#F5C77E",
      emoji: "🌼",
      title: "Your Calming Presence",
      reason: "Even in chaotic or overwhelming moments, just sitting beside you brings an effortless sense of peace. You are my safe haven in a noisy world. 🕊️✨",
    },
    {
      id: 6,
      flowerType: "Cherry Blossom",
      flowerColor: "#F28DBB",
      emoji: "🌺",
      title: "Our Secret Inside Jokes",
      reason: "Those quiet glances we exchange across a crowded room that nobody else understands—and the uncontrollable giggles that always follow. 🤭💕",
    },
    {
      id: 7,
      flowerType: "Amethyst Violet",
      flowerColor: "#9560C5",
      emoji: "💜",
      title: "Your Resilient Heart",
      reason: "Your quiet courage, your elegance under pressure, and how you always choose kindness and dignity no matter what comes your way. I admire you so much. 👑🌷",
    },
    {
      id: 8,
      flowerType: "Blush Camellia",
      flowerColor: "#D7A0A8",
      emoji: "💐",
      title: "The Way You Love",
      reason: "You love so deeply, gently, and genuinely. You make me feel cherished, safe, and truly seen for who I am every single day. 🥹💖",
    },
    {
      id: 9,
      flowerType: "Celestial Iris",
      flowerColor: "#66318D",
      emoji: "🌙",
      title: "Our Quiet Mornings",
      reason: "How comfortable we are in silence together—sipping warm tea, watching the sky change, without ever needing words to fill the peaceful air. ☕🍯",
    },
    {
      id: 10,
      flowerType: "Imperial Tulip",
      flowerColor: "#D95BCB",
      emoji: "🌷",
      title: "Your Playful Spirit",
      reason: "The way you dance randomly in the kitchen, make goofy faces when I'm busy, and remind me never to take life too seriously. You bring joy everywhere. 💃🎉",
    },
    {
      id: 11,
      flowerType: "Rose Gold Magnolia",
      flowerColor: "#D7A0A8",
      emoji: "🤍",
      title: "Your Beautiful Mind",
      reason: "The way you perceive the world, your sharp wit, your brilliant perspective, and how you inspire me to grow into a better person every single day. 🧠✨",
    },
    {
      id: 12,
      flowerType: "Eternal Star Lily",
      flowerColor: "#FFF1E6",
      emoji: "⭐",
      title: "Just Being Ruhi",
      reason: "Because in a universe of billions of galaxies and infinite stars, there is only one you. My heart will choose you in every lifetime. Happy Birthday my love! 🎂💖✨",
    },
  ],
};
