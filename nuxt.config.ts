// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  css: ["~/assets/css/tailwind.css"],

  // Configuration des variables d'environnement
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },

  // Configuration SSR pour éviter les problèmes d'hydratation
  ssr: true,

  googleFonts: {
    families: {
      Jost: [400, 500, 600, 700],
    },
    display: "swap",
  },
});
