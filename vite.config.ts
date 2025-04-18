import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Module",
      fileName: "index",
    },
    rollupOptions: {
      external: [], // Leave empty for fully self-contained
    },
    target: "esnext",
  },
});
