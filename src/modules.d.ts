import type { CamType } from "./cams";
import type { CamDataInputType } from "./Preset";

export declare global {
  var presetdb: Record<CamType, CamDataInputType> | undefined;
}
