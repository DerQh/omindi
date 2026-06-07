import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // Cache app shell + WebP images only (skip large originals)
        globPatterns: ["**/*.{js,css,html,ico,svg,webp,woff,woff2}"],
        // Exclude large files and the unoptimised originals from precache
        globIgnores: ["**/shop/**", "**/*.jpg", "**/*.jpeg", "**/*.JPG", "**/*.png"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // Don't cache Supabase API calls — always fetch fresh
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /^\/rest/, /^\/storage/],
        runtimeCaching: [
          {
            // Supabase storage images — cache for 7 days
            urlPattern: /^https:\/\/kdnswhflymslpbsftwek\.supabase\.co\/storage\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "supabase-images",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // Google Fonts files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: "AFARMER™ — Kenya's Farm Marketplace",
        short_name: "AFARMER",
        description: "Buy and sell fresh farm produce directly from local Kenyan farmers.",
        theme_color: "#2f5a2a",
        background_color: "#f7faf7",
        display: "standalone",
        start_url: "/mobile",
        icons: [
          { src: "/afarmer.webp", sizes: "192x192", type: "image/webp" },
          { src: "/afarmer.webp", sizes: "512x512", type: "image/webp" },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/"))
            return "vendor-react";
          if (id.includes("node_modules/react-router"))
            return "vendor-router";
          if (id.includes("node_modules/@tanstack/"))
            return "vendor-query";
          if (id.includes("node_modules/recharts/"))
            return "vendor-charts";
          if (id.includes("node_modules/@supabase/"))
            return "vendor-supabase";
          if (id.includes("node_modules/styled-components/"))
            return "vendor-styled";
          if (id.includes("node_modules/react-helmet-async/"))
            return "vendor-helmet";
        },
      },
    },
  },
});
