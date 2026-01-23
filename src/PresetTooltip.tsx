import type { FeatureLike } from "ol/Feature";
import { z } from "zod";

const FeatureProperties = z.object({
  pan: z.number(),
  tilt: z.number(),
  zoom: z.number(),
  focus: z.number(),
  name: z.string().nonempty(),
});

export const PresetTooltip = ({ feature }: { feature: FeatureLike }) => {
  const result = FeatureProperties.safeParse(feature.getProperties());
  if (!result.success) {
    return <></>;
  }
  const properties = result.data;

  return (
    <p>
      {`${properties.name}: ${properties.pan.toFixed(2)}p ${properties.tilt.toFixed(2)}t `}
      <span className="opacity-35">{`${properties.zoom.toFixed(0)}z ${properties.focus.toFixed(0)}f`}</span>
    </p>
  );
};
