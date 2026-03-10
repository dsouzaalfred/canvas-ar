import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: ["f381-82-144-239-98.ngrok-free.app", ".ngrok-free.app"],
  },
});
