import { Paper } from "@mui/material";
import chinCamCheatSheet from "./chin-camera-locations.svg";

export const ChinCams: React.FC = () => {
  return (
    <Paper
      square
      elevation={1}
      sx={{
        gridArea: "CONTENT",
        overflow: "hidden",
      }}
    >
      <img
        src={chinCamCheatSheet}
        alt="diagram of chin enclosure"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Paper>
  );
};
