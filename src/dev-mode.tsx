import { useLocalStorage } from "usehooks-ts";
import { useHotkeySequence } from "@tanstack/react-hotkeys";

export const useDevModeState = () =>
  useLocalStorage("a:d-m-01", false, {
    serializer: (v) => (v ? "93" : ""),
    deserializer: (v) => v === "93",
  });

export const DevModeHotkey: React.FC = () => {
  const [, setDevMode] = useDevModeState();
  useHotkeySequence(
    [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "B",
      "A",
      "Enter",
    ],
    () => {
      setDevMode((v) => !v);
    },
    { timeout: 10_000 },
  );

  return null;
};
