// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2025-07-15',
//   devtools: { enabled: true }
// })

export default defineNuxtConfig({
  compatibilityDate: "2026-04-03",
  srcDir: "src/",
  css: ["~/assets/css/tailwind.css"],
  modules: [],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  // optionally add more Nuxt/Tailwind config here
});
