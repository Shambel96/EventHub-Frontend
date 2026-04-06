// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2025-07-15',
//   devtools: { enabled: true }
// })

export default defineNuxtConfig({
  compatibilityDate: "2026-04-03",
  srcDir: "src/",
  css: ["~/assets/css/tailwind.css"],
  modules: ["@pinia/nuxt"],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
    runtimeConfig: {
    public: {
      // Points to your NestJS backend
      apiBase: import.meta.env.API_BASE_URL || 'http://localhost:3001',
    },
  },
  // optionally add more Nuxt/Tailwind config here
});
