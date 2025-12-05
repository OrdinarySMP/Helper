// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui", "@nuxt/eslint", "nuxt-auth-sanctum"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: "/api/v1",
      discordClientId: "",
      discordCallbackUrl: "http://localhost:3000/discord/callback",
    },
  },
  sanctum: {
    baseUrl: "http://localhost:8000", // Laravel API
    endpoints: {
      login: "/api/v1/login",
      logout: "/api/v1/logout",
      user: "/api/v1/me",
      csrf: "/api/v1/csrf-cookie",
    },
    globalMiddleware: {
      enabled: true,
    },
    redirect: {
      onAuthOnly: "/login",
      onGuestOnly: "/",
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
  vite: {
    optimizeDeps: {
      exclude: ["@ordinary/api-types"],
    },
  },
  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "brand",
        "info",
        "success",
        "warning",
        "error",
      ],
      defaultVariants: {
        color: "brand",
        size: "xl",
      },
    },
  },
});
