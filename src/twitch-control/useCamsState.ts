import { useEffect, useMemo, useRef } from "react";
import { useTwitch } from "./TwitchApiContext";
import { mainBot } from "./constants";

export const useCamsState = () => {
  const { chatClient } = useTwitch();

  const sceneCamsRef = useRef<(string | null | undefined)[]>([]);

  useEffect(() => {
    if (!chatClient) {
      return;
    }

    chatClient.onMessage((_channel, _user, _text, message) => {
      if (message.userInfo.userId === mainBot) {
        //  Scene: customcamsbig Current Scene: custom Cams: 1: macaw, 2: crow, 3: wolfcorner, 4: pasture, 5: marmosetindoor, 6: toastcrunch
        const fullListMatch = /Scene:.* Current Scene:.* Cams: (.*)$/.exec(
          message.text,
        );
        if (fullListMatch && fullListMatch[1]) {
          const c = fullListMatch[1].split(/,\s+/);
          const result: string[] = [];
          c.forEach((ce) => {
            const cm = /(\d+): (.+)$/.exec(ce);
            if (cm && cm[1] && cm[2]) {
              result[Number.parseInt(cm[1])] = cm[2];
            }
          });

          sceneCamsRef.current = result;
        }

        // Swapped wolfcorner(3) wolfden2(3)
        // Swapped macaw(5) crow(1)
        const swapMatch = /Swapped (.+)\((\d+)\) (.+)\((\d+)\)/.exec(
          message.text,
        );
        if (
          swapMatch &&
          swapMatch[1] &&
          swapMatch[2] &&
          swapMatch[3] &&
          swapMatch[4]
        ) {
          const nameA = swapMatch[1];
          // const slotA = swapMatch[2];
          const nameB = swapMatch[3];
          // const slotB = swapMatch[4];

          sceneCamsRef.current.forEach((v, i) => {
            if (v === nameA) {
              sceneCamsRef.current[i] = nameB;
            } else if (v === nameB) {
              sceneCamsRef.current[i] = nameA;
            }
          });
        }

        console.info(sceneCamsRef.current.join(" "));
      }
    });

    return () => {};
  }, [chatClient]);

  return useMemo(() => ({ sceneCamsRef }), []);
};
