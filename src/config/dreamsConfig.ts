/**
 * World 05: Dream Island Configuration
 * 6 distinctive interactive landmarks holding personal wishes, dreams and horizons for Ruhi.
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
  subtitle: "Every horizon on this island holds a tomorrow I wish to explore with you.",
  landmarks: [
    {
      id: "dream-gate",
      number: "01",
      name: "The Dream Gate",
      theme: "gate",
      subtitle: "The Threshold of Horizons",
      tagline: "Welcome to Our Floating Sanctuary",
      emoji: "⛩️",
      accentColor: "#FF0055",
      glowColor: "rgba(255, 0, 85, 0.95)",
      position: { x: 39, y: 37 },
      threePosition: [-1.2, -1.8, 2.2],
      description:
        "An ancient stone archway woven with luminous vines and twilight blossoms that guards the entrance to the floating island. Here, the weight of the everyday world dissolves into starlight.",
      story:
        "Stepping through this gateway is a quiet reminder of how every path led me to you. You brought wonder, warmth, and laughter into my life, turning ordinary days into something extraordinary.",
      whisper:
        "Welcome to the sanctuary created solely to celebrate your birthday, my love. May every step you take here remind you how endlessly cherished you are. ♡",
      wishPrompt: "Step through the threshold ♡",
      wishConfirmedText: "Threshold crossed with love! 🕊️",
    },
    {
      id: "dream-cottage",
      number: "02",
      name: "Little Dream Cottage",
      theme: "cottage",
      subtitle: "Sanctuary of Comfort & Peace",
      tagline: "A Hearth for Rest and Gentle Days",
      emoji: "🏡",
      accentColor: "#FFB300",
      glowColor: "rgba(255, 179, 0, 0.95)",
      position: { x: 88, y: 40 },
      threePosition: [-0.6, -0.3, 1.8],
      description:
        "A warm cobblestone cottage nestled gently into the lush hillside, its amber windows glowing softly under a drifting plume of sweet cedarwood smoke.",
      story:
        "Imagine quiet rainy mornings with nowhere we have to rush, mugs of warm tea cradled between our hands, the soothing sound of raindrops against the windowpane, and you curled up reading your favorite book beside me.",
      whisper:
        "My birthday wish for you is boundless peace of mind: that you always have a place where you can exhale completely, be your silly, authentic self, and feel totally safe. ☕🍯",
      wishPrompt: "Send a wish for comfort & peace 🏡",
      wishConfirmedText: "Comfort & warmth blessed! 💛",
    },
    {
      id: "wishing-tree",
      number: "03",
      name: "The Wishing Tree",
      theme: "tree",
      subtitle: "Roots of Devotion",
      tagline: "Every Blossom Holds a Birthday Wish",
      emoji: "🌸",
      accentColor: "#FF1493",
      glowColor: "rgba(255, 20, 147, 0.95)",
      position: { x: 77, y: 19 },
      threePosition: [0.5, 1.1, 1.6],
      description:
        "The ancient weeping cherry blossom tree standing crowned at the highest plateau of the island. Thousands of luminous pink petals fall gently in the sunset breeze like whispered prayers.",
      story:
        "For centuries, travelers would tie silk ribbons to these branches, believing that the mountain winds would carry their truest wishes straight into the cosmos. Today, every single blossom on this tree bears a prayer for your health, your laughter, and your radiant spirit.",
      whisper:
        "Happy Birthday, Ruhi. May the universe return to you a hundredfold the tenderness, warmth, and quiet light you bring to everyone around you. 🌸✨",
      wishPrompt: "Tie a birthday wish ribbon 🎀",
      wishConfirmedText: "Wish tied to the sacred tree! 🌸",
    },
    {
      id: "lake-of-dreams",
      number: "04",
      name: "Lake of Dreams",
      theme: "lake",
      subtitle: "Cascading Waters & Horizons",
      tagline: "Reflecting Uncharted Adventures",
      emoji: "🌊",
      accentColor: "#00E5FF",
      glowColor: "rgba(0, 229, 255, 0.95)",
      position: { x: 31, y: 53 },
      threePosition: [-2.2, -1.2, 2.0],
      description:
        "A crystal-clear alpine lagoon catching the tumbling celestial waterfalls. The surface of the water ripples gently, reflecting distant coastlines, sunlit mountains, and unwritten journeys.",
      story:
        "The world is vast, filled with winding coastal highways, quaint cobblestone alleyways, quiet mountain lakes, and lively night markets waiting for us. There is nobody else I would rather pack a bag with and get delightfully lost with than you.",
      whisper:
        "Here's to all our upcoming road trips, passport stamps, late-night hotel room giggles, and breathtaking sunsets yet to be shared. ✈️🗺️🌊",
      wishPrompt: "Cast a wish into the waters 🌊",
      wishConfirmedText: "Adventure ripple sent! 💙",
    },
    {
      id: "star-observatory",
      number: "05",
      name: "The Star Observatory",
      theme: "observatory",
      subtitle: "Panorama of Tomorrow",
      tagline: "Looking Out Into Our Future",
      emoji: "🏛️",
      accentColor: "#B026FF",
      glowColor: "rgba(176, 38, 255, 0.95)",
      position: { x: 63, y: 31 },
      threePosition: [2.1, -0.1, 1.9],
      description:
        "An elegant white marble pavilion and astrolabe terrace perched high above the cliff's edge, offering an unobstructed panoramic view where the sunset clouds melt into the starlit void.",
      story:
        "Looking out from this terrace, the future isn't something intimidating or uncertain—it is an open canvas of promise. Whatever life brings, knowing that I get to stand beside you, support your ambitions, and cheer for your every victory makes every tomorrow something to look forward to.",
      whisper:
        "I believe in your talent, your sharp mind, and your beautiful resilience. No matter how high you reach for the stars, I will always be right here cheering for you. 👑🔭⭐",
      wishPrompt: "Gaze into the starlit future 🔭",
      wishConfirmedText: "Starlit promise sealed! ✨",
    },
    {
      id: "secret-horizon",
      number: "06",
      name: "The Secret Horizon",
      theme: "horizon",
      subtitle: "The Final Ascent",
      tagline: "Where Dreams Awaken",
      emoji: "🌅",
      accentColor: "#FF5722",
      glowColor: "rgba(255, 87, 34, 0.95)",
      position: { x: 12, y: 33 },
      threePosition: [3.0, 1.2, 1.4],
      description:
        "A mystical floating satellite island hovering softly in the twilight haze, connected only by drifting stardust and rising glowing sky lanterns.",
      story:
        "This hidden horizon marks the culmination of our floating sanctuary. Beyond this sunset mist lies the grand birthday celebration waiting just for you—a night of music, birthday cake, and heartfelt celebration.",
      whisper:
        "You have uncovered all horizons on the island. Now, take my hand as we step forward into your Grand Birthday Finale. 🎂✨💖",
      wishPrompt: "Ignite the final lantern 🏮",
      wishConfirmedText: "Grand Finale unlocked! 🎂",
    },
  ],
};
