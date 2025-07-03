import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: "gzip" }),
    visualizer({ open: false }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), 
    },
  },
  server: {
    port: 5173,
  },
  build: {
    target: "esnext",
    minify: "esbuild", 
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
            if (id.includes("gsap")) return "gsap";
            if (id.includes("lodash")) return "lodash";
            if (id.includes("zego")) return "zego";
            return "vendor";
          }
        },
      },
    },
  },
});
