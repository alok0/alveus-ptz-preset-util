import { useLocalStorage } from "usehooks-ts";

export const useDevModeState = () =>
  useLocalStorage("a:d-m-01", false, {
    serializer: (v) => (v ? "93" : ""),
    deserializer: (v) => v === "93",
  });
