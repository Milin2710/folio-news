import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In development, forward /api calls to the Express server
    proxy: { "/api": "http://localhost:4000" },
  },
});
