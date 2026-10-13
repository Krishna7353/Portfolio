import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // in development, forward /api calls to the Spring Boot backend (no CORS headaches)
    proxy: { "/api": "http://localhost:8080" },
  },
});
