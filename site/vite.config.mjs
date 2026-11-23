import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

const here = import.meta.dirname;

export default defineConfig({
  root: here,
  base: process.env.DOCS_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  cacheDir: resolve(here, "../node_modules/.vite/site"),
  build: { outDir: resolve(here, "../dist-site"), emptyOutDir: true },
  server: { host: "127.0.0.1", port: 5191, strictPort: true },
});
