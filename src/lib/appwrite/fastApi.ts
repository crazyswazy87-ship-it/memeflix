import { ID, Query } from "appwrite";

import { appwriteConfig, databases } from "./config";
import { createNotification } from "./api";

async function getCachedFeed(mode: "latest" | "top" | "trending", limit: number, cursor?: string | null) {
  const base = appwriteConfig.cacheFunctionUrl;
  if (!base) return null;

  try {
    const url = new URL(base);
    url.searchParams.set("resource", "feed");
    url.searchParams.set("mode", mode);
    url.searchParams.set("limit", String(limit));
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    // Redis/cache failure must never take Memeflix down.
    return null;
  }
}

const postSelect = [
  "*",
  "creator.$id",
  "creator.name",
  "creator.username",
  "creator.imageUrl",
  "creator.isVerified",
];

export async function getRecentPostsFast() {
  const cached = await getCachedFeed("latest", 20);
  if (cached?.documents) return cached;

  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20), Query.select(postSelect)]
  );
}

export async function getInfinitePostsFast({ pageParam }: { pageParam?: string | null }) {
  const cached = await getCachedFeed("latest", 20, pageParam);
  if (cached?.documents) return cached;

  const queries = [Query.limit(20), Query.orderDesc("$createdAt"), Query.select(postSelect)];
  if (pageParam) queries.push(Query.cursorAfter(pageParam));
  return databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, queries);
}

export async function getExplorePostsFast({
  pageParam,
  mode = "top",
}: {
  pageParam?: string | null;
  mode?: "top" | "trending";
}) {
  const cached = await getCachedFeed(mode, 10, pageParam);
  if (cached?.documents) return cached;

  const queries = [
    Query.limit(10),
    Query.select(postSelect),
    Query.orderDesc(mode === "top" ? "topScore" : "trendingScore"),
  ];
  if (pageParam) queries.push(Query.cursorAfter(pageParam));

  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    queries
  );

  return {
    documents: response.documents,
    total: response.total,
    nextCursor: response.documents.length === 10
      ? response.documents[response.documents.length - 1].$id
      : null,
  };
}

export async function getPostByIdFast(postId: string) {
  return databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    [Query.select(postSelect)]
  );
}

export async function likePostFast({ postId, userId, emoji }: {
  postId: string;
  userId: string;
  emoji: string;
}) {
  const existing = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.likesCollectionId,
    [Query.equal("post", postId), Query.equal("user", userId), Query.limit(1)]
  );

  if (existing.documents.length > 0) {
    return databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      existing.documents[0].$id,
      { emoji }
    );
  }

  const result = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.likesCollectionId,
    ID.unique(),
    { user: userId, post: postId, emoji }
  );

  await databases.incrementDocumentAttribute(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    "likesCount",
    1
  );

  return result;
}

export async function savePostFast(postId: string, userId: string) {
  try {
    const saved = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      { user: userId, post: postId }
    );

    await databases.incrementDocumentAttribute(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      "savesCount",
      1
    );

    return saved;
  } catch (error: any) {
    if (error?.code === 409) return null;
    throw error;
  }
}

export async function deleteSavedPostFast(savedRecordId: string, postId: string) {
  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.savesCollectionId,
    savedRecordId
  );

  await databases.decrementDocumentAttribute(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    "savesCount",
    1
  );

  return true;
}

export async function searchPostsFast(searchTerm: string) {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.search("caption", searchTerm), Query.limit(20), Query.select(postSelect)]
  );
}

export async function searchUsersFast(searchTerm: string) {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [
      Query.search("username", searchTerm),
      Query.limit(20),
      Query.select(["$id", "name", "username", "imageUrl", "isVerified", "bio"]),
    ]
  );
}

export async function getUsersFast(limit = 30) {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [
      Query.orderDesc("$createdAt"),
      Query.limit(Math.min(limit, 50)),
      Query.select(["$id", "name", "username", "imageUrl", "isVerified", "bio"]),
    ]
  );
}

export async function getNotificationsFast(userId: string) {
  const notifications = await databases.listDocuments(
    appwriteConfig.databaseId,
    "notifications",
    [
      Query.equal("receiver", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
      Query.select(["$id", "$createdAt", "type", "sender", "receiver", "post", "emoji", "isRead"]),
    ]
  );

  const senderIds = [...new Set(
    notifications.documents.map((notification: any) => notification.sender).filter(Boolean)
  )];

  if (senderIds.length === 0) return { ...notifications, documents: notifications.documents };

  const senders = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [
      Query.equal("$id", senderIds),
      Query.limit(Math.min(senderIds.length, 50)),
      Query.select(["$id", "name", "username", "imageUrl", "isVerified"]),
    ]
  );

  const senderMap = new Map(senders.documents.map((user: any) => [user.$id, user]));

  return {
    ...notifications,
    documents: notifications.documents.map((notification: any) => ({
      ...notification,
      sender: senderMap.get(notification.sender) ?? null,
    })),
  };
}

export async function getFollowersCountFast(userId: string) {
  const user = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId,
    [Query.select(["followersCount"])]
  );
  return user.followersCount ?? 0;
}

export async function getFollowingCountFast(userId: string) {
  const user = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId,
    [Query.select(["followingCount"])]
  );
  return user.followingCount ?? 0;
}

export async function getNotesFast() {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.notesCollectionId,
    [Query.greaterThan("expiresAt", new Date().toISOString()), Query.orderDesc("$createdAt"), Query.limit(50)]
  );
}


export async function followUserFast(followerId: string, followingId: string) {
  if (!followerId || !followingId || followerId === followingId) return null;

  try {
    const follow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      { followerId, followingId }
    );

    await Promise.all([
      databases.incrementDocumentAttribute(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        followerId,
        "followingCount",
        1
      ),
      databases.incrementDocumentAttribute(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        followingId,
        "followersCount",
        1
      ),
      createNotification({
        type: "follow",
        receiver: followingId,
        sender: followerId,
      }),
    ]);

    return follow;
  } catch (error: any) {
    if (error?.code === 409) return null;
    throw error;
  }
}

export async function unfollowUserFast(followerId: string, followingId: string) {
  const existing = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.followsCollectionId,
    [
      Query.equal("followerId", followerId),
      Query.equal("followingId", followingId),
      Query.limit(1),
    ]
  );

  if (!existing.documents.length) return null;

  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.followsCollectionId,
    existing.documents[0].$id
  );

  await Promise.all([
    databases.decrementDocumentAttribute(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      followerId,
      "followingCount",
      1
    ),
    databases.decrementDocumentAttribute(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      followingId,
      "followersCount",
      1
    ),
  ]);

  return true;
}
