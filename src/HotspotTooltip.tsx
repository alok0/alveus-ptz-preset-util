import {
  Chip,
  Fade,
  Paper,
  Popper,
  Typography,
  type PopperProps,
} from "@mui/material";
import { useEffect, useRef } from "react";
import type { CamType } from "./cams";

export const HotspotTooltip: React.FC<{
  open: boolean;
  preset: string;
  cam: CamType;
  parent: HTMLElement | undefined | null;
}> = ({ open, preset, cam, parent }) => {
  const screenshot = globalThis.presetscreenshots?.[cam][preset];
  const popperRef: PopperProps["popperRef"] = useRef(null);
  useEffect(() => {
    if (open) {
      const h = setInterval(() => {
        void popperRef.current?.update();
      }, 500);
      return () => {
        clearInterval(h);
      };
    }
    return () => {};
  }, [open]);

  const el = parent?.querySelector(`[data-name="${preset}"]`);
  if (!el || !preset) {
    return null;
  }

  return (
    <Popper
      popperRef={popperRef}
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
            sx={(theme) => ({
              overflow: "hidden",
              width: 640,
              height: 360,
              pointerEvents: "none",

              [theme.breakpoints.down("lg")]: {
                width: 240,
                height: 135,
              },
            })}
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
