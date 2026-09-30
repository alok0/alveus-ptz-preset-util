import { Box, Paper } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatLog } from "./ChatLog";
import { ControlConfig } from "./ControlConfig";
import { InputBox } from "./InputBox";
import { TwitchApiContextProvider } from "./TwitchApiContext";

const queryClient = new QueryClient();

const ControlChatMain: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TwitchApiContextProvider>
        <Paper
          elevation={0}
          square
          sx={{
            gridArea: "CONTENT",
            overflow: "hidden",
            display: "grid",
            gridTemplateRows: "1fr auto",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                overflowX: "hidden",
                overflowY: "scroll",
                scrollbarWidth: "thin",
                p: 3,
              }}
            >
              <ChatLog />
            </Box>
          </Box>
          <Box
            sx={{
              mb: 4,
              mx: 2,
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              alignItems: "center",
            }}
          >
            <Box sx={{ height: 0, overflow: "visible", mr: 1 }}>
              <Box sx={{ transform: "translateY(-50%)" }}>
                <ControlConfig />
              </Box>
            </Box>
            <InputBox />
          </Box>
        </Paper>
      </TwitchApiContextProvider>
    </QueryClientProvider>
  );
};

export default ControlChatMain;
