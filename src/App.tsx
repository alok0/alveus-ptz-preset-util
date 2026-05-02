import { useEffect, useMemo } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Route, Router, Switch, useLocation, useRoute } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cams } from "./cams";
import { Map } from "./Map";
import { ZoomVisual } from "./ZoomVisual";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { NavWrapper } from "./Nav";

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
      <Map cam={cam} />
    </>
  );
};

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "32px",
        overflow: "scroll",
        backgroundColor: "#100",
        color: "#f007",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBlock: "16px" }}>Error occured</h1>
      <p style={{ marginBlock: "8px" }}>{String(error)}</p>
      <p style={{ whiteSpace: "pre", fontSize: ".75rem" }}>
        {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
      </p>
    </div>
  );
};

export const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router hook={useHashLocation}>
        <ThemeProvider theme={theme}>
          <NavWrapper>
            <Switch>
              <Route path="/cam" component={AppMain} />
              <Route path="/zoom-visual" component={ZoomVisual} />
              <Route>
                {/* fallback */}
                <AppMain />
              </Route>
            </Switch>
          </NavWrapper>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};
