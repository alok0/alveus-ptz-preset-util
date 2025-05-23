import { useEffect, useState } from "react";

export const Welcome = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = () => {
      setDismissed(true);
    };
    document.body.addEventListener("click", handler);
    return () => {
      document.body.removeEventListener("click", handler);
    };
  }, []);

  if (dismissed) {
    return null;
  }
  return (
    <div className="toast toast-top toast-center z-50">
      <div className="card bg-base-100 min-w-sm max-w-lg shadow-md">
        <div className="card-body">
          <h2 className="card-title">alveus-ptz-preset-util</h2>
          <p>This is a work in progress proof of concept.</p>
          <p>
            The goal here is to provide a visual reference for the camera
            presets. So that it is easier to find the preset you want.
          </p>
          <h3 className="font-semibold">Caveats</h3>
          <ul className="list-inside list-disc">
            <li>Not all the reference panoramas have been made yet</li>
            <li>The preset data is out of date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
