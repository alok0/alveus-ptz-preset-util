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
    resolve: {
      alias: [
        { find: "react", replacement: "preact/compat" },
        { find: "react-dom/test-utils", replacement: "preact/test-utils" },
        { find: "react-dom", replacement: "preact/compat" },
        { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
      ],
    },
    server: {
      allowedHosts: true,
      headers: {
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob:",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "credentialless",
      },
    },
  });
});
