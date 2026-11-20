// The docs site: every component on its own page, rendered for real from ../src.
//   npm run dev          (http://127.0.0.1:5191)
//   npm run build:site   (writes dist-site/, which GitHub Pages serves)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

const here = import.meta.dirname;

export default defineConfig({
  root: here,
  // GitHub Pages serves the site under /<repository>/; the deploy workflow sets DOCS_BASE.
  base: process.env.DOCS_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  cacheDir: resolve(here, "../node_modules/.vite/site"),
  build: { outDir: resolve(here, "../dist-site"), emptyOutDir: true },
  server: { host: "127.0.0.1", port: 5191, strictPort: true },
});
