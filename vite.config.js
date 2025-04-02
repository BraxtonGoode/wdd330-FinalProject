import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        search: resolve(__dirname, "src//search/search.html"),
        gameOfTheDay: resolve(__dirname, "src/gameoftheday/gameoftheday.html"),
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },

  // Add proxy configuration
  server: {
    proxy: {
      // When you make a request to /api, Vite will proxy it to the BoardGameGeek API
      "/api": {
        target: "https://boardgamegeek.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
