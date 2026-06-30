import { Box, Typography } from "@mui/material";

export const PresetTooltip: React.FC<{
  data: {
    name: string;
    pan: number;
    tilt: number;
    zoom: number;
    focus: number;
  };
}> = ({ data }) => {
  return (
    <Typography variant="body2">
      {`${data.name}: ${data.pan.toFixed(2)}p ${data.tilt.toFixed(2)}t `}
      <Box
        component="span"
        sx={{ color: "text.secondary" }}
      >{`${data.zoom.toFixed(0)}z ${data.focus.toFixed(0)}f`}</Box>
    </Typography>
  );
};
