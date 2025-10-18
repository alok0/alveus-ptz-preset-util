import clsx from "clsx";
import { Nav } from "./Nav";
import frame from "./wolfc-frame.webp";

const ZoomLevel: React.FC<{ level: number; rectClasses?: string }> = ({
  level,
  rectClasses,
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
        <div className="text-base-content text-4xl m-4">{level}</div>
      </foreignObject>
      <rect
        width={1920 / mult}
        height={1080 / mult}
        x={-1920 / mult / 2}
        y={-1080 / mult / 2}
        fillOpacity={0}
        className={clsx("stroke-success", rectClasses)}
      />
    </>
  );
};

export const ZoomVisual: React.FC = () => {
  return (
    <>
      <div
        className="absolute inset-0 bg-base-300 text-base-content p-2 md:p-4 grid gap-2"
        style={{ gridTemplateRows: "auto 1fr" }}
      >
        <Nav />
        <div className="bg-base-100 border-base-300 grid overflow-hidden">
          <svg viewBox="-1920 -1080 3840 2160" className="w-full h-full">
            <image href={frame} width={1920} height={1080} x={-960} y={-540} />
            <ZoomLevel rectClasses="opacity-0" level={100} />

            <ZoomLevel level={50} />
            <ZoomLevel level={60} />
            <ZoomLevel level={75} />
            <ZoomLevel level={125} />
            <ZoomLevel level={150} />
            <ZoomLevel level={200} />
            <ZoomLevel level={300} />
            <ZoomLevel level={400} />
            <ZoomLevel level={800} />
          </svg>
        </div>
      </div>
    </>
  );
};
