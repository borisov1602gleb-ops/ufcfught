import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Прокси на бэкенд, чтобы фронт обращался к /api без указания хоста.
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
