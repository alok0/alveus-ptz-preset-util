import { createHash } from "crypto";
import { readFile, writeFile } from "fs/promises";
import path, { resolve } from "path";
import { defineConfig } from "vite";

const dirname = new URL(".", import.meta.url).pathname;

export default defineConfig(() => {
  const headers = {
    "Content-Security-Policy":
      "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob:",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "credentialless",
  } as const;

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
        closeBundle: async () => {
          const filename = path.resolve(dirname, "dist/index.html");
          const indexContent = await readFile(filename, { encoding: "utf8" });
          const m = indexContent.match(
            /<script type="importmap">(?<content>.+)<\/script>/u,
          );
          const importmapcontent = m?.groups?.["content"];
          if (!importmapcontent) {
            throw new Error("could not find importmap");
          }
          const hasher = createHash("sha256");
          hasher.update(importmapcontent);
          const digest = hasher.digest("base64");

          const generatedHeaders = {
            ...headers,
            "Content-Security-Policy": `default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob:; script-src 'self' 'sha256-${digest}';`,
          };
          const headerContent =
            "/*\n" +
            Object.entries(generatedHeaders)
              .map(([k, v]) => `  ${k}: ${v}`)
              .join("\n");

          await writeFile(
            path.resolve(dirname, "dist/_headers"),
            headerContent,
          );
          console.info("Headers:\n\n", headerContent);
        },
      },
    ],
    server: {
      allowedHosts: true,
      headers,
    },
  });
});
