import { ApiClient, HelixUser } from "@twurple/api";
import {
  exchangeCode,
  RefreshingAuthProvider,
  type AccessToken,
} from "@twurple/auth";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const TwitchApiContext = React.createContext<{
  clientId: string;
  setClientId: React.Dispatch<React.SetStateAction<string>>;
  clientSecret: string;
  setClientSecret: React.Dispatch<React.SetStateAction<string>>;
  failure: string;
  websocketFailure: string;
  authProvider: RefreshingAuthProvider | null;
  apiClient: ApiClient | null;
  eventSubListener: EventSubWsListener | null;
  self: HelixUser | null;
} | null>(null);

export const useTwitch = () => {
  const value = useContext(TwitchApiContext);
  if (!value) {
    throw new Error("missing context");
  }
  return value;
};

export const TwitchApiContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [clientId, setClientId] = useLocalStorage("a-ot-cid", "");
  const [clientSecret, setClientSecret] = useLocalStorage("a-ot-cs", "");
  const [tokenData, setTokenData] = useLocalStorage<AccessToken | null>(
    "a-ot-tokendata",
    null,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [failure, setFailure] = useState("");

  const authProvider = useMemo(() => {
    const p = new RefreshingAuthProvider({ clientId, clientSecret });
    p.onRefreshFailure((_, err) => {
      setFailure(String(err));
    });
    p.onRefresh((_, newTokenData) => {
      setTokenData(newTokenData);
      setFailure("");
    });
    if (!tokenData) {
      queueMicrotask(() => setFailure("missing token"));
      return null;
    }
    void p.addUserForToken(tokenData).then((userId) => setUserId(userId));

    queueMicrotask(() => setFailure(""));
    return p;
  }, [clientId, clientSecret, setTokenData, tokenData]);

  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const [self, setSelf] = useState<HelixUser | null>(null);
  useEffect(() => {
    if (!authProvider || !userId) {
      return;
    }
    void (async () => {
      const client = new ApiClient({ authProvider });
      setApiClient(client);

      const userInfo = await client.users.getUserById(userId);
      setSelf(userInfo);
    })();
    return () => {
      setSelf(null);
      setApiClient(null);
    };
  }, [authProvider, userId]);

  const [websocketFailure, setWebsocketFailure] = useState(
    "websocket initializing...",
  );
  const [eventSubListener, setEventSubListener] =
    useState<EventSubWsListener | null>(null);
  useEffect(() => {
    if (!apiClient) {
      return;
    }

    const listener = new EventSubWsListener({
      apiClient,
      logger: {
        name: "eventsub",
        minLevel: "INFO",
        colors: true,
        emoji: true,
        timestamps: true,
      },
    });
    listener.onUserSocketConnect((userId) => {
      console.info(`websocket connected ${userId}`);
      queueMicrotask(() => setWebsocketFailure(""));
    });
    listener.onUserSocketDisconnect((userId, err) => {
      console.info(`websocket disconnected ${userId} ${err}`, err);
      queueMicrotask(() => {
        if (!listener.isActive) {
          setWebsocketFailure(String(err || "unknown websocket error"));
        }
      });
    });
    listener.start();
    queueMicrotask(() => setEventSubListener(listener));

    return () => {
      setEventSubListener(null);
      listener.stop();
    };
  }, [apiClient]);

  const value = useMemo(() => {
    return {
      clientId,
      setClientId,
      clientSecret,
      setClientSecret,
      failure,
      websocketFailure,
      authProvider,
      apiClient,
      eventSubListener,
      self,
    };
  }, [
    clientId,
    setClientId,
    clientSecret,
    setClientSecret,
    failure,
    websocketFailure,
    authProvider,
    apiClient,
    eventSubListener,
    self,
  ]);

  useEffect(() => {
    void (async () => {
      const incomingCode = await window.cookieStore.get("a-incoming-code");
      const incomingState = await window.cookieStore.get("a-incoming-state");
      const expectedState = await window.cookieStore.get("a-exp-state");
      if (
        expectedState?.value &&
        expectedState.value === incomingState?.value &&
        incomingCode?.value
      ) {
        await window.cookieStore.delete("a-exp-state");

        const origin = new URL(window.location.href);
        origin.pathname = "";
        origin.search = "";
        origin.hash = "";
        const redirectUri = origin.toString();

        const tokenData = await exchangeCode(
          clientId,
          clientSecret,
          incomingCode.value,
          redirectUri,
        );

        setTokenData(tokenData);
      }
    })();
  }, [clientId, clientSecret, setTokenData]);

  return <TwitchApiContext value={value}>{children}</TwitchApiContext>;
};
