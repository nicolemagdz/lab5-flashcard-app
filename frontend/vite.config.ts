import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-server proxy forwards /api to the Express backend so the
// frontend can call relative paths without CORS friction locally.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
