// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "@nuxt/eslint"],
  runtimeConfig: {
    public: {
      apiBase: "/api/v1",
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:8000/api",
        changeOrigin: true,
      },
    },
  },
});
