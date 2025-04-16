import { defineConfig } from "vite";
import arraybuffer from "vite-plugin-arraybuffer";
export default defineConfig({
  assetsInclude: ["**/*.wasm"],
  base: "./", // Use relative paths for assets
  plugins: [arraybuffer()],
  build: {
    // other build options
  },
});
