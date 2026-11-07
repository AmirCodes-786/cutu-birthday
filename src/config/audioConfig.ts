/**
 * Audio Configuration
 * Easily configure your local audio file here.
 * Place your audio file in /public/audio/ (e.g., /public/audio/birthday-song.mp3)
 */

export const audioConfig = {
  enabled: true,
  defaultMuted: false,
  defaultVolume: 0.6,
  // Primary soundtrack path (place your file at public/audio/birthday-song.mp3 or ambient-universe.mp3)
  trackSrc: "/audio/birthday-song.mp3",
  fallbackTrackSrc: "/audio/ambient-universe.mp3",
  trackTitle: "Her Birthday Soundtrack",
};
