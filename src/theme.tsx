import { createTheme } from "@mui/material";

export const theme = createTheme({
  colorSchemes: { light: false, dark: true },
  palette: { mode: "dark" },
  cssVariables: { nativeColor: true },
  typography: {
    fontFamily: `"JetBrains Mono Variable",sans-serif`,
    fontSize: 12,
  },
});
