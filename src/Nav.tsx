import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  IconButton,
  ListItemButton,
  ListItemText,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useRef, useState, type PropsWithChildren } from "react";
import { Link, useRoute } from "wouter";
import { cams, isCamHidden } from "./cams";
import { InfoBox } from "./InfoBox";

export const NavWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundColor: "background.default",
        color: "text.secondary",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      {children}
    </Box>
  );
};

export const Nav: React.FC = () => {
  const [, params] = useRoute("/cam/:cam");
  const cam = useMemo(() => cams.find((c) => c === params?.cam), [params?.cam]);
  const [zoomVisualMatch] = useRoute("/zoom-visual");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense" disableGutters>
          <Tooltip title="Menu">
            <IconButton
              sx={{ mx: 1 }}
              ref={menuButtonRef}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            alveus-ptz-preset-util
          </Typography>
          <InfoBox />
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={() => menuButtonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        <ListItemButton
          dense
          selected={zoomVisualMatch}
          LinkComponent={Link}
          href="/zoom-visual"
          onClick={() => setOpen(false)}
        >
          <ListItemText>Zoom</ListItemText>
        </ListItemButton>
        {cams
          .filter((c) => !(isCamHidden(c) && cam !== c))
          .map((c) => (
            <ListItemButton
              key={c}
              dense
              selected={cam === c}
              LinkComponent={Link}
              href={`/cam/${c}`}
              onClick={() => setOpen(false)}
            >
              <ListItemText>{c}</ListItemText>
            </ListItemButton>
          ))}
      </Menu>
    </>
  );
};
