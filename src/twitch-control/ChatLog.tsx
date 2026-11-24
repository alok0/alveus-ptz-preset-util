import { Box, Typography } from "@mui/material";
import { ChatMessage } from "@twurple/chat";
import React, { useEffect, useRef, useState } from "react";
import { useTwitch } from "./TwitchApiContext";
import { use7TV } from "./seven-tv-data";
interface LogEntry {
  message: ChatMessage;
  time: Date;
}

const RenderTextWithEmotes: React.FC<{ text: string }> = ({ text }) => {
  const emotes = use7TV();

  return (
    <>
      {text.split(/\s/).map((t, index) => {
        if (!t) {
          return " ";
        }
        const e = emotes?.get(t.toLocaleLowerCase());
        if (t !== e?.name) {
          return t + " ";
        }

        return (
          <React.Fragment
            key={
              index /* eslint-disable-line @eslint-react/no-array-index-key */
            }
          >
            <div
              title={t}
              style={{
                display: "inline-block",
                height: 0,
                width: 0,
                paddingInline: `${(1.25 * 0.5 * e.width) / e.height}lh`,
                verticalAlign: "middle",
                wordBreak: "normal",
              }}
            >
              <img
                src={e.src}
                alt={t}
                style={{ height: "1.25lh", transform: "translate(-50%,-50%)" }}
              />
            </div>{" "}
          </React.Fragment>
        );
      })}
    </>
  );
};

const ChatLogLine: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const { message, time } = entry;
  const color = message.userInfo.color || "#000";

  return (
    <React.Fragment>
      {time.toLocaleTimeString(undefined, { hour12: false })}{" "}
      <span
        style={{
          display: "inline grid",
          paddingInline: "1ch",
          width: "18ch",
          background: `radial-gradient(at right, lab(from ${color} max(l / 2, 20) a b), transparent 50%)`,
          backgroundPosition: "center",
          backgroundSize: "100% 600%",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {message.userInfo.isMod || message.userInfo.isLeadMod
            ? "@"
            : message.userInfo.isVip
              ? "+"
              : " "}
          {message.userInfo.userName.toLocaleLowerCase() ===
          message.userInfo.displayName.toLocaleLowerCase()
            ? message.userInfo.displayName
            : message.userInfo.userName}
        </div>
      </span>{" "}
      <RenderTextWithEmotes text={message.text} />
      {"\n"}
    </React.Fragment>
  );
};

export const ChatLog: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { chatClient } = useTwitch();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    let handle: number;
    if (!chatClient) {
      return;
    }

    chatClient.onMessage((_channel, _user, _text, message) => {
      setLogs((logs) => {
        handle = window.setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
        return [...logs, { message, time: new Date() }].slice(-500);
      });
    });

    return () => {
      if (handle) {
        clearTimeout(handle);
      }
    };
  }, [chatClient]);

  useEffect(() => {
    // scroll log to bottom when page comes back into the foreground
    const handler = () => {
      ref.current?.scrollIntoView();
    };

    window.addEventListener("focus", handler);
    document.addEventListener("visibilitychange", handler);

    return () => {
      window.removeEventListener("focus", handler);
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  return (
    <>
      <Box sx={{ height: "100%" }} />
      <Typography
        variant="body2"
        color="textPrimary"
        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {logs.map((entry) => (
          <ChatLogLine entry={entry} key={entry.message.id} />
        ))}
      </Typography>
      <div ref={ref} />
    </>
  );
};
