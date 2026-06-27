import { resolve } from "path";
import { defineConfig } from "vite";

const dirname = new URL(".", import.meta.url).pathname;

export default defineConfig(() => {
  return defineConfig({
    root: "src",
    base: "/",
    publicDir: false,
    clearScreen: false,
    build: {
      outDir: resolve(dirname, "dist"),
      emptyOutDir: true,
      target: ["chrome124", "firefox140"],
      assetsInlineLimit: 0,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1024 * 1024,
      modulePreload: false,
      rolldownOptions: {
        output: {
          comments: {
            annotation: true,
            jsdoc: false,
            legal: false,
          },
          entryFileNames: "[hash].js",
          assetFileNames: "[hash][extname]",
          chunkFileNames: "[hash].js",
        },
      },
    },
    server: {
      allowedHosts: true,
    },
  });
});
