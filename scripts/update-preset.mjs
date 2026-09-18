import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { URL } from "node:url";
import * as prettier from "prettier";
import { z } from "zod/v4";

const root = new URL("..", import.meta.url).pathname;
const databasePath = resolve(root, "src/database.json");

const matchType = z.object({
  cam: z.string(),
  pan: z.coerce.number(),
  tilt: z.coerce.number(),
  zoom: z.coerce.number(),
  focus: z.coerce.number(),
});

const checkGitClean = () => {
  const status = execFileSync("git", ["status", "--porcelain"], {
    encoding: "utf-8",
    cwd: root,
  });
  if (status.trim()) {
    throw new Error(
      "git working tree is not clean; commit or stash changes before running",
    );
  }
};

void (async () => {
  checkGitClean();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const info = await rl.question("paste ptz info: ");
  console.log(JSON.stringify(info));

  const match = info.match(
    /\((?<cam>\S+)\): (?<pan>\S+)p \|(?<tilt>\S+)t \|(?<zoom>\S+)z \|af (off|on) \|(?<focus>\S+)f/,
  );
  if (!match) {
    throw new Error("input does not match expected pattern");
  }
  const { cam, pan, tilt, zoom, focus } = await matchType.parseAsync(
    match?.groups,
  );

  const preset = await rl.question("preset name: ");
  console.log(JSON.stringify(preset));

  const data = JSON.parse(await readFile(databasePath, { encoding: "utf-8" }));

  if (!data[cam].presets[preset]) {
    data[cam].presets[preset] = {};
  }
  data[cam].presets[preset].pan = pan;
  data[cam].presets[preset].tilt = tilt;
  data[cam].presets[preset].zoom = zoom;
  data[cam].presets[preset].focus = focus;

  checkGitClean();
  await writeFile(
    databasePath,
    await prettier.format(JSON.stringify(data), {
      ...(await prettier.resolveConfig(databasePath)),
      filepath: databasePath,
    }),
  );

  execFileSync("git", ["add", databasePath], { stdio: "inherit", cwd: root });
  execFileSync(
    "git",
    ["commit", "-m", `manually update data for preset ${cam}/${preset}`],
    { stdio: "inherit", cwd: root },
  );

  process.exit(0);
})();
