import { Chip, Fade, Paper, Popper, Typography } from "@mui/material";
import type { CamType } from "./cams";

export const HotspotTooltip: React.FC<{
  open: boolean;
  preset: string;
  cam: CamType;
  parent: HTMLElement | undefined | null;
}> = ({ open, preset, cam, parent }) => {
  const screenshot = globalThis.presetscreenshots?.[cam][preset];

  const el = parent?.querySelector(`[data-name="${preset}"]`);
  if (!el || !preset) {
    return null;
  }

  return (
    <Popper
      open={open}
      key={preset}
      anchorEl={el}
      sx={{ pointerEvents: "none" }}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Paper
            elevation={16}
            sx={{
              overflow: "hidden",
              width: 640,
              height: 360,
              pointerEvents: "none",
            }}
          >
            {screenshot ? (
              <img
                src={screenshot}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt={preset}
              />
            ) : (
              <Typography variant="caption" sx={{ m: 3 }}>
                Screenshot Missing
              </Typography>
            )}
            <Chip
              label={preset}
              size="small"
              color="primary"
              sx={{ position: "absolute", bottom: 4, right: 4 }}
            />
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};
