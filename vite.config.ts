import { defineConfig } from "vite";
import { exec } from "node:child_process";

function emitDtsPlugin() {
  return {
    name: "emit-dts",
    closeBundle() {
      exec("tsc", (err, stdout, stderr) => {
        if (err) {
          console.error("Type generation failed:", stderr);
        } else {
          console.log("Type declarations generated.");
        }
      });
    },
  };
}
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
  plugins: [emitDtsPlugin()],
});
