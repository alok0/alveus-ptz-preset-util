import { Paper, Popper, Typography } from "@mui/material";
import { Feature, Graticule } from "ol";
import type { FeatureLike } from "ol/Feature";
import olMap from "ol/Map";
import View from "ol/View";
import type { Listener } from "ol/events";
import { Point } from "ol/geom";
import LayerGroup from "ol/layer/Group";
import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import Static from "ol/source/ImageStatic";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import TextStyle from "ol/style/Text";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Nav, NavWrapper } from "./Nav";
import { CamData } from "./Preset";
import { PresetTooltip } from "./PresetTooltip";
import { type CamType } from "./cams";
import database from "./database";
import { getImage } from "./images";
import { multiworldWrap, ObjectWithPixel } from "./openlayerTypeUtils";

export const Map = ({ cam }: { cam: CamType }) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const map = useMemo(
    () =>
      new olMap({
        view: new View({
          projection: "EPSG:4326",
          center: [0, 0],
          zoom: 2,
          constrainRotation: 1,
        }),
      }),
    [],
  );

  useEffect(() => {
    const features = Object.entries(CamData.parse(database[cam]).presets)
      .filter(([name]) => name !== "temp" && name !== "tmp")
      .map(
        ([name, data]) =>
          new Feature({
            geometry: new Point([data.pan, data.tilt]),
            name,
            zoom: data.zoom,
            pan: data.pan,
            tilt: data.tilt,
            focus: data.focus,
          }),
      );
    features.forEach((f) => f.setId(window.crypto.randomUUID()));

    const vectorSource = new VectorSource({ features });

    const layerStyle = (f: FeatureLike) => {
      const zoom: unknown = f.get("zoom");
      const scaledZoom =
        100 -
        Math.round(typeof zoom === "number" && zoom < 900 ? zoom / 10 : 90);

      return new Style({
        zIndex: scaledZoom,
        text: new TextStyle({
          text: String(f.get("name") || ""),
          font: 'bold 12px "JetBrains Mono Variable",monospace',
          fill: new Fill({
            color: "#000",
          }),
          stroke: new Stroke({
            color: `hsl(285 ${scaledZoom}% 80%)`,
            width: 3 + (3 * scaledZoom) / 100,
          }),
        }),
      });
    };

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: layerStyle,
    });

    const background = new LayerGroup({
      opacity: 0.7,
    });
    const backgroundImage = getImage(cam);
    if (backgroundImage) {
      [0, 1, -1, 2, -2, 3, -3].forEach((world) => {
        const worldOffset = 360 * world;
        background.getLayers().push(
          new ImageLayer({
            source: new Static({
              url: backgroundImage,
              imageExtent: [-180 + worldOffset, -80, 180 + worldOffset, 80],
              interpolate: true,
            }),
          }),
        );
      });
    }

    map.setLayers([
      background,
      new Graticule({
        opacity: 0.15,
        strokeStyle: new Stroke({
          color: "#fff",
          width: 2,
          lineDash: [0.5, 4],
        }),
        showLabels: false,
        wrapX: true,
      }),
      vectorLayer,
    ]);

    const findPoint = (name: string) =>
      vectorSource
        .getFeatures()
        .find(
          (f) =>
            String(f.get("name")).toLocaleLowerCase() ===
            name.toLocaleLowerCase(),
        )
        ?.getGeometry()
        ?.getExtent();

    const home =
      findPoint("home") ||
      findPoint("center") ||
      findPoint("middle") ||
      findPoint("left") ||
      findPoint("right") ||
      vectorSource
        .getFeatures()
        .map((f) => f.getGeometry()?.getExtent())
        .find(Boolean);

    if (home) {
      map.getView().fit(home, { maxZoom: 5 });
    }
  }, [cam, map]);

  useEffect(() => {
    if (ref) {
      map.setTarget(ref);
    }
  }, [map, ref]);

  const [coord, setCoord] = useDebounceValue<{
    pan: number;
    tilt: number;
  } | null>(null, 64, { maxWait: 128 });

  const coordDisplay = useMemo(
    () =>
      !coord ? "" : `${coord.pan?.toFixed(2)}p ${coord.tilt?.toFixed(2)}t`,
    [coord],
  );

  const hoveredFeatures = useMemo(() => {
    if (!coord) {
      return [];
    }

    return map
      .getFeaturesAtPixel(map.getPixelFromCoordinate([coord.pan, coord.tilt]), {
        checkWrapped: true,
        hitTolerance: 16,
      })
      .filter(
        (f) =>
          typeof f.get("zoom") === "number" &&
          typeof f.get("pan") === "number" &&
          typeof f.get("tilt") === "number" &&
          typeof f.get("name") === "string",
      )
      .toSorted((a, b) => a.get("zoom") - b.get("zoom"))
      .slice(0, 5);
  }, [coord, map]);

  useEffect(() => {
    // openlayers typescript support sucks
    const handlePointermove: Listener = (e) => {
      const coord = map.getCoordinateFromPixel(ObjectWithPixel.parse(e).pixel);
      const pan = multiworldWrap(coord[0]);
      const tilt = coord[1];

      setCoord(pan && tilt ? { pan, tilt } : null);
    };

    map.addEventListener("pointermove", handlePointermove);
    return () => {
      map.removeEventListener("pointermove", handlePointermove);
    };
  }, [map, setCoord]);

  return (
    <NavWrapper>
      <Nav />
      <Popper open anchorEl={ref} placement="bottom-start" disablePortal>
        <div ref={anchorRef} />
      </Popper>
      {!!coordDisplay && (
        <>
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
              {hoveredFeatures.map((f) => (
                <PresetTooltip feature={f} key={f.getId()} />
              ))}
              <Typography variant="body2">{coordDisplay}</Typography>
            </Paper>
          </Popper>
        </>
      )}

      <Paper
        square
        ref={setRef}
        elevation={1}
        sx={{
          gridArea: "CONTENT",
          "--ol-background-color": (theme) => theme.palette.background.default,
          "--ol-accent-background-color": (theme) => theme.palette.primary.main,
          "--ol-subtle-background-color": (theme) =>
            theme.palette.background.default,
          "--ol-partial-background-color": (theme) =>
            theme.palette.background.default,
          "--ol-foreground-color": (theme) => theme.palette.text.secondary,
          "--ol-subtle-foreground-color": (theme) =>
            theme.palette.text.disabled,
          "--ol-brand-color": (theme) => theme.palette.primary.main,
        }}
      />
    </NavWrapper>
  );
};

export default Map;
