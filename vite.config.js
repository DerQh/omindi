import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vite.config.js
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["recharts", "recharts/es6"],
  },
  build: {
    commonjsOptions: {
      include: [/recharts/, /node_modules/],
    },
  },
});
