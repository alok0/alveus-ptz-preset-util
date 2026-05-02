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
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
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
      <Nav />
      {children}
    </Box>
  );
};

const MenuContent: React.FC<{
  onClose?: () => unknown;
  showHidden?: boolean;
}> = ({ onClose, showHidden }) => {
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
        .filter((c) => {
          if (showHidden || cam === c) {
            return true;
          }
          return !isCamHidden(c);
        })
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

const Nav: React.FC = () => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [clickCount, setClickCount] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!smallScreen) {
      queueMicrotask(() => setOpen(false));
    }
  }, [smallScreen]);

  return (
    <>
      <AppBar position="static" sx={{ gridArea: "APPBAR" }}>
        <Toolbar variant="dense" disableGutters>
          {smallScreen && (
            <Tooltip title="Menu">
              <IconButton sx={{ mx: 1 }} onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            variant="caption"
            component="div"
            onClick={() => setClickCount((x) => x + 1)}
            sx={{
              flexGrow: 1,
              mx: 4,
              textWrap: "nowrap",
              userSelect: "none",
            }}
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
            <MenuContent
              onClose={() => setOpen(false)}
              showHidden={clickCount > 15}
            />
          </List>
        </Paper>
      )}
      {smallScreen && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          slotProps={{
            backdrop: { sx: { backdropFilter: "grayscale(100%) blur(3px)" } },
            paper: { sx: { minWidth: 150 } },
          }}
        >
          <MenuContent
            onClose={() => setOpen(false)}
            showHidden={clickCount > 15}
          />
        </Drawer>
      )}
    </>
  );
};
