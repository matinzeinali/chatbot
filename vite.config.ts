import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
        // The browser only talks to Vite, so blank out its Origin; the backend would
        // otherwise reject any dev port or host other than FRONTEND_ORIGIN.
        headers: { origin: "" },
      },
    },
  },
});
