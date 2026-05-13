import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

export default defineConfig({
  root: fileURLToPath(new URL("./spa", import.meta.url)),
  base: "/site/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./spa/src", import.meta.url)),
      "@site": repoRoot,
    },
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  build: {
    outDir: repoRoot,
    emptyOutDir: false,
  },
});
