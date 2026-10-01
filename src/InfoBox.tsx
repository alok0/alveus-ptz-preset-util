import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { ChallengeLogin } from "./ChallengeLogin";

export const InfoBox: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Info">
        <IconButton
          size="small"
          sx={{ mx: 1 }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <HelpCenterIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onClick={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>alveus-ptz-preset-util</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is a work in progress proof of concept.
          </DialogContentText>
          <DialogContentText>
            The goal here is to provide a visual reference for the camera
            presets. So that it is easier to find the preset you want.
          </DialogContentText>
        </DialogContent>

        <DialogTitle>Caveats</DialogTitle>
        <DialogContent>
          <DialogContentText component="ul">
            <li>The preset data might be out of date</li>
            <li>The images are not great</li>
            <li>
              Zoom diagram is not "to scale" because zoom appears to vary
              depending on camera model and current zoom level
            </li>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <ChallengeLogin />
          <Box sx={{ flexGrow: 1 }} />
        </DialogActions>
      </Dialog>
    </>
  );
};
