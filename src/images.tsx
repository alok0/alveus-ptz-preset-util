import { CamType } from "./cams";
import fox_pano from "./fox_pano.webp";
import wolfcorner_pano from "./wolfcorner_pano.webp";
import pasture_pano from "./pasture_pano.webp";
import wolf_pano from "./wolf_pano.webp";
import parrot_pano from "./parrot_pano.webp";
import marm_pano from "./marm_pano.webp";
import marmin_pano from "./marmin_pano.webp";

const images: Record<string, string> = {
  fox: fox_pano,
  wolfcorner: wolfcorner_pano,
  wolf: wolf_pano,
  pasture: pasture_pano,
  parrot: parrot_pano,
  marmoset: marm_pano,
  marmosetindoor: marmin_pano,
};

export const getImage = (name: CamType) => {
  return images[name] || null;
};
