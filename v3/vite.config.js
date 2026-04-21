import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./spa", import.meta.url)),
  base: "/site/v3/app/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./spa/src", import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL("./app", import.meta.url)),
    emptyOutDir: true,
  },
});
