export const cams = [
  "pasture",
  "wolfcorner",
  "wolf",
  "wolfswitch",
  "wolfindoor",
  "fox",
  "parrot",
  "crow",
  "crowindoor",
  "marmoset",
  "marmosetindoor",
  "chicken",
  "chickenindoor",
  "pushpop",
  "pushpopindoor",
  "georgie",
] as const;
export type CamType = (typeof cams)[number];
