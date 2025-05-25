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
] as const;
export type CamType = (typeof cams)[number];
