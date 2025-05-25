import { useEffect, useMemo } from "react";
import { Map } from "./Map";
import { Welcome } from "./Welcome";
import { Route, useLocation, useRoute } from "wouter";
import { cams } from "./cams";
import { useHashLocation } from "wouter/use-hash-location";
import { Router } from "wouter";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

export const AppMain = () => {
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

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <div className="absolute inset-0 p-8 overflow-scroll bg-error-content text-error">
      <h1 className="text-2xl my-2">Error occured</h1>
      <p className="text-sm my-1">{String(error)}</p>
      <p className="whitespace-pre text-sm">
        {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
      </p>
    </div>
  );
};

export const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router hook={useHashLocation}>
        <AppMain />
      </Router>
    </ErrorBoundary>
  );
};
