import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useTwitch } from "./TwitchApiContext";

const ControlConfigDialogContent: React.FC<{ onClose: () => unknown }> = ({
  onClose,
}) => {
  const { clientId, setClientId, clientSecret, setClientSecret } = useTwitch();

  const [formClientId, setFormClientId] = useState(clientId);
  const [formClientSecret, setFormClientSecret] = useState(clientSecret);

  return (
    <DialogContent>
      <DialogTitle>Configuration</DialogTitle>
      <DialogContentText>
        <TextField
          variant="standard"
          required
          label="Client ID"
          fullWidth
          helperText=" "
          margin="normal"
          value={formClientId}
          onChange={(e) => setFormClientId(e.target.value)}
        />
        <TextField
          variant="standard"
          required
          label="Client Secret"
          fullWidth
          helperText=" "
          margin="normal"
          value={formClientSecret}
          onChange={(e) => setFormClientSecret(e.target.value)}
        />
      </DialogContentText>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            setClientId(formClientId);
            setClientSecret(formClientSecret);
            // onClose();
            setTimeout(() => {
              void (async () => {
                if (!formClientId) {
                  throw new Error("missing client id");
                }
                if (!formClientSecret) {
                  throw new Error("missing client secret");
                }
                const state = window.crypto.randomUUID();
                await window.cookieStore.set({
                  name: "a-exp-state",
                  value: state,
                  expires: Date.now() + 1_200_000,
                  sameSite: "strict",
                });

                const origin = new URL(window.location.href);
                origin.pathname = "";
                origin.search = "";
                origin.hash = "";

                const u = new URL("https://id.twitch.tv/oauth2/authorize");

                u.searchParams.set("response_type", "code");
                u.searchParams.set("client_id", formClientId);
                u.searchParams.set("redirect_uri", origin.toString());
                u.searchParams.set(
                  "scope",
                  "user:write:chat chat:edit user:read:chat chat:read",
                );
                u.searchParams.set("state", state);

                console.log(u.toString());
                window.location.href = u.toString();
              })();
            }, 0);
          }}
        >
          Login
        </Button>
      </DialogActions>
    </DialogContent>
  );
};

export const ControlConfig: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { failure, websocketFailure, self } = useTwitch();

  return (
    <>
      <Tooltip
        title={
          failure ||
          websocketFailure ||
          (self ? `Logged in (${self.name})` : undefined)
        }
      >
        <IconButton
          size="small"
          color={failure || websocketFailure ? "warning" : undefined}
          onClick={() => setOpen(true)}
        >
          <AccountBoxIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ControlConfigDialogContent onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
};
