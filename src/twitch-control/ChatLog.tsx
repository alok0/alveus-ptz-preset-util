import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTwitch } from "./TwitchApiContext";
import { channel } from "./constants";

interface ChatMessage {
  messageType: string;
  broadcasterId: string;
  broadcasterName: string;
  broadcasterDisplayName: string;
  chatterId: string;
  chatterName: string;
  chatterDisplayName: string;
  color: string | null;
  messageId: string;
  messageText: string;
  badges: Record<string, string>;
}
interface LogEntry {
  message: ChatMessage;
  time: Date;
}

const ChatLogLine: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const { message, time } = entry;
  const color = message.color || "#000";

  return (
    <React.Fragment>
      {time.toLocaleTimeString(undefined, { hour12: false })}{" "}
      <span
        style={{
          display: "inline grid",
          paddingInline: "1ch",
          width: "18ch",
          background: `radial-gradient(at right, ${color}, transparent 50%)`,
          backgroundPosition: "center",
          backgroundSize: "100% 300%",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {message.badges["moderator"] || message.badges["lead_moderator"]
            ? "@"
            : message.badges["staff"]
              ? "~"
              : message.badges["vip"]
                ? "+"
                : " "}
          {message.chatterName.toLocaleLowerCase() ===
          message.chatterDisplayName.toLocaleLowerCase()
            ? message.chatterDisplayName
            : message.chatterName}
        </div>
      </span>{" "}
      {message.messageText}
      {"\n"}
    </React.Fragment>
  );
};

export const ChatLog: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { eventSubListener, self } = useTwitch();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    let handle: number;
    if (!eventSubListener || !self) {
      return;
    }

    const subscription = eventSubListener.onChannelChatMessage(
      channel,
      self,
      (data) => {
        setLogs((logs) => {
          handle = window.setTimeout(() => {
            ref.current?.scrollIntoView({ behavior: "smooth" });
          }, 0);
          return [...logs, { message: data, time: new Date() }].slice(-500);
        });
      },
    );

    return () => {
      subscription.stop();
      if (handle) {
        clearTimeout(handle);
      }
    };
  }, [eventSubListener, self]);

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
          <ChatLogLine entry={entry} key={entry.message.messageId} />
        ))}
      </Typography>
      <div ref={ref} />
    </>
  );
};
