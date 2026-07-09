import { createHash, randomUUID } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import path, { resolve } from "path";
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
      chunkImportMap: true,
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
    plugins: [
      {
        name: "csp allowlist importmap",
        apply: "build",
        buildEnd: () =>
          void setTimeout(() => {
            const filename = path.resolve(dirname, "dist/index.html");
            const indexContent = readFileSync(filename, { encoding: "utf8" });
            const m = indexContent.match(
              /<script type="importmap">(?<content>.+)<\/script>/,
            );
            const importmapcontent = m?.groups?.["content"];
            if (!importmapcontent) {
              throw new Error("could not find importmap");
            }
            const hasher = createHash("sha256");
            hasher.update(importmapcontent);
            const digest = hasher.digest("base64");
            writeFileSync(
              path.resolve(dirname, "dist/_headers"),
              `
/*
  Content-Security-Policy: "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob:; script-src 'self' 'sha256-${digest}'"
`,
            );
          }, 300),
      },
    ],
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
