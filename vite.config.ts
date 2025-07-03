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
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});
