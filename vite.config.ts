import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {viteSingleFile} from "vite-plugin-singlefile";

/* One self-contained HTML file: it is published as a claude.ai artifact and served by GitHub Pages. */
export default defineConfig({
  root: "app",
  base: "./",
  plugins: [react(), viteSingleFile()],
  build: {outDir: "../dist/app", emptyOutDir: true, target: "es2022", chunkSizeWarningLimit: 4000},
});
