// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
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
      apiBaseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3344',
    }
  }
});
