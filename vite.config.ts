import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
    target: "esnext",
  },
  resolve: {
    alias: [
      {
        // If the import has a subpath, route it to the esm folder in node_modules.
        find: /^@mysten\/sui\/(.*)$/,
        replacement: resolve(__dirname, "node_modules/@mysten/sui/dist/esm/$1"),
      },
      {
        // If the import is exactly "@mysten/sui", route it to our custom shim.
        find: /^@mysten\/sui$/,
        replacement: resolve(__dirname, "src/lib/sui.ts"),
      },
    ],
  },
});
