export const cams = [
  "pasture",
  "pasturelower",
  "garden",
  "wolfcorner",
  "wolf",
  "wolfswitch",
  "wolfindoor",
  "fox",
  "foxcovered",
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
  "emucover",
  "parrot",
  "macaw",
  "serval",
  "servalindoor",
  "event",
] as const;
export type CamType = (typeof cams)[number];

const HiddenCams = new Set([
  "noodle",
  "roach",
  "marty",
  "patchy",
  "event",
  "serval",
]);

export const isCamHidden = (v: string) => HiddenCams.has(v);
