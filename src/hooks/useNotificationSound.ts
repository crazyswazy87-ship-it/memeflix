import { useEffect, useRef } from "react";

export const useNotificationSound = (count: number) => {
  const prevCount = useRef(count);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
  }, []);

  useEffect(() => {
    if (count > prevCount.current) {
      audioRef.current?.play().catch(() => {
        // autoplay blocked until user interacts
      });
    }

    prevCount.current = count;
  }, [count]);
};