import { Paper, Popper, Typography } from "@mui/material";
import "pannellum";
import "pannellum/build/pannellum.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounceValue, useResizeObserver } from "usehooks-ts";
import { type CamType } from "./cams";
import { getImage } from "./images";
import { CamData } from "./Preset";
import { PresetTooltip } from "./PresetTooltip";

export const Map = ({ cam }: { cam: CamType }) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Pannellum.Viewer | null>(null);
  useResizeObserver({
    ref: useMemo(() => ({ current: ref || document.body }), [ref]),
    onResize: useCallback(() => viewer?.resize(), [viewer]),
  });
  const hotSpots = useMemo(
    () =>
      Object.entries(CamData.parse(globalThis.presetdb?.[cam]).presets)
        .filter(([name]) => name !== "temp" && name !== "tmp")
        .map(
          ([name, data]) =>
            ({
              data: { name, ...data },
              ...({
                pitch: data.tilt,
                yaw: data.pan,
                text: name,
                cssClass: "hotspot-custom",
                createTooltipFunc: (el) => {
                  el.textContent = name;
                  el.dataset["name"] = name;
                  const scaledZoom =
                    100 - Math.round(data.zoom < 900 ? data.zoom / 10 : 90);
                  el.style.setProperty("--zoom-scale", String(scaledZoom));
                  el.style.setProperty("z-index", String(20100 - data.zoom));
                },
              } satisfies Pannellum.HotspotOptions),
            }) as const,
        ),
    [cam],
  );

  useEffect(() => {
    if (!ref) {
      return;
    }
    const backgroundImage = getImage(cam);

    const findPoint = (name: string) =>
      hotSpots.find(
        (h) => h.text?.toLocaleLowerCase() === name.toLocaleLowerCase(),
      );

    const home =
      findPoint("home") ||
      findPoint("center") ||
      findPoint("middle") ||
      findPoint("left") ||
      findPoint("right") ||
      hotSpots[0];

    const viewer = window.pannellum.viewer(ref, {
      type: "equirectangular",
      autoLoad: true,
      panorama: backgroundImage,
      vaov: 160,
      minPitch: -85,
      maxPitch: 30,
      minHfov: 6,
      maxHfov: 120,
      hfov: 60,
      pitch: home?.pitch || -20,
      yaw: home?.yaw || 0,
      showFullscreenCtrl: false,
      showControls: false,
      hotSpots,
      friction: 0.35,
      strings: {
        bylineLabel: " ",
      },
    });
    queueMicrotask(() => setViewer(viewer));

    return () => {
      setViewer(null);
      viewer.destroy();
    };
  }, [cam, hotSpots, ref]);

  const [coord, setCoord] = useDebounceValue<{
    pan: number;
    tilt: number;
  } | null>(null, 64, { maxWait: 128 });

  const coordDisplay = useMemo(
    () =>
      !coord ? "" : `${coord.pan?.toFixed(2)}p ${coord.tilt?.toFixed(2)}t`,
    [coord],
  );

  const hoveredPresets = useMemo(() => {
    if (!coord || !viewer || !ref) {
      return [];
    }

    const hfov = viewer.getHfov();
    const rect = ref.getBoundingClientRect();
    const degPerPixel = Math.abs(hfov / rect.width);
    const tolerance = Math.pow(32 * degPerPixel, 2);

    return hotSpots
      .filter(
        (h) =>
          Math.pow(h.data.pan - coord.pan, 2) +
            Math.pow(h.data.tilt - coord.tilt, 2) <
          tolerance,
      )
      .toSorted((a, b) => a.data.zoom - b.data.zoom)
      .slice(0, 5);
  }, [coord, hotSpots, ref, viewer]);

  return (
    <>
      <Popper open anchorEl={ref} placement="bottom-start" disablePortal>
        <div ref={anchorRef} />
      </Popper>
      {!!coordDisplay && (
        <Popper
          open
          anchorEl={() => anchorRef.current || document.body}
          placement="top-start"
        >
          <Paper
            square
            elevation={2}
            sx={{
              zIndex: "modal",
              pointerEvents: "none",
              p: 1,
              overflow: "hidden",
            }}
          >
            {hoveredPresets.map((h) => (
              <PresetTooltip data={h.data} key={JSON.stringify(h.data)} />
            ))}
            <Typography variant="body2">{coordDisplay}</Typography>
          </Paper>
        </Popper>
      )}

      <Paper
        square
        ref={setRef}
        elevation={1}
        onContextMenuCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseMove={(e) => {
          const c = viewer?.mouseEventToCoords(e.nativeEvent);

          if (c) {
            setCoord({ pan: c[1], tilt: c[0] });
          } else {
            setCoord(null);
          }
        }}
        onMouseOut={() => {
          setCoord(null);
        }}
        sx={(theme) => ({
          gridArea: "CONTENT",

          "& .hotspot-custom": {
            ...theme.typography.body2,
            fontWeight: 700,
            textShadow: `1px 1px 1px white`,
            backgroundColor: "hsl(285 var(--zoom-scale) 80% / 90%)",
            border: "black 1px solid",
            p: 0.5,
            color: "black",
            pointerEvents: "none",
            lineHeight: 1,
            borderRadius: theme.shape.borderRadius,
          },
          "& canvas": {
            opacity: 0.5,
          },
        })}
      />
    </>
  );
};

export default Map;
