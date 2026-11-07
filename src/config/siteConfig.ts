/**
 * Site & Story Configuration
 * Personal details for Ruhi's Birthday Universe from Suhel.
 */

export const siteConfig = {
  // Recipient and Sender details
  recipient: {
    name: "Ruhi",
    nickname: "Ruhi",
    birthdayDate: "November 2026",
  },
  sender: {
    name: "Suhel",
  },

  // World 01 — Secret Portal Birthday Greeting
  portal: {
    eyebrow: "TONIGHT, THE STARS SHINE JUST FOR RUHI",
    mainHeading: "HAPPY BIRTHDAY, RUHI",
    supportingMessage:
      "A little universe of magic, memories, and everything that makes you special.",
    buttonText: "✦ LET THE MAGIC BEGIN →",
    instruction: "A little magic is waiting for you inside.",
  },

  // Chapter labels for navigation
  chapters: [
    { id: "portal", number: "01", title: "Secret Portal", subtitle: "The Threshold" },
    { id: "letter", number: "02", title: "Love Letter", subtitle: "Words from the Heart" },
    { id: "galaxy", number: "03", title: "Memory Galaxy", subtitle: "Starlit Moments" },
    { id: "garden", number: "04", title: "Enchanted Garden", subtitle: "Reasons I Adore You" },
    { id: "island", number: "05", title: "Dream Island", subtitle: "Our Horizons" },
    { id: "finale", number: "06", title: "Grand Finale", subtitle: "Make a Wish" },
  ] as const,
};

export type ChapterId = (typeof siteConfig.chapters)[number]["id"];
