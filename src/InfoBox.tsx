import { mdiInformationVariant } from "@mdi/js";
import { useRef } from "react";

export const InfoBox: React.FC = () => {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="btn btn-circle btn-xs text-secondary-content"
        onClick={() => {
          ref.current?.showModal();
        }}
      >
        <svg viewBox="0 0 24 24">
          <path fill="currentcolor" d={mdiInformationVariant} />
        </svg>
      </button>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <h2 className="text-lg my-2">alveus-ptz-preset-util</h2>
          <p>This is a work in progress proof of concept.</p>
          <p>
            The goal here is to provide a visual reference for the camera
            presets. So that it is easier to find the preset you want.
          </p>
          <h3 className="font-semibold">Caveats</h3>
          <ul className="list-inside list-disc">
            <li>The preset data is out of date</li>
            <li>The images suck</li>
            <li>
              Zoom diagram is not "to scale" because zoom appears to vary
              depending on camera model and current zoom level
            </li>
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop backdrop-blur-xs">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
