export const cams = [
  "pasture",
  "garden",
  "wolfcorner",
  "wolf",
  "wolfswitch",
  "wolfindoor",
  "fox",
  "crow",
  "crowindoor",
  "marmoset",
  "marmosetindoor",
  "chicken",
  "chickenindoor",
  "pushpop",
  "pushpopindoor",
  "georgie",
  "toast",
  "noodle",
  "roach",
  "marty",
  "patchy",
  "emu",
  "parrot",
  "macaw",
] as const;
export type CamType = (typeof cams)[number];

const HiddenCams = new Set([
  "noodle",
  "roach",
  "marty",
  "patchy",
  "marmosetindoor",
]);

export const isCamHidden = (v: string) => HiddenCams.has(v);
