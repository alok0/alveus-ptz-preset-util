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

export const ChatLog: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { eventSubListener, self } = useTwitch();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!eventSubListener || !self) {
      return;
    }

    const subscription = eventSubListener.onChannelChatMessage(
      channel,
      self,
      (data) => {
        setLogs((logs) => {
          queueMicrotask(() => {
            ref.current?.scrollIntoView({ behavior: "smooth" });
          });
          return [...logs, { message: data, time: new Date() }].slice(-500);
        });
      },
    );

    return () => {
      subscription.stop();
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
        {logs.map(({ message, time }) => (
          <React.Fragment key={message.messageId}>
            {time.toLocaleTimeString(undefined, { hour12: false })}{" "}
            <span
              style={{
                textDecorationColor: message.color || "transparent",
                textDecorationLine: "underline",
                textDecorationStyle:
                  message.badges["moderator"] ||
                  message.badges["lead_moderator"]
                    ? "double"
                    : message.badges["staff"] || message.badges["vip"]
                      ? "solid"
                      : "dotted",
              }}
            >
              {message.chatterName.toLocaleLowerCase() ===
              message.chatterDisplayName.toLocaleLowerCase()
                ? message.chatterDisplayName
                : message.chatterName}
            </span>
            : {message.messageText}
            {"\n"}
          </React.Fragment>
        ))}
      </Typography>
      <div ref={ref} />
    </>
  );
};
