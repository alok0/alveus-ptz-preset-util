import type { CamType } from "./cams";
import type { CamDataInputType } from "./Preset";

export declare global {
  var presetdb: Record<CamType, CamDataInputType> | undefined;
  var presetscreenshots:
    Record<CamType, Record<string, string | null | undefined>> | undefined;
}
