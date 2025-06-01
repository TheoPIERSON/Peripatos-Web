// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  css: ["~/assets/css/tailwind.css"], // Nouveau fichier CSS avec syntaxe v4

  googleFonts: {
    families: {
      Jost: [400, 500, 600, 700],
    },
    display: "swap",
  },
});
