// utils/genreToImageMap.ts

export const genreToImageMap = {
  philosophie: "/images/cover/blue_sky.png",
  "policier/thriller": "/images/cover/green_nature.png",
  classique: "/images/cover/red.png",
  aventure: "/images/cover/orange_adventure.png",
  romance: "/images/cover/pink_romance.png",
  "science-fiction": "/images/cover/yellow.png",
  histoire: "/images/cover/red_classic.png",
  biographie: "/images/cover/gray.png",
  essai: "/images/cover/blue_light.png",
  roman: "/images/cover/red_light.png",
  fantaisie: "/images/cover/orange_light.png",
  science: "/images/cover/orange_adventure.png",
  cuisine: "/images/cover/orange_adventure.png",
  "développement personnel": "/images/cover/green_.png",
  "dark romance": "/images/cover/dark_romance.png",
} as const;

export const defaultCoverImage = "/images/cover/sand.png";

export type Genre = keyof typeof genreToImageMap;
