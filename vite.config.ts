import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    proxy: {
      "/sui": {
        target: "https://rpc.ankr.com/sui",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sui/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("client-request-method");
          });
        },
      },
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // Point explicitly to the ESM entry file. If your package provides index.mjs, use that.
      "@mysten/sui": path.resolve(
        __dirname,
        "node_modules/@mysten/sui/dist/index.js"
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@mysten/sui"],
  },
});
