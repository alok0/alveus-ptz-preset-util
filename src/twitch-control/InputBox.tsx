import { Box, TextField, Typography } from "@mui/material";
import Fuse from "fuse.js";
import { useCallback, useRef, useState } from "react";
import { channel } from "./constants";
import { fullCamList, fullPresetLists } from "./data/data";
import { useTwitch } from "./TwitchApiContext";

const commands = new Fuse([
  "!ptzload",
  "!ptzzoom",
  "!ptzzooma",
  "!ptzfocus",
  "!ptzfocusa",
  "!swap",
  "!ptzgetinfo",
  "!scenecams",
  "!wolftext off",
  "!wolftext on",
  "!getvolume",
  "!setvolume",
  "!resetcam",
  "!resetlivecams",
]);

const cams = new Fuse(fullCamList);

const presetMatchers = Object.fromEntries(
  Object.entries(fullPresetLists).map(([k, v]) => [k, new Fuse(v)] as const),
);

export const InputBox: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const appendHistory = useCallback(
    (v: string) =>
      setHistory((h) => {
        if (h.findLast(Boolean) === v) {
          return h;
        }
        return [v, ...h].slice(0, 25);
      }),
    [],
  );
  const lastMessageRef = useRef("");
  const { apiClient, self } = useTwitch();
  const [displayValue, setDisplayValue] = useState("");
  const typedInputRef = useRef("");
  const historyIndexRef = useRef<null | number>(null);
  const compIndexRef = useRef<null | number>(null);
  const [completionTooltip, setCompletionTooltip] = useState("");
  const [completions, setCompletions] = useState<string[]>([]);
  const getCompletions = useCallback((searchValue: string) => {
    if (!searchValue) {
      return [];
    }
    const tokens = searchValue.trim().split(/\s+/);
    if (tokens.length === 1) {
      return commands.search(searchValue).map((r) => r.item + " ");
    }

    if (tokens[1]?.match(/^\d+$/) && tokens[0] === "!swap") {
      return [1, 2, 3, 4, 5, 6]
        .map((v) => String(v))
        .filter((v) => v !== tokens[1])
        .map((v) => tokens[0] + " " + tokens[1] + " " + v);
    }

    if (tokens.length === 2 && tokens[1]) {
      return cams.search(tokens[1]).map((r) => tokens[0] + " " + r.item + " ");
    }

    if (
      tokens.length === 3 &&
      tokens[0] === "!ptzload" &&
      tokens[1] &&
      tokens[2]
    ) {
      const matcher = presetMatchers[tokens[1]];
      if (matcher) {
        return matcher
          .search(tokens[2])
          .map((r) => tokens[0] + " " + tokens[1] + " " + r.item + " ");
      }
    }

    if (
      tokens.length >= 3 &&
      tokens[0] === "!ptzzoom" &&
      tokens[1] &&
      tokens[2]?.match(/^\d+$/)
    ) {
      return [tokens.slice(0, 3).join(" ") + " off "];
    }

    if (tokens.length === 3 && tokens[2] && tokens[0] === "!swap") {
      return cams
        .search(tokens[2])
        .filter((r) => r.item !== tokens[1])
        .map((r) => tokens[0] + " " + tokens[1] + " " + r.item + " ");
    }

    return [];
  }, []);
  const updateCompletions = useCallback(
    (searchValue: string) => {
      const newCompletions = getCompletions(searchValue);
      compIndexRef.current = null;
      setCompletions(newCompletions);
      setCompletionTooltip(newCompletions[0] || "");
    },
    [getCompletions],
  );

  return (
    <form
      style={{ display: "contents" }}
      onSubmit={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        historyIndexRef.current = null;
        compIndexRef.current = null;
        setCompletionTooltip("");
        void (async () => {
          if (!apiClient) {
            throw new Error("missing api client");
          }
          if (!self) {
            throw new Error("missing self");
          }
          console.info("submit: " + JSON.stringify(displayValue));
          let newMessage = displayValue.trim().replaceAll(/\s+/g, " ");
          setDisplayValue("");
          typedInputRef.current = "";
          if (!newMessage) {
            console.info("blank message");
            return;
          }
          appendHistory(newMessage);
          if (lastMessageRef.current === newMessage) {
            newMessage += "  .";
          }
          const result = await apiClient.asUser(self, (c) =>
            c.chat.sendChatMessage(channel, newMessage),
          );
          if (!result.isSent) {
            throw new Error(`error sending message: ${JSON.stringify(result)}`);
          }
          lastMessageRef.current = newMessage;
        })();
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          component="div"
          sx={{ position: "absolute", top: "100%", ml: 2 }}
        >
          {completionTooltip}
        </Typography>
        <TextField
          label=""
          fullWidth
          size="small"
          value={displayValue}
          margin="none"
          onKeyDown={(e) => {
            if (e.altKey || e.ctrlKey || e.metaKey) {
              return;
            }

            if (e.key === "Tab") {
              if (!displayValue) {
                return;
              }

              e.preventDefault();
              e.stopPropagation();

              if (e.shiftKey) {
                const newIndex =
                  compIndexRef.current === null || compIndexRef.current <= 0
                    ? 0
                    : compIndexRef.current - 1;
                const newComp = completions[newIndex];
                if (newComp) {
                  setDisplayValue(newComp);
                  setCompletionTooltip("");
                  compIndexRef.current = newIndex;
                }
              } else {
                const newIndex =
                  compIndexRef.current === null ? 0 : compIndexRef.current + 1;
                const newComp = completions[newIndex];
                if (newComp) {
                  setDisplayValue(newComp);
                  setCompletionTooltip("");
                  compIndexRef.current = newIndex;
                }
              }

              return;
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              e.stopPropagation();

              const newIndex =
                historyIndexRef.current === null
                  ? 0
                  : historyIndexRef.current + 1;
              const historyEntry = history[newIndex];
              if (historyEntry) {
                updateCompletions(historyEntry);
                setDisplayValue(historyEntry);
                historyIndexRef.current = newIndex;
              }
              return;
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              e.stopPropagation();

              const newIndex =
                historyIndexRef.current === null || historyIndexRef.current <= 0
                  ? null
                  : historyIndexRef.current - 1;
              if (newIndex === null) {
                updateCompletions(typedInputRef.current);
                setDisplayValue(typedInputRef.current);
                historyIndexRef.current = newIndex;
                return;
              }
              const historyEntry = history[newIndex];
              if (historyEntry) {
                updateCompletions(historyEntry);
                setDisplayValue(historyEntry);
                historyIndexRef.current = newIndex;
              }
              return;
            } else if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              historyIndexRef.current = null;
              setDisplayValue(typedInputRef.current);
              updateCompletions(typedInputRef.current);
            }
          }}
          onChange={(e) => {
            updateCompletions(e.target.value);
            typedInputRef.current = e.target.value;
            setDisplayValue(e.target.value);
          }}
        />
      </Box>
    </form>
  );
};
