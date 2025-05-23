import { Feature, Graticule } from "ol";
import type { FeatureLike } from "ol/Feature";
import olMap from "ol/Map";
import View from "ol/View";
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
import { useEffect, useState } from "react";
import { cams, CamType } from "./cams";
import database from "./database.json";
import { getImage } from "./images";

export const Map = () => {
  const [cam, setCam] = useState<CamType>("pasture");
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [map] = useState(
    () =>
      new olMap({
        view: new View({
          projection: "EPSG:4326",
          center: [0, 0],
          zoom: 2,
        }),
      }),
  );

  useEffect(() => {
    const features = Object.entries(database[cam].presets).map(
      ([name, data]) =>
        new Feature({
          geometry: new Point([Number(data.pan), Number(data.tilt)]),
          name,
          zoom: Number(data.zoom),
        }),
    );

    const vectorSource = new VectorSource({ features });

    const layerStyle = (f: FeatureLike) => {
      const zoom: unknown = f.get("zoom");

      return new Style({
        text: new TextStyle({
          text: String(f.get("name") || ""),
          font: 'bold 12px "JetBrains Mono Variable",monospace',
          fill: new Fill({
            color: "black",
          }),
          stroke: new Stroke({
            color: typeof zoom === "number" && zoom < 1000 ? "#ffc" : "#fff",
            width: 3,
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
      findPoint("right");
    if (home) {
      map.getView().fit(home, { maxZoom: 5 });
    }
  }, [cam, map]);

  useEffect(() => {
    if (ref) {
      map.setTarget(ref);
    }
  }, [map, ref]);

  return (
    <div
      className="absolute inset-0 bg-base-300 text-base-content p-2 md:p-4 grid gap-2"
      style={{ gridTemplateRows: "auto 1fr" }}
    >
      <div className="tabs tabs-border">
        {cams.map((c) => (
          <input
            key={c}
            type="radio"
            name={c}
            className="tab"
            aria-label={c}
            checked={cam === c}
            onClick={() => setCam(c)}
          />
        ))}
      </div>

      <div className="bg-base-100 border-base-300" ref={setRef}></div>
    </div>
  );
};
