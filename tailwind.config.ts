// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: "#FEDB3F",
          light: "#FFF3A1",
          dark: "#E6C231",
        },
        primary: "#000000",
        background: "#FFFFFF",
        accent: "#FEDB3F",
      },
      fontFamily: {
        sans: ["Jost", "system-ui", "sans-serif"],
        title: ["Jost", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "Jost",
          },
        },
      },
    },
  },
} satisfies Config;
