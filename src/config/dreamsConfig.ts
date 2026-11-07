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
        "The entrance to our little dream world. Out of billions of people on this planet, my heart found its forever home right beside you. Every road quietly led me to you.",
      story:
        "You know how some people just bring sunshine wherever they go? That's you for me, Ruhi. From the moment you came into my life, everything became brighter, warmer, and so much funnier. Ordinary days stopped feeling ordinary because you were in them. Stepping through this gate is my quiet promise to always choose you, cherish you, and hold your hand through whatever life brings.",
      whisper:
        "Happy Birthday my cutie. Welcome to your special world—made with all my love, just to see your face light up today and always. 💖🌸✨",
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
        "A warm little hillside home with amber glowing windows, soft blankets, and the scent of cinnamon tea. A place where you can kick off your shoes and just breathe.",
      story:
        "This is my favorite dream of us—waking up on a quiet rainy morning with zero alarms and nowhere to rush. Just two big mugs of hot tea cradled in our hands, listening to the rain tap against the window while you curl up right next to me, completely cozy and at peace. Talking about everything and nothing until hours just slip away.",
      whisper:
        "My biggest wish for you this year is pure peace of mind. That you always have me as your safe place where you can be 100% your silly, beautiful, unmasked self without ever worrying. You are safe with me, always. ☕🍯💛",
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
        "A gorgeous blooming pink sakura tree on the highest cliff, with soft petals floating gently in the evening breeze. Every single petal holds a birthday prayer for you.",
      story:
        "If I could collect every good thing this universe has to offer and wrap it up for your birthday, I would do it in a heartbeat. You have this rare, pure heart that gives so much love and care to everyone around you. Today, every petal falling from this tree carries my heartfelt prayer for your health, your endless laughter, your peace, and all your secret dreams coming true.",
      whisper:
        "Ruhi, you deserve every ounce of sweetness life has to offer. May this year bring you so much joy that your cheeks hurt from smiling. Happy Birthday, my star. 🌸🎀💕",
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
        "A shimmering crystal lake beneath cascading waterfalls, reflecting starry night skies and distant open horizons. The beginning of all our adventures.",
      story:
        "There is an entire world out there—scenic highways, mountain viewpoints, secret coffee spots, midnight airport terminals, and beach sunsets. And honestly, there is nobody else on earth I'd rather pack a messy suitcase with and get delightfully lost with than you. Even if we take a wrong turn, as long as your hand is in mine and your playlist is playing, it's the best trip ever.",
      whisper:
        "Here's to all our upcoming road trips, late-night hotel room laughter, sharing snacks in the passenger seat, and watching sunsets by the water. The best adventures are still ahead of us! 🚗✈️🌊💫",
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
        "A glowing marble pavilion looking out into the starry sky where the sunset clouds melt into stars. A quiet perch to look ahead at all the amazing things you are going to achieve.",
      story:
        "Whenever you talk about your goals and what you want to achieve, your eyes light up in the most captivating way. You are so hardworking, so capable, and so brilliant. Never doubt how strong you are. Whatever mountains you want to climb, whatever challenges come up, remember you will never have to face them alone. I will always be in the front row cheering the loudest for you.",
      whisper:
        "I am so proud of the woman you are, Ruhi. Dream as big as you want—I'll be right beside you every step of the way, believing in you even when you forget to believe in yourself. 👑⭐✨",
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
        "A sunset sanctuary where floating sky lanterns rise into twilight, carrying the glow of our dreams into the night sky. The gateway to your birthday celebration.",
      story:
        "You've explored every little corner of our Dream Island, but the night is just getting started! Just over this sunset horizon, I've prepared a special birthday celebration with your cake, candles, glowing lanterns, and music playing just for you. Today is all about you, Ruhi.",
      whisper:
        "You are the sweetest, most special part of my universe. Now close your eyes, make your biggest wish, and let's go celebrate your birthday together! 🎂💖✨🎉",
      wishPrompt: "Light the birthday lantern 🏮",
      wishConfirmedText: "Ready for your Birthday Cake! 🎂💖",
    },
  ],
};
