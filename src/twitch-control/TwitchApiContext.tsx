import { useQuery } from "@tanstack/react-query";
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
  self: HelixUser | null | undefined;
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
  const [initialTokenData, setInitialTokenData] = useState<AccessToken | null>(
    null,
  );
  useEffect(() => {
    queueMicrotask(() =>
      setInitialTokenData((prev) => {
        if (prev) {
          return prev;
        }
        if (tokenData) {
          return tokenData;
        }
        return null;
      }),
    );
  }, [tokenData]);
  const [failure, setFailure] = useState("");

  const {
    data: [authProvider, userId, apiClient],
  } = useQuery({
    queryKey: ["api-client-stack", initialTokenData],
    retry: 100,
    retryDelay: 3_000,
    staleTime: (q) => {
      if (!q.state.data?.[0] || !q.state.data?.[1] || !q.state.data?.[2]) {
        return 0;
      }
      return Infinity;
    },
    gcTime: 1000,
    initialData: [null, null, null] as const,
    queryFn: async (): Promise<
      [RefreshingAuthProvider | null, string | null, ApiClient | null]
    > => {
      const p = new RefreshingAuthProvider({ clientId, clientSecret });
      p.onRefreshFailure((_, err) => {
        setFailure(String(err));
      });
      p.onRefresh((_, newTokenData) => {
        setTokenData(newTokenData);
        setFailure("");
      });
      if (!initialTokenData) {
        setFailure("missing token");
        throw new Error("missing token");
      }
      const userId = await p.addUserForToken(initialTokenData, ["chat"]);
      setFailure("");

      const client = new ApiClient({ authProvider: p });

      return [p, userId, client] as const;
    },
  });

  const { data: self } = useQuery({
    queryKey: ["self", userId],
    enabled: !!(apiClient && userId),
    staleTime: 60_000,
    gcTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!apiClient) {
        throw new Error("missing api client");
      }
      if (!userId) {
        throw new Error("missing user id");
      }
      return apiClient.users.getUserById(userId);
    },
  });

  const [chatConnected, setChatConnected] = useState(false);
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!authProvider || !apiClient) {
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
    c.onConnect(() => {
      console.log("chat connected");
      if (cancelled) {
        c.quit();
        return;
      }
    });
    c.onAuthenticationSuccess(() => {
      console.log("chat authenticated");
      if (cancelled) {
        c.quit();
        return;
      }
      setChatClient(c);
    });
    c.onAuthenticationFailure((text) => {
      console.log("chat auth failed", text);
    });
    c.onDisconnect((manually, err) => {
      console.log("chat disconnected", manually, err);
    });
    c.connect();

    const handle = setInterval(() => {
      setChatConnected(c.isConnected);
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(handle);
      setChatConnected(false);
    };
  }, [apiClient, authProvider]);

  useEffect(() => {
    // disconnect chat client only after it has been replaced
    if (!chatClient) {
      return;
    }
    return () => {
      chatClient.quit();
    };
  }, [chatClient]);

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
        setInitialTokenData(tokenData);
      }
    })();
  }, [clientId, clientSecret, setTokenData]);

  return <TwitchApiContext value={value}>{children}</TwitchApiContext>;
};
