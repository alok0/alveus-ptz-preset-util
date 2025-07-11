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
] as const;
export type CamType = (typeof cams)[number];
