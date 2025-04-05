import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map the package to its dist entry instead of the package root.
      "@mysten/sui": path.resolve(
        __dirname,
        "node_modules/@mysten/sui/dist/index.js"
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@mysten/sui"],
  },
  ssr: {
    // Exclude from SSR externalization to ensure the alias is used.
    external: ["@mysten/sui"],
  },
});
