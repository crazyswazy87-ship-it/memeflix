import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { client, appwriteConfig } from "../appwrite/config";

const NOTIFICATIONS_KEY = "GET_NOTIFICATIONS";

export function useRealtimeNotifications(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel =
      `databases.${appwriteConfig.databaseId}.collections.notifications.documents`;

    const unsubscribe = client.subscribe(channel, (event) => {
      const payload = event.payload as { receiver?: string };

      // One collection channel serves all users; only invalidate this
      // user's queries when the event belongs to them.
      if (payload?.receiver !== userId) return;

      queryClient.invalidateQueries({
        queryKey: [NOTIFICATIONS_KEY, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["NOTIFICATION_COUNTS", userId],
      });
    });

    return () => {
      unsubscribe();
    };
  }, [userId, queryClient]);
}
