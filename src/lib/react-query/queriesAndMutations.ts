import type { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "./queryKeys";
import { appwriteConfig, databases } from "../appwrite/config";
import { ID, Query } from "appwrite";
import {
  checkIsFollowing,
  completeEmailSignup,
  createPost,
  createUserAccount,
  deletePost,
  getAdminAnalytics,
  getCurrentUser,
  getFollowing,
  getNewFollowers,
  getSavedPosts,
  getUserAnalytics,
  getUserById,
  signOutAccount,
  sendEmailOTP,
  signInAccount,
  signInWithGoogle,
  updatePost,
  updateUser,
  verifyEmailOTP,
} from "../appwrite/api";
import {
  deleteSavedPostFast,
  getExplorePostsFast,
  getInfinitePostsFast,
  getPostByIdFast,
  getRecentPostsFast,
  getUsersFast,
  likePostFast,
  savePostFast,
  searchPostsFast,
  searchUsersFast,
  getNotificationsFast,
  getFollowersCountFast,
  getFollowingCountFast,
  followUserFast,
  unfollowUserFast,
} from "../appwrite/fastApi";
import { safeTrendingScore } from "../utils";

const PUBLIC_STALE = 1000 * 30;
const PUBLIC_GC = 1000 * 60 * 60 * 12;

function updatePostInValue(value: any, postId: string, updates: Record<string, unknown>) {
  if (!value) return value;

  if (Array.isArray(value)) {
    return value.map((item) => updatePostInValue(item, postId, updates));
  }

  if (typeof value !== "object") return value;

  if (value.$id === postId) return { ...value, ...updates };

  if (Array.isArray(value.documents)) {
    return {
      ...value,
      documents: value.documents.map((item: any) =>
        updatePostInValue(item, postId, updates)
      ),
    };
  }

  if (Array.isArray(value.pages)) {
    return {
      ...value,
      pages: value.pages.map((page: any) =>
        updatePostInValue(page, postId, updates)
      ),
    };
  }

  if (value.post && value.post.$id === postId) {
    return { ...value, post: { ...value.post, ...updates } };
  }

  return value;
}

function updateCachedPost(queryClient: ReturnType<typeof useQueryClient>, postId: string, updates: Record<string, unknown>) {
  const keys = [
    [QUERY_KEYS.GET_RECENT_POSTS],
    [QUERY_KEYS.GET_INFINITE_POSTS],
    [QUERY_KEYS.GET_EXPLORE_POSTS],
    [QUERY_KEYS.GET_POST_BY_ID, postId],
  ];

  keys.forEach((key) => {
    queryClient.setQueriesData({ queryKey: key }, (old) =>
      updatePostInValue(old, postId, updates)
    );
  });
}

export const useSendEmailOTP = () => useMutation({ mutationFn: (email: string) => sendEmailOTP(email) });
export const useVerifyEmailOTP = () => useMutation({ mutationFn: (data: { userId: string; secret: string }) => verifyEmailOTP(data) });
export const useCompleteEmailSignup = () => useMutation({
  mutationFn: (data: { name: string; username: string; password: string }) => completeEmailSignup(data),
});
export const useSignInAccount = () => useMutation({
  mutationFn: (user: { email: string; password: string }) => signInAccount(user),
});
export const useSignOutAccount = () => useMutation({ mutationFn: signOutAccount });
export const useSignInWithGoogle = () => useMutation({ mutationFn: () => signInWithGoogle() });
export const useCreateUserAccount = () => useMutation({ mutationFn: (user: INewUser) => createUserAccount(user) });

export async function getUserFromDB(userId: string) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", userId), Query.limit(1)]
    );
    return response.documents[0] ?? null;
  } catch {
    return null;
  }
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_INFINITE_POSTS] });
    },
  });
};

export const useGetRecentPosts = () => useQuery({
  queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
  queryFn: getRecentPostsFast,
  staleTime: PUBLIC_STALE,
  gcTime: PUBLIC_GC,
  refetchOnWindowFocus: false,
});

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePostFast,
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId] });
      const detail = queryClient.getQueryData<any>([QUERY_KEYS.GET_POST_BY_ID, postId]);

      return {
        postId,
        previous: detail
          ? {
              likesCount: detail.likesCount,
              topScore: detail.topScore,
              trendingScore: detail.trendingScore,
            }
          : null,
      };
    },
    onSuccess: (data, variables, context) => {
      if (data?.action === "created" || data?.action === "removed") {
        updateCachedPost(queryClient, variables.postId, {
          likesCount: data.likesCount,
          topScore: data.topScore,
          trendingScore: data.trendingScore,
        });
      } else if (data?.action === "changed" && context?.previous) {
        updateCachedPost(queryClient, variables.postId, context.previous);
      }
    },
    onError: (_error, variables, context) => {
      if (context?.previous) {
        updateCachedPost(queryClient, variables.postId, context.previous);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, variables.postId] });
    },
  });
};

export function calculateScores(post: any) {
  const likes = post.likesCount || 0;
  const saves = post.savesCount || 0;
  const reposts = post.repostCount || 0;
  const createdAt = new Date(post.$createdAt).getTime();
  const hoursSincePost = createdAt ? (Date.now() - createdAt) / 3600000 : 1;
  const safeHours = Math.max(hoursSincePost, 1);
  const topScore = likes * 2 + saves * 5 + reposts * 3;
  const timeDecay = Math.exp(-safeHours / 24);
  const velocity = (likes + saves + reposts) / safeHours;
  return {
    topScore,
    trendingScore: safeTrendingScore(topScore * timeDecay * (1 + velocity)),
  };
}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePostFast(postId, userId),

    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId] });

      const detail = queryClient.getQueryData<any>([
        QUERY_KEYS.GET_POST_BY_ID,
        postId,
      ]);
      const previousCount = typeof detail?.savesCount === "number"
        ? detail.savesCount
        : null;

      if (previousCount !== null) {
        updateCachedPost(queryClient, postId, {
          savesCount: previousCount + 1,
        });
      }

      return { postId, userId, previousCount };
    },

    onError: (_error, variables, context) => {
      if (context?.previousCount !== null && context?.previousCount !== undefined) {
        updateCachedPost(queryClient, variables.postId, {
          savesCount: context.previousCount,
        });
      }
    },

    onSuccess: (data, variables, context) => {
      if (data) {
        updateCachedPost(queryClient, variables.postId, {
          savesCount: data.savesCount,
          topScore: data.topScore,
          trendingScore: data.trendingScore,
        });
      } else if (context?.previousCount !== null && context?.previousCount !== undefined) {
        updateCachedPost(queryClient, variables.postId, {
          savesCount: context.previousCount,
        });
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS, variables.userId],
      });
    },
  });
};

export const useGetExplorePosts = (mode: "top" | "trending" = "top") => useInfiniteQuery({
  queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, mode],
  queryFn: ({ pageParam = null }) => getExplorePostsFast({ pageParam, mode }),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
  staleTime: PUBLIC_STALE,
  gcTime: PUBLIC_GC,
  refetchOnWindowFocus: false,
});

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ savedRecordId, postId }: { savedRecordId: string; postId: string; userId: string }) =>
      deleteSavedPostFast(savedRecordId, postId),
    onSuccess: (_data, variables) => {
      const detail = queryClient.getQueryData<any>([QUERY_KEYS.GET_POST_BY_ID, variables.postId]);
      const current = detail?.savesCount ?? 1;
      updateCachedPost(queryClient, variables.postId, { savesCount: Math.max(0, current - 1) });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_SAVED_POSTS, variables.userId] });
    },
  });
};

export const useGetSavedPosts = (userId?: string) => useQuery({
  queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
  queryFn: () => getSavedPosts(userId),
  enabled: !!userId,
  staleTime: 1000 * 60 * 2,
  gcTime: 1000 * 60 * 30,
  retry: 1,
});

export const useGetCurrentUser = () => useQuery({
  queryKey: [QUERY_KEYS.GET_CURRENT_USER],
  queryFn: getCurrentUser,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
  refetchOnWindowFocus: false,
});

export const useGetPostById = (postId: string) => useQuery({
  queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
  queryFn: () => getPostByIdFast(postId),
  enabled: !!postId,
  staleTime: PUBLIC_STALE,
  gcTime: PUBLIC_GC,
  refetchOnWindowFocus: false,
});

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, data.$id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_INFINITE_POSTS] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) => deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_INFINITE_POSTS] });
    },
  });
};

export const useGetPosts = () => useInfiniteQuery({
  queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
  queryFn: ({ pageParam }: { pageParam: string | null }) => getInfinitePostsFast({ pageParam }),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => {
    if (!lastPage?.documents?.length) return null;
    return lastPage.documents[lastPage.documents.length - 1].$id;
  },
  staleTime: PUBLIC_STALE,
  gcTime: PUBLIC_GC,
  refetchOnWindowFocus: false,
});

export async function updatePostStats(post: any, updates: any) {
  const updatedPost = { ...post, ...updates };
  const { topScore, trendingScore } = calculateScores(updatedPost);
  return databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    post.$id,
    { ...updates, topScore, trendingScore }
  );
}

export const useSearchPosts = (searchTerm: string) => useQuery({
  queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm.trim().toLowerCase()],
  queryFn: () => searchPostsFast(searchTerm.trim()),
  enabled: searchTerm.trim().length >= 2,
  staleTime: 1000 * 60,
  gcTime: 1000 * 60 * 30,
  refetchOnWindowFocus: false,
});

export const useGetUsers = (limit?: number) => useQuery({
  queryKey: [QUERY_KEYS.GET_USERS, limit ?? 30],
  queryFn: () => getUsersFast(limit ?? 30),
  staleTime: 1000 * 60 * 5,
  gcTime: PUBLIC_GC,
  refetchOnWindowFocus: false,
});

export const useSearchUsers = (searchTerm: string) => useQuery({
  queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm.trim().toLowerCase()],
  queryFn: () => searchUsersFast(searchTerm.trim()),
  enabled: searchTerm.trim().length >= 2,
  staleTime: 1000 * 60,
  gcTime: 1000 * 60 * 30,
  refetchOnWindowFocus: false,
});

export const useGetUsersById = (userId: string) => useQuery({
  queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
  queryFn: () => getUserById(userId),
  enabled: !!userId,
  staleTime: 1000 * 60 * 5,
  gcTime: PUBLIC_GC,
  refetchOnWindowFocus: false,
});

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.GET_USER_BY_ID, data?.$id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
    },
  });
};

export const useGetSavedPost = (userId?: string) => useQuery({
  queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
  queryFn: () => getSavedPosts(userId),
  enabled: !!userId,
  retry: 1,
  staleTime: 1000 * 60 * 2,
});

export const useReportPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, userId, creatorId, reason, details }: {
      postId: string; userId: string; creatorId: string; reason: string; details?: string;
    }) => {
      if (creatorId === userId) throw new Error("You can't report your own meme");
      if (!reason) throw new Error("Reason is required");
      const existing = await databases.listDocuments(
        appwriteConfig.databaseId,
        "reports",
        [Query.equal("postId", postId), Query.equal("reportedBy", userId), Query.limit(1)]
      );
      if (existing.documents.length > 0) throw new Error("You already reported this meme");
      return databases.createDocument(
        appwriteConfig.databaseId,
        "reports",
        ID.unique(),
        { postId, reportedBy: userId, reason, details: details || "", status: "pending", createdAt: new Date().toISOString() }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID] }),
  });
};

export const useGetNotifications = (userId: string) => useQuery({
  queryKey: ["GET_NOTIFICATIONS", userId],
  queryFn: () => getNotificationsFast(userId),
  enabled: !!userId,
  refetchOnWindowFocus: false,
  staleTime: 30000,
  refetchOnReconnect: true,
});

export const useNotificationCounts = (userId: string) => useQuery({
  queryKey: ["NOTIFICATION_COUNTS", userId],
  queryFn: async () => {
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      "notifications",
      [Query.equal("receiver", userId), Query.equal("isRead", false), Query.limit(100)]
    );
    const counts: Record<string, number> = { like: 0, save: 0, repost: 0, follow: 0, tag: 0, mention: 0 };
    res.documents.forEach((n: any) => { if (counts[n.type] !== undefined) counts[n.type]++; });
    return counts;
  },
  enabled: !!userId,
  refetchOnWindowFocus: false,
  staleTime: 30000,
  refetchOnReconnect: true,
});

export async function markNotificationAsRead(id: string) {
  return databases.updateDocument(appwriteConfig.databaseId, "notifications", id, { isRead: true });
}

export const useGetUserAnalytics = (userId: string) => useQuery({
  queryKey: ["GET_ANALYTICS", userId],
  queryFn: () => getUserAnalytics(userId),
  enabled: !!userId,
  staleTime: 1000 * 60 * 2,
});

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      followUserFast(followerId, followingId),

    onMutate: async ({ followerId, followingId }) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.CHECK_IS_FOLLOWING, followerId, followingId],
      });

      const previous = queryClient.getQueryData<any>([
        QUERY_KEYS.CHECK_IS_FOLLOWING,
        followerId,
        followingId,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.CHECK_IS_FOLLOWING, followerId, followingId],
        true
      );

      return { previous };
    },

    onError: (_error, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.CHECK_IS_FOLLOWING, variables.followerId, variables.followingId],
        context?.previous ?? false
      );
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING, variables.followerId],
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      unfollowUserFast(followerId, followingId),

    onMutate: async ({ followerId, followingId }) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.CHECK_IS_FOLLOWING, followerId, followingId],
      });

      const previous = queryClient.getQueryData<any>([
        QUERY_KEYS.CHECK_IS_FOLLOWING,
        followerId,
        followingId,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.CHECK_IS_FOLLOWING, followerId, followingId],
        false
      );

      return { previous };
    },

    onError: (_error, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.CHECK_IS_FOLLOWING, variables.followerId, variables.followingId],
        context?.previous ?? true
      );
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING, variables.followerId],
      });
    },
  });
};

export const useGetNewFollowers = (userId: string) => useQuery({
  queryKey: ["NEW_FOLLOWERS", userId],
  queryFn: () => getNewFollowers(userId, 3),
  enabled: !!userId,
  staleTime: 1000 * 60 * 5,
});

export const useGetAdminAnalytics = () => useQuery({
  queryKey: ["admin-analytics"],
  queryFn: getAdminAnalytics,
  staleTime: 1000 * 60 * 2,
  gcTime: 1000 * 60 * 10,
});

export const useGetFollowing = (userId: string) => useQuery({
  queryKey: [QUERY_KEYS.GET_FOLLOWING, userId],
  queryFn: () => getFollowing(userId),
  enabled: !!userId,
  staleTime: 1000 * 60 * 2,
});

export const useIsFollowing = (followerId: string, followingId: string) => useQuery({
  queryKey: [QUERY_KEYS.CHECK_IS_FOLLOWING, followerId, followingId],
  queryFn: () => checkIsFollowing(followerId, followingId),
  enabled: !!followerId && !!followingId,
  staleTime: 1000 * 60 * 2,
});

export const useGetFollowersCount = (userId: string) => useQuery({
  queryKey: ["FOLLOWERS_COUNT", userId],
  queryFn: () => getFollowersCountFast(userId),
  enabled: !!userId,
  staleTime: 1000 * 60 * 2,
});

export const useGetFollowingCount = (userId: string) => useQuery({
  queryKey: ["FOLLOWING_COUNT", userId],
  queryFn: () => getFollowingCountFast(userId),
  enabled: !!userId,
  staleTime: 1000 * 60 * 2,
});
