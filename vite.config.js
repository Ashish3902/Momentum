// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // CRITICAL: Use relative paths
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
  },
});
