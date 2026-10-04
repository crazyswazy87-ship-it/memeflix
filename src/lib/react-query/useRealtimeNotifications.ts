import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Query } from "appwrite";
import { client, appwriteConfig, databases } from "../appwrite/config";

const NOTIFICATIONS_KEY = "GET_NOTIFICATIONS";
const COUNTS_KEY = "NOTIFICATION_COUNTS";

const emptyCounts = {
  like: 0,
  save: 0,
  repost: 0,
  follow: 0,
  tag: 0,
  mention: 0,
};

export function useRealtimeNotifications(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel =
      `databases.${appwriteConfig.databaseId}.collections.notifications.documents`;

    const unsubscribe = client.subscribe(channel, async (event) => {
      const payload = event.payload as any;
      if (payload?.receiver !== userId) return;

      const isDelete = event.events?.some((name) => name.endsWith(".delete"));
      const isCreate = event.events?.some((name) => name.endsWith(".create"));

      if (isDelete) {
        queryClient.setQueryData(
          [NOTIFICATIONS_KEY, userId],
          (old: any) => old
            ? {
                ...old,
                documents: old.documents.filter((item: any) => item.$id !== payload.$id),
                total: Math.max(0, (old.total ?? old.documents.length) - 1),
              }
            : old
        );
        return;
      }

      let notification = payload;

      // Realtime relationships may arrive as IDs. Hydrate only the sender
      // for this new/changed notification instead of refetching all 50 rows.
      if (notification?.sender && typeof notification.sender === "string") {
        try {
          notification = {
            ...notification,
            sender: await databases.getDocument(
              appwriteConfig.databaseId,
              appwriteConfig.userCollectionId,
              notification.sender,
              [
                Query.select([
                  "$id",
                  "name",
                  "username",
                  "imageUrl",
                  "isVerified",
                ]),
              ]
            ),
          };
        } catch {
          // Keep the realtime event usable even if sender hydration fails.
        }
      }

      queryClient.setQueryData(
        [NOTIFICATIONS_KEY, userId],
        (old: any) => {
          if (!old) return { documents: [notification], total: 1 };

          const exists = old.documents.some(
            (item: any) => item.$id === notification.$id
          );

          const documents = exists
            ? old.documents.map((item: any) =>
                item.$id === notification.$id ? notification : item
              )
            : [notification, ...old.documents].slice(0, 50);

          return {
            ...old,
            documents,
            total: exists ? old.total : (old.total ?? documents.length) + 1,
          };
        }
      );

      if (isCreate || !event.events?.length) {
        queryClient.setQueryData(
          [COUNTS_KEY, userId],
          (old: Record<string, number> | undefined) => {
            const counts = old ?? emptyCounts;
            if (notification.isRead) return counts;

            const type = notification.type;
            if (!(type in counts)) return counts;

            return {
              ...counts,
              [type]: (counts[type] ?? 0) + 1,
            };
          }
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId, queryClient]);
}
