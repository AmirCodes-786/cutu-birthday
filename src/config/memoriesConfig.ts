/**
 * World 03: Memory Galaxy Configuration
 * Personal photos of Ruhi and Suhel.
 */

export interface MemoryItem {
  id: string;
  title: string;
  date?: string;
  image: string;
  caption: string;
  description: string;
  aspectRatio: number; // width / height for authentic un-distorted 3D framing
}

export const memoriesConfig: {
  title: string;
  subtitle: string;
  instruction: string;
  memories: MemoryItem[];
} = {
  title: "Memory Galaxy",
  subtitle: "Every little moment with Ruhi is a star worth keeping. ♡",
  instruction: "Select a memory to bring it closer to your heart ♡",
  memories: [
    {
      id: "mem-1",
      title: "Our Starlit Journey Begins",
      date: "Cherished Moment",
      image: "/images/memories/image-1.jpeg",
      aspectRatio: 0.5625, // 720 x 1280 portrait
      caption: "The start of countless unforgettable smiles together.",
      description:
        "Every time I look at this, I remember how easily you brought warmth, laughter, and light into my days. You make even the simplest moments feel extraordinary.",
    },
    {
      id: "mem-2",
      title: "Radiant Happiness",
      date: "Golden Memory",
      image: "/images/memories/image-2.jpeg",
      aspectRatio: 0.5625, // 720 x 1280 portrait
      caption: "That genuine, effortless smile that always brightens my day.",
      description:
        "Your smile has a way of erasing every worry. Seeing you truly happy is one of the greatest joys I could ever ask for.",
    },
    {
      id: "mem-3",
      title: "Unforgettable Together",
      date: "Special Day",
      image: "/images/memories/image-3.jpeg",
      aspectRatio: 1.333, // 1280 x 960 landscape
      caption: "Lost in our own little world where time stands still.",
      description:
        "It feels like the whole world could be bustling around us, yet with you, everything feels peaceful, joyful, and complete.",
    },
    {
      id: "mem-4",
      title: "Pure Laughter & Fun",
      date: "Sweet Memory",
      image: "/images/memories/image-4.jpeg",
      aspectRatio: 0.748, // 1198 x 1600 portrait
      caption: "The glances, the jokes, and the happiness only we share.",
      description:
        "The memories where we laugh without a care in the world. Being with you feels like home, no matter where we are.",
    },
    {
      id: "mem-5",
      title: "Heartfelt Moments",
      date: "Precious Memory",
      image: "/images/memories/image-5.jpeg",
      aspectRatio: 1.777, // 1280 x 720 landscape
      caption: "Quiet comfort, knowing you are by my side.",
      description:
        "Thank you for being my anchor, my confidante, and my favorite person to share life with. You mean the world to me, Ruhi.",
    },
    {
      id: "mem-6",
      title: "Forever & Always",
      date: "Our Constellation",
      image: "/images/memories/image-6.jpeg",
      aspectRatio: 0.5625, // 720 x 1280 portrait
      caption: "Here is to celebrating you today and every single day ahead.",
      description:
        "Happy Birthday, my love. May our constellation of memories keep growing brighter and more beautiful with every passing year.",
    },
  ],
};
