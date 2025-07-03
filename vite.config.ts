import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: "gzip" }), // Compress .js, .css, etc.
    visualizer({ open: false }), // Open bundle report in browser
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Optional: Use @/components/...
    },
  },
  server: {
    port: 5173,
    // Enable this when you connect to backend
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:8000",
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  build: {
    target: "esnext",
    minify: "esbuild", // Fastest (can switch to 'terser' for better compression)
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor"; // Code split vendors
        },
      },
    },
  },
});
