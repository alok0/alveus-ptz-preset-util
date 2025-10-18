import clsx from "clsx";
import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import { cams, isCamHidden } from "./cams";

export const Nav: React.FC = () => {
  const [, params] = useRoute("/cam/:cam");
  const cam = useMemo(() => cams.find((c) => c === params?.cam), [params?.cam]);
  const [zoomVisualMatch] = useRoute("/zoom-visual");

  return (
    <div className="tabs tabs-border">
      <Link
        className={clsx("tab", { "tab-active": zoomVisualMatch })}
        href={`/zoom-visual`}
      >
        Zoom
      </Link>
      {cams
        .filter((c) => !(isCamHidden(c) && cam !== c))
        .map((c) => (
          <Link
            key={c}
            className={clsx("tab", { "tab-active": cam === c })}
            href={`/cam/${c}`}
          >
            {c}
          </Link>
        ))}
    </div>
  );
};
