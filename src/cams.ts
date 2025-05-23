export const cams = [
  "pasture",
  "wolfcorner",
  "wolf",
  "wolfswitch",
  "wolfindoor",
  "fox",
  "parrot",
  "crow",
  "crowoutdoor",
  "marmoset",
  "marmosetindoor",
] as const;
export type CamType = (typeof cams)[number];
