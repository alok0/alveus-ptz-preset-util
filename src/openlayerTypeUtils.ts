import { z } from "zod";

export const PixelType = z.tuple([z.number(), z.number()]);
export const ObjectWithPixel = z.object({
  pixel: PixelType,
});

export const multiworldWrap = (pan: number | undefined | null) => {
  if (!pan || !Number.isFinite(pan)) {
    return undefined;
  }

  let value = pan;

  while (value > 180) {
    value -= 360;
  }
  while (value < -180) {
    value += 360;
  }
  return value;
};
