import { z } from "zod/v4";

const CoercedNumber = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value))
  .refine((value) => Number.isFinite(value));

const Preset = z.object({
  pan: CoercedNumber,
  tilt: CoercedNumber,
  zoom: CoercedNumber.check(z.nonnegative()),
  focus: CoercedNumber,
});

export const CamData = z.object({
  presets: z.record(z.string(), Preset),
});
