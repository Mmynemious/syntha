import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  clearScreen: false,
  envPrefix: ["VITE_"],
  plugins: [react()],
  build: {
    target: "es2020",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        generate: resolve(__dirname, "generate.html"),
      },
    },
  },
});
