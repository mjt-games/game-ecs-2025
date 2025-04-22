import { defineConfig } from "vite";
import { exec } from "node:child_process";
import { dependencies, peerDependencies } from "./package.json";

function emitDtsPlugin() {
  return {
    name: "emit-dts",
    async closeBundle() {
      return new Promise<void>((resolve, reject) => {
        exec("tsc", (err, stdout, stderr) => {
          if (err) {
            console.error("Type generation failed:\n", stderr);
            reject(err); // ❌ Causes build to fail
          } else {
            console.log("Type declarations generated.", stdout);
            resolve();
          }
        });
      });
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "index",
      formats: ["es"], // ← No UMD needed
    },
    rollupOptions: {
      //   external: [], // Leave empty for fully self-contained

      // Externalize all deps and peer deps automatically
      external: [
        ...Object.keys(dependencies || {}),
        ...Object.keys(peerDependencies || {}),
      ],
    },
    target: "esnext",
  },
  plugins: [emitDtsPlugin()],
});
