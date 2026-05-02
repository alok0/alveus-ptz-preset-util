import { Box, Paper, Typography } from "@mui/material";
import { Nav, NavWrapper } from "./Nav";
import frame from "./wolfc-frame.webp";

const ZoomLevel: React.FC<{ level: number; hideRect?: boolean }> = ({
  level,
  hideRect,
}) => {
  const mult = level / 100.0;

  return (
    <>
      <foreignObject
        x={-1920 / mult / 2}
        y={-1080 / mult / 2}
        height={64}
        width={256}
      >
        <Typography component="div" variant="h3">
          {level}
        </Typography>
      </foreignObject>
      {!hideRect && (
        <Box
          component="rect"
          width={1920 / mult}
          height={1080 / mult}
          rx={8}
          x={-1920 / mult / 2}
          y={-1080 / mult / 2}
          fillOpacity={0}
          sx={{
            stroke: (theme) => theme.palette.primary.main,
            strokeWidth: 3,
          }}
        />
      )}
    </>
  );
};

export const ZoomVisual: React.FC = () => {
  return (
    <>
      <NavWrapper>
        <Nav />
        <Paper
          square
          elevation={1}
          sx={{
            gridArea: "CONTENT",
            overflow: "hidden",
            display: "grid",
            "& > svg": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <svg viewBox="-1920 -1080 3840 2160">
            <image href={frame} width={1920} height={1080} x={-960} y={-540} />
            <ZoomLevel level={100} hideRect />

            <ZoomLevel level={50} />
            <ZoomLevel level={67} />
            <ZoomLevel level={80} />
            <ZoomLevel level={125} />
            <ZoomLevel level={150} />
            <ZoomLevel level={200} />
            <ZoomLevel level={400} />
            <ZoomLevel level={800} />
          </svg>
        </Paper>
      </NavWrapper>
    </>
  );
};
