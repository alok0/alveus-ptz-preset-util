import path from "node:path";
import { cams } from "../src/cams.ts";
import database from "../src/database.json" with { type: "json" };
import fs from "node:fs/promises";
import { URL } from "node:url";
import sharp from "sharp";

const dirname = new URL(".", import.meta.url).pathname;

const outputDir = path.resolve(dirname, "../src/preset-screenshots");

const alveusggMisnamedCamerasMapping = new Map([
  ["crowindoor", "crowin"],
  ["crow", "crowout"],
  ["marmoset", "marmout"],
  ["marmosetindoor", "marmin"],
  ["macaw", "macaws"],
  ["parrot", "littles"],
  ["roach", "roaches"],
]);

const generateImageName = (...keys: string[]) => {
  return keys.join("__").replaceAll(/[^a-zA-Z0-9]/g, "_");
};

for await (const file of fs.glob([
  path.resolve(outputDir, "*.png"),
  path.resolve(outputDir, "*.avif"),
  path.resolve(outputDir, "*.webp"),
])) {
  await fs.rm(file);
}

const presetsFlat = cams.flatMap((cam) =>
  Object.keys(database[cam].presets).map((preset) => ({
    cam,
    preset,
    fname: generateImageName(cam, preset),
  })),
);

const imports = await Promise.all(
  presetsFlat.map(async ({ cam, preset, fname }) => {
    try {
      const filename = path.resolve(
        dirname,
        "../alveusgg/apps/website/src/assets/presets",
        alveusggMisnamedCamerasMapping.get(cam) || cam,
        preset + ".png",
      );
      const stat = await fs.stat(filename);

      if (!stat.isFile()) {
        throw new Error(`${filename} not a file?`);
      }

      await sharp(filename)
        .webp({ quality: 50, effort: 6, preset: "photo" })
        .toFile(path.resolve(outputDir, fname + ".webp"));

      return `import ${fname} from "./${fname}.webp";`;
    } catch (e) {
      console.log(cam, preset, JSON.stringify(e));

      return `const ${fname} = null;`;
    }
  }),
);

const outputCode = [
  ...imports,
  `export const screenshots: Record<string,Record<string,string|null>> = {`,
  ...cams.flatMap((cam) => [
    `  "${cam}": {`,
    ...presetsFlat
      .filter((p) => p.cam === cam)
      .map(({ preset, fname }) => `    "${preset}":${fname},`),
    `  },`,
  ]),
  `};`,
].join("\n");

await fs.writeFile(path.resolve(outputDir, "screenshots.ts"), outputCode);
