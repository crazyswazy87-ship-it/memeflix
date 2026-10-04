import { ID, Query } from "appwrite";

import { appwriteConfig, databases } from "./config";

/**
 * Performance-first database paths.
 *
 * Rules:
 * - Never scan a child collection just to calculate a stored counter.
 * - Use counters already stored on post documents.
 * - Use Appwrite atomic numeric operations for counters.
 * - Keep feed payloads small and paginated.
 */

const postSelect = [
  "*",
  "creator.$id",
  "creator.name",
  "creator.username",
  "creator.imageUrl",
  "creator.isVerified",
];

export async function getRecentPostsFast() {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [
      Query.orderDesc("$createdAt"),
      Query.limit(20),
      Query.select(postSelect),
    ]
  );
}

export async function getInfinitePostsFast({ pageParam }: { pageParam?: string | null }) {
  const queries = [
    Query.limit(20),
    Query.orderDesc("$createdAt"),
    Query.select(postSelect),
  ];

  if (pageParam) queries.push(Query.cursorAfter(pageParam));

  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    queries
  );
}

export async function getExplorePostsFast({
  pageParam,
  mode = "top",
}: {
  pageParam?: string | null;
  mode?: "top" | "trending";
}) {
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
    nextCursor:
      response.documents.length === 10
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

export async function likePostFast({
  postId,
  userId,
  emoji,
}: {
  postId: string;
  userId: string;
  emoji: string;
}) {
  const existing = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.likesCollectionId,
    [
      Query.equal("post", postId),
      Query.equal("user", userId),
      Query.limit(1),
    ]
  );

  let result;
  const isNewLike = existing.documents.length === 0;

  if (isNewLike) {
    result = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      ID.unique(),
      { user: userId, post: postId, emoji }
    );

    // Atomic: no full likes collection scan and safe under concurrency.
    await databases.incrementDocumentAttribute(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      "likesCount",
      1
    );
  } else {
    result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      existing.documents[0].$id,
      { emoji }
    );
  }

  // Keep the interaction path focused on the like itself. Notification
  // delivery can be moved to an Appwrite Function/queue in phase 2.
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

export async function deleteSavedPostFast(
  savedRecordId: string,
  postId: string
) {
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
    [
      Query.search("caption", searchTerm),
      Query.limit(20),
      Query.select(postSelect),
    ]
  );
}

export async function searchUsersFast(searchTerm: string) {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [
      Query.search("username", searchTerm),
      Query.limit(20),
      Query.select([
        "$id",
        "name",
        "username",
        "imageUrl",
        "isVerified",
        "bio",
      ]),
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
      Query.select([
        "$id",
        "name",
        "username",
        "imageUrl",
        "isVerified",
        "bio",
      ]),
    ]
  );
}

export async function getNotesFast() {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.notesCollectionId,
    [
      Query.greaterThan("expiresAt", new Date().toISOString()),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
    ]
  );
}
