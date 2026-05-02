import { Box, Typography } from "@mui/material";
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
    <Typography variant="body2">
      {`${properties.name}: ${properties.pan.toFixed(2)}p ${properties.tilt.toFixed(2)}t `}
      <Box
        component="span"
        sx={{ color: "text.secondary" }}
      >{`${properties.zoom.toFixed(0)}z ${properties.focus.toFixed(0)}f`}</Box>
    </Typography>
  );
};
