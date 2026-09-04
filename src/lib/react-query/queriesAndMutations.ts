import type { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import  {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "./queryKeys";
import { appwriteConfig, databases } from "../appwrite/config";
import { ID, Query } from "appwrite";
import { checkIsFollowing, completeEmailSignup, createPost,  createUserAccount,  deletePost, deleteSavedPost, followUser, getAdminAnalytics, getCurrentUser, getExplorePosts, getFollowersCount, getFollowing, getFollowingCount, getInfinitePosts, getNewFollowers, getNotifications, getPostById, getRecentPosts, getSavedPosts, getUserAnalytics, getUserById, getUsers, likePost, savePost, searchPosts, searchUsers, sendEmailOTP, signInAccount, signInWithGoogle, signOutAccount, unfollowUser, updatePost, updateUser, verifyEmailOTP } from "../appwrite/api";
import { safeTrendingScore } from "../utils";

export const useSendEmailOTP = () => {
  return useMutation({
    mutationFn: (email: string) => sendEmailOTP(email),
  });
};

export const useVerifyEmailOTP = () => {
  return useMutation({
    mutationFn: (data: { userId: string; secret: string }) =>
      verifyEmailOTP(data),
  });
};

export const useCompleteEmailSignup = () => {
  return useMutation({
    mutationFn: (data: {
      name: string;
      username: string;
      password: string;
    }) => completeEmailSignup(data),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: {
      email: string;
      password: string;
    }) =>
      signInAccount(user),
  });
};


export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount
  });
}

export const useSignInWithGoogle = () => {
  return useMutation({
    mutationFn: () => signInWithGoogle(),
  });
};

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) =>
      createUserAccount(user),
  });
};

export async function getUserFromDB(
  userId: string
) {
  try {
    const response =
      await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [
          Query.equal(
            "accountId",
            userId
          ),
          Query.limit(1),
        ]
      );

    if (
      !response.documents ||
      response.documents.length === 0
    ) {
      return null;
    }

    return response.documents[0];

  } catch (error: any) {
    console.error(
      "GET USER FROM DB ERROR:",
      error
    );

    return null;
  }
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post:INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      userId,
      emoji,
    }: {
      postId: string;
      userId: string;
      emoji: string;
    }) =>
      likePost({
        postId,
        userId,
        emoji,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, variables.postId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  });
};


export function calculateScores(post) {
  const likes = post.likesCount || 0;
  const saves = post.savesCount || 0;
  const reposts = post.repostCount || 0;

  const createdAt = new Date(post.$createdAt).getTime();

  const hoursSincePost = createdAt
    ? (Date.now() - createdAt) / 3600000
    : 1;

  const safeHours = Math.max(hoursSincePost, 1);

  const topScore =
    likes * 2 +
    saves * 5 +
    reposts * 3;

  const timeDecay = Math.exp(-safeHours / 24);

  const velocity =
    (likes + saves + reposts) / safeHours;

  const rawTrending =
    topScore * timeDecay * (1 + velocity);

  const trendingScore = safeTrendingScore(rawTrending);

  return { topScore, trendingScore };
}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS, variables.userId],
      });

      // optional (keep your existing ones if needed)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};


export const useGetExplorePosts = (mode: "top" | "trending" = "top") => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_EXPLORE_POSTS, mode],
    queryFn: ({ pageParam = null }) =>
      getExplorePosts({ pageParam, mode }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    keepPreviousData: true,
  });
};




export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedRecordId,
      postId,
      userId,
    }: {
      savedRecordId: string;
      postId: string;
      userId: string;
    }) =>
      deleteSavedPost(savedRecordId, postId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS, variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetSavedPosts = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
    queryFn: () => getSavedPosts(userId),
    enabled: !!userId,
    retry: 1,
    staleTime: 1000 * 60 * 2,
  });
};



export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.$id],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};


export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],

    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getInfinitePosts({ pageParam }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.documents.length === 0) return null;

      const lastId =
        lastPage.documents[lastPage.documents.length - 1].$id;

      return lastId;
    },
  });
};


export async function updatePostStats(post, updates) {
  const updatedPost = { ...post, ...updates };
  const { topScore, trendingScore } = calculateScores(updatedPost);

  return await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    post.$id,
    { ...updates, topScore, trendingScore }
  );
}


export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};



export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useSearchUsers = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: !!searchTerm,
  });
};

export const  useGetUsersById= (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useGetSavedPost = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
    queryFn: () => getSavedPosts(userId),
    enabled: !!userId,
    retry: 1, // prevents spam retries
  });
};


export const useReportPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
   mutationFn: async ({
  postId,
  userId,
  creatorId,
  reason,
  details,
}: {
  postId: string;
  userId: string;
  creatorId: string;
  reason: string;
  details?: string;
}) => {
      // check if already reported
      const existing = await databases.listDocuments(
        appwriteConfig.databaseId,
        "reports",
        [
          Query.equal("postId", postId),
          Query.equal("reportedBy", userId),
        ]
      );

      if (creatorId === userId) {
        throw new Error("You can't report your own meme");
      }

      if (!reason) throw new Error("Reason is required");

      if (existing.documents.length > 0) {
        throw new Error("You already reported this meme");
      }

      

      // create report
      return await databases.createDocument(
        appwriteConfig.databaseId,
        "reports",
        ID.unique(),
        {
          postId,
          reportedBy: userId,
          reason,
          details: details || "",
          status: "pending",
          createdAt: new Date().toISOString(),
        }
      );
    },

    onSuccess: () => {
      // optional refresh (if needed)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
    },
  });
}; 

export const useGetNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["GET_NOTIFICATIONS", userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,

    refetchOnWindowFocus: true,
    refetchInterval: 5000, // fallback refresh
  });
};



export const useNotificationCounts = (userId: string) => {
  return useQuery({
    queryKey: ["NOTIFICATION_COUNTS", userId],
    queryFn: async () => {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        "notifications",
        [
          Query.equal("receiver", userId),
          Query.equal("isRead", false),
        ]
      );

      const counts = {
        like: 0,
        save: 0,
        repost: 0,
        follow: 0,
        tag: 0,
      };

      res.documents.forEach((n: any) => {
        if (counts[n.type] !== undefined) {
          counts[n.type]++;
        }
      });

      return counts;
    },
    enabled: !!userId,
    refetchInterval: 5000,
  });
};

export async function markNotificationAsRead(id: string) {
  return await databases.updateDocument(
    appwriteConfig.databaseId,
    "notifications",
    id,
    { isRead: true }
  );
}


export const useGetUserAnalytics = (userId: string) => {
  return useQuery({
    queryKey: ["GET_ANALYTICS", userId],
    queryFn: () => getUserAnalytics(userId),
    enabled: !!userId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => followUser(followerId, followingId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS, variables.followingId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING, variables.followerId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHECK_IS_FOLLOWING],
        refetchType: "all",
      });
    },
  });
};


export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => unfollowUser(followerId, followingId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS, variables.followingId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWING, variables.followerId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHECK_IS_FOLLOWING],
      });
    },
  });
};

export const useGetNewFollowers = (userId: string) => {
  return useQuery({
    queryKey: ["NEW_FOLLOWERS", userId],
    queryFn: () => getNewFollowers(userId, 3),
    enabled: !!userId,
  });
};

export const useGetAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
    staleTime: 1000 * 60 * 2, // 2 min cache
  });
};

export const useGetFollowing = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWING, userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
};

export const useIsFollowing = (
  followerId: string,
  followingId: string
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.CHECK_IS_FOLLOWING,
      followerId,
      followingId,
    ],
    queryFn: () =>
      checkIsFollowing(followerId, followingId),
    enabled: !!followerId && !!followingId,
  });
};

export const useGetFollowersCount = (userId: string) => {
  return useQuery({
    queryKey: ["FOLLOWERS_COUNT", userId],
    queryFn: () => getFollowersCount(userId),
    enabled: !!userId,
  });
};

export const useGetFollowingCount = (userId: string) => {
  return useQuery({
    queryKey: ["FOLLOWING_COUNT", userId],
    queryFn: () => getFollowingCount(userId),
    enabled: !!userId,
  });
};
