import { ApiClient, HelixUser } from "@twurple/api";
import {
  exchangeCode,
  RefreshingAuthProvider,
  type AccessToken,
} from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { channel } from "./constants";

const TwitchApiContext = React.createContext<{
  clientId: string;
  setClientId: React.Dispatch<React.SetStateAction<string>>;
  clientSecret: string;
  setClientSecret: React.Dispatch<React.SetStateAction<string>>;
  failure: string;
  authProvider: RefreshingAuthProvider | null;
  apiClient: ApiClient | null;
  chatClient: ChatClient | null;
  chatConnected: boolean;
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
    void p
      .addUserForToken(tokenData, ["chat"])
      .then((userId) => setUserId(userId));

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

  const [chatConnected, setChatConnected] = useState(false);
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  useEffect(() => {
    if (!authProvider || !apiClient || !self) {
      return;
    }
    const c = new ChatClient({
      authProvider,
      logger: {
        name: "chat",
        minLevel: "INFO",
        colors: true,
        emoji: true,
      },
      rejoinChannelsOnReconnect: true,
      requestMembershipEvents: false,
      webSocket: true,
      channels: async () => {
        const channelInfo = await apiClient.users.getUserById(channel);
        if (!channelInfo) {
          throw new Error("unable to find user " + channel);
        }
        return [channelInfo.name];
      },
    });
    c.onConnect(() => console.log("chat connected"));
    c.onAuthenticationSuccess(() => {
      console.log("chat authenticated");
    });
    c.onAuthenticationFailure((text) => {
      console.log("chat auth failed", text);
    });
    c.onDisconnect((manually, err) => {
      console.log("chat disconnected", manually, err);
    });
    c.connect();
    queueMicrotask(() => setChatClient(c));

    const handle = setInterval(() => {
      setChatConnected(c.isConnected);
    }, 1000);

    return () => {
      clearInterval(handle);
      c.quit();
      setChatClient(null);
    };
  }, [apiClient, authProvider, self]);

  const value = useMemo(() => {
    return {
      clientId,
      setClientId,
      clientSecret,
      setClientSecret,
      failure,
      authProvider,
      apiClient,
      chatClient,
      chatConnected,
      self,
    };
  }, [
    clientId,
    setClientId,
    clientSecret,
    setClientSecret,
    failure,
    authProvider,
    apiClient,
    chatClient,
    chatConnected,
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
