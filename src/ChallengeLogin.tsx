import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import challange_image from "./challenge.svg";
import { useRef, useState } from "react";
import { useDevModeState } from "./dev-mode";

export const ChallengeLogin: React.FC = () => {
  const [, setDevMode] = useDevModeState();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        sx={{ opacity: (theme) => theme.palette.action.disabledOpacity }}
      >
        Lorem Ipsum
      </Button>
      <Dialog open={loading}>
        <CircularProgress sx={{ m: 4, p: 4 }} />
      </Dialog>
      <Modal open={open}>
        <Paper
          sx={{
            height: "100vh",
            width: "95vw",
            margin: "auto",
            overflow: "auto",
          }}
          elevation={24}
        >
          <Box
            sx={(theme) => ({
              display: "grid",
              [theme.breakpoints.up("md")]: {
                gridTemplateColumns: "auto 1fr",
              },
              gap: 2,
            })}
          >
            <img src={challange_image} alt="diagram" style={{ height: 1500 }} />
            <Box
              sx={{ m: 2, display: "flex", flexDirection: "column", gap: 2 }}
              ref={ref}
            >
              <TextField
                label="A"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="B"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="C"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="D"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="E"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="F"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="G"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="H"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="I"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="J"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="K"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="L"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <TextField
                label="M"
                variant="filled"
                sx={{ width: "30ch" }}
                className="ina"
              />
              <Button
                variant="contained"
                sx={{ maxWidth: "30ch" }}
                onClick={() => {
                  setLoading(true);
                  const result = JSON.stringify(
                    [
                      ...(ref.current?.querySelectorAll(".ina input") || []),
                    ].map((e) => e instanceof HTMLInputElement && e.value),
                  );
                  const expected = JSON.stringify([
                    "wolfswitch",
                    "wolfindoor",
                    "wolf",
                    "wolfcorner",
                    "fox",
                    "foxcovered",
                    "foxindoor",
                    "wolfden",
                    "wolfden2",
                    "pushpopindoor",
                    "servalindoor",
                    "servalcorner",
                    "serval",
                  ]);
                  setTimeout(() => {
                    if (result === expected) {
                      setDevMode(true);
                    } else {
                      setDevMode(false);
                    }
                    window.location.reload();
                  }, 10_000);
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};
