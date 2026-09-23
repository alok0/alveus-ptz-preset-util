import path from "node:path";
import database from "../src/database.json" with { type: "json" };
import fs from "node:fs/promises";
import { URL } from "node:url";
import z from "zod";

const dirname = new URL(".", import.meta.url).pathname;

const outputDir = path.resolve(dirname, "../src/twitch-control/data");

const camSchema = z.object({
  presets: z.record(z.string(), z.object({})),
});
const cams = Object.entries(database)
  .map(([k, v]) => {
    const { data } = camSchema.safeParse(v);
    if (data) {
      return [k, data] as const;
    }
    return undefined;
  })
  .filter((v) => !!v)
  .filter(([, v]) => "home" in v.presets)
  .toSorted(
    ([, a], [, b]) =>
      Object.keys(b.presets).length - Object.keys(a.presets).length,
  )
  .map(([k]) => k);

const presets = Object.fromEntries(
  cams.map((cam) => {
    const { presets } = camSchema.parse(
      (database as Record<string, unknown>)[cam],
    );

    return [cam, Object.keys(presets)] as const;
  }),
);

const outputCode = [
  "export const fullCamList: string[] = ",
  JSON.stringify(cams),
  "export const fullPresetLists: Record<string,string[]> = ",
  JSON.stringify(presets),
].join("\n");

await fs.writeFile(path.resolve(outputDir, "data.ts"), outputCode);
