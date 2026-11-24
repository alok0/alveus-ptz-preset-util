import { useQuery } from "@tanstack/react-query";
import { channel } from "./constants";
import z from "zod";

const sevenTvResponseSchema = z.object({
  emote_set: z.object({
    emotes: z.array(
      z.object({
        data: z.object({
          name: z.string(),
          flags: z.number(),
          host: z.object({
            url: z.string(),
            files: z.array(
              z.object({
                name: z.string(),
                size: z.number().positive(),
                height: z.number().positive(),
                width: z.number().positive(),
              }),
            ),
          }),
        }),
      }),
    ),
  }),
});
const FLAGS_NORMAL = 0;
const FLAGS_OVERLAYING = 256;

export type EmoteData = {
  name: string;
  overlaying: boolean;
  src: string;
  height: number;
  width: number;
};

export const use7TV = () => {
  const endpoint = `https://7tv.io/v3/users/twitch/${encodeURIComponent(channel)}`;
  const { data } = useQuery({
    queryKey: [endpoint],
    retry: true,
    retryDelay: (n) => 12000 * Math.min(n, 200),
    refetchInterval: 6 * 60 * 60 * 1000,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
    queryFn: async () => {
      try {
        const resp = await fetch(endpoint);
        const data = await sevenTvResponseSchema.parseAsync(await resp.json());

        return new Map<string, EmoteData>(
          data.emote_set.emotes
            .filter(
              (o) =>
                o.data.flags === FLAGS_NORMAL ||
                o.data.flags === FLAGS_OVERLAYING,
            )
            .map((o) => {
              const smallestFile = o.data.host.files.toSorted(
                (a, b) => a.size - b.size,
              )[0];
              if (!smallestFile) {
                return null;
              }
              return [
                o.data.name.toLocaleLowerCase(),
                {
                  name: o.data.name,
                  overlaying: o.data.flags === FLAGS_OVERLAYING,
                  src: `${encodeURI(o.data.host.url)}/${encodeURIComponent(smallestFile.name)}`,
                  width: smallestFile.width,
                  height: smallestFile.height,
                },
              ] as const;
            })
            .filter((t) => !!t),
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  });

  return data;
};
