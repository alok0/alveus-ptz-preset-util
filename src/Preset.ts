import { number, object, record, string, union } from "zod";

const CoercedNumber = union([string(), number()])
  .refine((value) => Number.isFinite(Number(value)))
  .transform((value) => Number(value));

const Preset = object({
  pan: CoercedNumber,
  tilt: CoercedNumber,
  zoom: CoercedNumber,
  focus: CoercedNumber,
});

export const CamData = object({
  presets: record(Preset),
});
