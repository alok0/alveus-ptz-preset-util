import { useEffect, useMemo } from "react";
import { Map } from "./Map";
import { Welcome } from "./Welcome";
import { Route, useLocation, useRoute } from "wouter";
import { cams } from "./cams";

export const App = () => {
  const [match, params] = useRoute("/cam/:cam");
  const [, navigate] = useLocation();

  const cam = useMemo(() => cams.find((c) => c === params?.cam), [params?.cam]);

  useEffect(() => {
    if (!match || !cam) {
      navigate(`/cam/${cams[0]}`, { replace: true });
    }
  }, [cam, match, navigate]);

  if (!cam) {
    return null;
  }

  return (
    <>
      <Route path="/cam" nest>
        <Welcome />
        <Map cam={cam} />
      </Route>
    </>
  );
};
