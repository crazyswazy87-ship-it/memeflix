import { useState } from "react";
import {
  useGetCurrentUser,
  useGetNotifications,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutations";

import Loader from "@/components/shared/Loader";
import PostDetails from "@/components/shared/PostDetails";
import { databases, appwriteConfig } from "@/lib/appwrite/config";
import VerifiedBadge from "@/components/shared/VerifiedBadge";

import nyegey from "../../../public/assetss/icons/save-icon.png";
import rusee from "../../../public/assetss/icons/reuse-1.png";
import ment from "../../../public/assetss/icons/tag.png"

import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { countries } from "@/components/shared/EmojiNdechu";
import type { ReactNode } from "react";
import { SkeletonDemo } from "@/components/shared/SkeletonDemo";


const emojiMap: Record<string, ReactNode> = Object.fromEntries(
  countries.map((e) => [e.value, e.label])
);

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const Notifications = () => {
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUser();

  const { data, isLoading } = useGetNotifications(currentUser?.$id);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: postData, isLoading: postLoading } =
    useGetPostById(selectedPostId || "");

  if (userLoading || isLoading || !currentUser) {
    return (
      <div className="ngosti">
        <SkeletonDemo />
      </div>
    );
  }

  const notifications = data?.documents || [];

  const handleNotificationClick = async (n: any) => {
    const postId =
      typeof n.post === "object"
        ? n.post?.$id
        : n.post || null;

    // Marking a notification as read does not need a full-list refetch.
    // Keep both notification caches in sync locally after the write.
    queryClient.setQueryData(
      ["GET_NOTIFICATIONS", currentUser.$id],
      (old: any) => {
        if (!old) return old;

        return {
          ...old,
          documents: old.documents.map((item: any) =>
            item.$id === n.$id ? { ...item, isRead: true } : item
          ),
        };
      }
    );

    if (!n.isRead) {
      queryClient.setQueryData(
        ["NOTIFICATION_COUNTS", currentUser.$id],
        (old: Record<string, number> | undefined) => {
          if (!old || !n.type || old[n.type] === undefined) return old;

          return {
            ...old,
            [n.type]: Math.max(0, old[n.type] - 1),
          };
        }
      );
    }

    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        "notifications",
        n.$id,
        { isRead: true }
      );
    } catch (err) {
      console.error("Failed to update notification:", err);
    }

    if (postId) setSelectedPostId(postId);
  };

  return (
    <div className="notifications-container">
      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n: any) => (
            <div
              key={n.$id}
              onClick={() => handleNotificationClick(n)}
              className={`notification-card noty cursor-pointer transition hover:bg-white/5 ${
                n.isRead ? "opacity-40" : "bg-white/8"
              }`}
            >
              <Link
                to={`/profile/${n.sender?.$id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mbotas wavy-circle-sm">
                  <img
                    height={50}
                    width={40}
                    src={n.sender?.imageUrl}
                    className="mbota"
                    alt="user"
                  />
                </div>
              </Link>

              <div className="inadii">
                <p className="ment">
                  <Link
                    to={`/profile/${n.sender?.$id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="usrrr">
                      {n.sender?.username || "Someone"}
                      {n.sender?.isVerified && <VerifiedBadge />}
                    </span>{" "}
                  </Link>

                  {/* ✅ FIXED LIKE */}
                  {n.type === "like" && (
                    <>
                      reacted to your meme{" "}
                      <span className="inline ml-1">
                        {emojiMap[n.emoji] || emojiMap["emoji1"]}
                      </span>
                    </>
                  )}

                  {n.type === "save" && (
                    <>
                      saved your meme for later{" "}
                      <img
                        src={nyegey}
                        alt="save"
                        className="inline w-9 h-9"
                      />
                    </>
                  )}

                  {n.type === "repost" && (
                    <>
                     reused your meme{" "}
                      <img
                        src={rusee}
                        alt="repost"
                        className="inline w-7.5 h-7.5"
                      />
                    </>
                  )}

                  {n.type === "mention" && (
                    <>
                     mentioned you on a note{" "}
                      <img
                        src={ment}
                        alt="mention"
                        className="inline w-7.5 h-7.5"
                      />
                    </>
                  )}

                  {n.type === "follow" && (
                    <>
                      plugged in to your meme feed{" "}
                      <img
                        src="/assetss/images/lef.png"
                        alt="repost"
                        className="inline w-10 h-10"
                      />
                    </>
                  )}
                </p>
              </div>

              <span className="text-xs text-gray-300">
                {timeAgo(n.$createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedPostId && (
        <div className="fixed inset-0 z-50  flex items-center justify-center  p00p">
          <div className=" post-card-two max-h-[90vh] overflow-y-auto rounded-lg relative popo pt-13">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setSelectedPostId(null)}
            >
              ✕
            </button>

            {postLoading || !postData ? (
              <Loader />
            ) : (
              <PostDetails
                post={postData}
                userId={postData.creator.$id}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;