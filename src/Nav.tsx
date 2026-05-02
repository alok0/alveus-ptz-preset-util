import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
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
        gridTemplateColumns: "auto 1fr",
        gridTemplateAreas: `"APPBAR APPBAR" "NAV CONTENT"`,
      }}
    >
      {children}
    </Box>
  );
};

const MenuContent: React.FC<{ onClose?: () => unknown }> = ({ onClose }) => {
  const [, params] = useRoute("/cam/:cam");
  const cam = useMemo(() => cams.find((c) => c === params?.cam), [params?.cam]);
  const [zoomVisualMatch] = useRoute("/zoom-visual");

  return (
    <>
      <ListItemButton
        dense
        selected={zoomVisualMatch}
        LinkComponent={Link}
        href="/zoom-visual"
        onClick={onClose}
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
            onClick={onClose}
          >
            <ListItemText>{c}</ListItemText>
          </ListItemButton>
        ))}
    </>
  );
};

export const Nav: React.FC = () => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="static" sx={{ gridArea: "APPBAR" }}>
        <Toolbar variant="dense" disableGutters>
          {smallScreen && (
            <Tooltip title="Menu">
              <IconButton
                sx={{ mx: 1 }}
                ref={menuButtonRef}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            variant="caption"
            component="div"
            sx={{ flexGrow: 1, mx: 4, textWrap: "nowrap" }}
          >
            alveus-ptz-preset-util
          </Typography>
          <InfoBox />
        </Toolbar>
      </AppBar>
      {!smallScreen && (
        <Paper
          square
          elevation={3}
          sx={{
            width: 150,
            gridArea: "NAV",
            overflowX: "hidden",
            overflowY: "scroll",
          }}
        >
          <List>
            <MenuContent onClose={() => setOpen(false)} />
          </List>
        </Paper>
      )}
      {smallScreen && (
        <Drawer variant="temporary" open={open} onClose={() => setOpen(false)}>
          <MenuContent onClose={() => setOpen(false)} />
        </Drawer>
      )}
    </>
  );
};
