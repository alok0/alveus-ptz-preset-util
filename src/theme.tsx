import { createTheme } from "@mui/material";

export const theme = createTheme({
  colorSchemes: { light: false, dark: true },
  palette: { mode: "dark" },
  cssVariables: { nativeColor: true },
  typography: {
    fontFamily: `"JetBrains Mono Variable",sans-serif`,
    fontSize: 12,
    allVariants: {
      fontVariantLigatures: "none",
    },
  },
  components: {
    // MuiBackdrop: { styleOverrides: { root: { backdropFilter: "blur(3px)" } } },
    MuiInputLabel: { defaultProps: { shrink: true } },
  },
});
