import type { CamType } from "./cams";
import chicken_pano from "./chicken_pano.webp";
import chickenin_pano from "./chickenin_pano.webp";
import crowin_pano from "./crowin_pano.webp";
import crowout_pano from "./crowout_pano.webp";
import fox_pano from "./fox_pano.webp";
import georgie_pano from "./georgie_pano.webp";
import marm_pano from "./marm_pano.webp";
import marmin_pano from "./marmin_pano.webp";
import parrot_pano from "./parrot_pano.webp";
import pasture_pano from "./pasture_pano.webp";
import pushin_pano from "./pushin_pano.webp";
import pushout_pano from "./pushout_pano.webp";
import wolf_pano from "./wolf_pano.webp";
import wolfcorner_pano from "./wolfcorner_pano.webp";
import wolfindoor_pano from "./wolfindoor_pano.webp";
import wolfswitch_pano from "./wolfswitch_pano.webp";

const images: Record<string, string> = {
  fox: fox_pano,
  wolfcorner: wolfcorner_pano,
  wolf: wolf_pano,
  wolfswitch: wolfswitch_pano,
  wolfindoor: wolfindoor_pano,
  pasture: pasture_pano,
  parrot: parrot_pano,
  marmoset: marm_pano,
  marmosetindoor: marmin_pano,
  crowindoor: crowin_pano,
  crow: crowout_pano,
  chicken: chicken_pano,
  chickenindoor: chickenin_pano,
  pushpop: pushout_pano,
  pushpopindoor: pushin_pano,
  georgie: georgie_pano,
};

export const getImage = (name: CamType) => {
  return images[name] || null;
};
