import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcssPlugin from "@tailwindcss/vite";

const dirname = new URL(".", import.meta.url).pathname;

export default defineConfig(() => {
  return defineConfig({
    root: "src",
    base: "/",
    publicDir: false,
    clearScreen: false,
    esbuild: {
      legalComments: "eof",
      jsx: "automatic",
    },
    build: {
      outDir: resolve(dirname, "dist"),
      emptyOutDir: true,
      target: ["chrome111", "firefox128"],
      assetsInlineLimit: 0,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1024 * 1024,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks: (f) => {
            if (f.includes("src/database")) {
              return "db";
            }
            return "";
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
    plugins: [tailwindcssPlugin()],
  });
});
