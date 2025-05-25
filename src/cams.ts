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
  "chicken",
] as const;
export type CamType = (typeof cams)[number];
