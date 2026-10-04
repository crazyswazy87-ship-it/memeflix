import {  ID, Query } from 'appwrite'
import type {
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateUser,
} from "../../types";

import {
  account,
  appwriteConfig,
  avatars,
  databases,
  storage,
} from "./config";
import { safeTrendingScore } from '../utils';


/* =========================================================
   EMAIL OTP SIGNUP FLOW
========================================================= */

export async function sendEmailOTP(email: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();

    const token = await account.createEmailToken(
      ID.unique(),
      cleanEmail
    );

    if (!token?.userId) {
      throw new Error("Failed to create verification token");
    }

    return token; // { userId, expire, phrase }
  } catch (error: any) {
    console.error("SEND EMAIL OTP ERROR:", error);

    if (error?.code === 409) {
      throw new Error("An account with this email already exists");
    }

    throw new Error(
      error?.message || "Unable to send verification code"
    );
  }
}

export async function verifyEmailOTP({
  userId,
  secret,
}: {
  userId: string;
  secret: string;
}) {
  try {
    const session = await account.createSession(userId, secret);

    if (!session) {
      throw new Error("Verification failed");
    }

    return session;
  } catch (error: any) {
    console.error("VERIFY EMAIL OTP ERROR:", error);

    throw new Error(
      error?.message || "Invalid or expired verification code"
    );
  }
}

export async function completeEmailSignup({
  name,
  username,
  password,
}: {
  name: string;
  username: string;
  password: string;
}) {
  try {
    // Requires an active session — created in verifyEmailOTP above
    const current = await account.get();

    if (!current) {
      throw new Error(
        "Your session expired. Please verify your email again."
      );
    }

    const reserved = [
      "memeflix",
      "memeflixx",
      "memeflixxx",
      "memefliix",
      "memefliixx",
      "memefl1x",
      "memefl1xx",
    ];

    const cleanUsername = username.trim().toLowerCase();
    const cleanName = name.trim();

    if (reserved.includes(cleanUsername)) {
      throw new Error("That username is reserved");
    }

    const existing = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("username", cleanUsername), Query.limit(1)]
    );

    if (existing.documents.length > 0) {
      throw new Error("That username is already taken");
    }

    await account.updateName(cleanName);
    await account.updatePassword(password);

    const avatarUrl = avatars.getInitials(cleanName);

    const newUser = await saveUserToDB({
      accountId: current.$id,
      email: current.email,
      name: cleanName,
      imageUrl: avatarUrl.toString(),
      username: cleanUsername,
    });

    if (!newUser) {
      throw new Error("Failed to save your profile");
    }

    return newUser;
  } catch (error: any) {
    console.error("COMPLETE EMAIL SIGNUP ERROR:", error);

    throw new Error(
      error?.message ||
        "Something went wrong while creating your account"
    );
  }
}

/* =========================================================
   SAVE USER TO DATABASE
========================================================= */

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error: any) {
    console.error("DB ERROR:", error);

    throw new Error(
      error?.message ||
        "Failed to save user in database"
    );
  }
}

export async function createUserAccount(
  user: INewUser
) {
  try {
    const reserved = [
      "memeflix",
      "memeflixx",
      "memeflixxx",
      "memefliix",
      "memefliixx",
      "memefl1x",
      "memefl1xx",
    ];

    const cleanUsername = user.username
      .trim()
      .toLowerCase();

    const cleanEmail = user.email
      .trim()
      .toLowerCase();

    const cleanName = user.name.trim();

    if (reserved.includes(cleanUsername)) {
      throw new Error("Username is reserved");
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE APPWRITE ACCOUNT
    |--------------------------------------------------------------------------
    */

    const newAccount = await account.create(
      ID.unique(),
      cleanEmail,
      user.password,
      cleanName
    );

    if (!newAccount) {
      throw new Error(
        "Account creation failed"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE AVATAR
    |--------------------------------------------------------------------------
    */

    const avatarUrl = avatars.getInitials(
      cleanName
    );


    /*
    |--------------------------------------------------------------------------
    | SAVE USER PROFILE
    |--------------------------------------------------------------------------
    */

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl.toString(),
      username: cleanUsername,
    });

    if (!newUser) {
      throw new Error(
        "Failed to create user profile"
      );
    }

    return newUser;

  } catch (error: any) {
    console.error(
      "CREATE USER ERROR:",
      error
    );

    if (error?.code === 409) {
      throw new Error(
        "Email already exists"
      );
    }

    throw new Error(
      error?.message ||
        "Something went wrong creating your account"
    );
  }
}

  export async function signInWithGoogle() {
    const successUrl = `${window.location.origin}/auth/oauth-callback`;
    const failureUrl = `${window.location.origin}/sign-in`;

    return account.createOAuth2Session(
      "google",
      successUrl,
      failureUrl
    );
    }


export async function signInAccount(user: {
  email: string;
  password: string;
}) {
  try {
    const session =
      await account.createEmailPasswordSession(
        user.email.trim(),
        user.password
      );

    return session;

  } catch (error: any) {
    console.error(
      "SIGN IN ERROR:",
      error
    );

    throw new Error(
      error?.message ||
        "Unable to sign in"
    );
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount =
      await account.get();

    return currentAccount;

  } catch (error: any) {
    if (error?.code === 401) {
      return null;
    }

    console.error(
      "GET CURRENT USER ERROR:",
      error
    );

    return null;
  }
}

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

export async function signOutAccount() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error: any) {
    console.error(
      "SIGN OUT ERROR:",
      error
    );

    throw new Error(
      error?.message ||
        "Unable to sign out"
    );
  }
}

export async function createPost(post: INewPost) {
  try {
    let fileUrl = post.imageUrl;
    let imageId = post.imageId;

    // ONLY upload if a new file exists
    if (post.file && post.file.length > 0) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw new Error("Upload failed");

      fileUrl = getFilePreview(uploadedFile.$id);
      imageId = uploadedFile.$id;

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("File preview failed");
      }
    }

    // Ensure we have an image 
    if (!fileUrl || !imageId) {
      throw new Error("No image provided");
    }

    const newPost = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    ID.unique(),
    {
      creator: post.userId,
      caption: post.caption,
      imageUrl: fileUrl,
      imageId: imageId,

      originalPostId: post.originalPostId || post.postId,

      likesCount: 0,
      savesCount: 0,
      repostCount: 0,
      topScore: 0,
      trendingScore: 0,
    }
  );

    return newPost;

  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file?: File) {
  if (!file) return null; 

  try {
    return await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
  } catch (error) {
    console.log(error);
  }
}

export  function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId)
      //1000,   // smaller width
      //1000,   // smaller height
      //'top',
      //100     // lower quality = shorter UR
    //)

    return fileUrl;
  } catch (error) {
    console.log(error)
  }
} 

export async function incrementRepostCount(
  postId: string,
  userId: string
) {
  try {
   const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    //my root post
    const rootPostId = post.originalPostId || post.$id;

    const rootPost = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      rootPostId
    );

    // now increment ROOT
    const repostCount = (rootPost.repostCount ?? 0) + 1;

    const hoursSincePost =
      (Date.now() - new Date(post.$createdAt).getTime()) / 3600000;

    const topScore =
      (post.likesCount || 0) * 2 +
      (post.savesCount || 0) * 5 +
      repostCount * 3;

    const timeDecay = Math.exp(-hoursSincePost / 24);

    const velocity =
      ((post.likesCount || 0) +
        (post.savesCount || 0) +
        repostCount) /
      Math.max(hoursSincePost, 1);

    const trendingScore = Math.round(
      topScore * timeDecay * (1 + velocity)
    );

    await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    rootPostId,
    {
      repostCount,
      topScore,
      trendingScore,
    }
  );

    //NOTIFICATION
    await createNotification({
      type: "repost",
      receiver: rootPost.creator, 
      sender: userId,
      postId: rootPostId, 
    });

  } catch (error) {
    console.log(error  ,"no repost i can send");
  }
}

export async function getNotifications(userId: string) {
  try {
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      "notifications",
      [
        Query.equal("receiver", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
        Query.select([
          "*",
          "sender.$id",
          "sender.name",
          "sender.username",
          "sender.imageUrl",
          "sender.isVerified",
        ]),
      ]
    );

    // The sender relationship is selected with the notification query.
    // This removes the old N+1 pattern (one user request per notification).
    return res;
  } catch (error) {
    console.log(error);
    return { documents: [], total: 0 };
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  return databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [
      Query.orderDesc("$createdAt"),
      Query.limit(30),
      Query.select([
        "*",
        "creator.$id",
        "creator.name",
        "creator.username",
        "creator.imageUrl",
        "creator.isVerified",
      ]),
    ]
  );
}

export async function likePost({
  postId,
  userId,
  emoji,
}: {
  postId: string;
  userId: string;
  emoji: string;
}) {
  try {
    const existing = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [
        Query.equal("post", postId),
        Query.equal("user", userId),
      ]
    );

    let isNewLike = false;
    let result;

    if (existing.documents.length > 0) {
      // update emoji only
      result = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        existing.documents[0].$id,
        { emoji }
      );
    } else {
      isNewLike = true;

      result = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.likesCollectionId,
        ID.unique(),
        {
          user: userId,
          post: postId,
          emoji,
        }
      );
    }

    // SAFE COUNT (fix race condition here)
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [Query.equal("post", postId)]
    );

    const likesCount = likes.total; // 🔥 IMPORTANT FIX

    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    const hoursSincePost =
      (Date.now() - new Date(post.$createdAt).getTime()) / 3600000;

    const topScore =
      likesCount * 2 +
      (post.savesCount || 0) * 5 +
      (post.repostCount || 0) * 3;

    const timeDecay = Math.exp(-hoursSincePost / 24);

    const velocity =
      (likesCount + (post.savesCount || 0) + (post.repostCount || 0)) /
      Math.max(hoursSincePost, 1);

    const rawScore = topScore * timeDecay * (1 + velocity);
    const trendingScore = safeTrendingScore(rawScore);

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likesCount,
        topScore,
        trendingScore,
      }
    );

    

    await createNotification({
      type: "like",
      receiver: post.creator,
      sender: userId,
      postId,
      emoji,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getLikes(postId: string) {
  return await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.likesCollectionId,
    [Query.equal("post", postId)]
  );
}

export async function savePost(postId: string, userId: string) {
  try {
    const saved = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    const saves = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("post", postId)]
    );

    const savesCount = saves.documents.length;

    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    const hoursSincePost =
      (Date.now() - new Date(post.$createdAt).getTime()) / 3600000;

    const topScore =
      (post.likesCount || 0) * 2 +
      savesCount * 5 +
      (post.repostCount || 0) * 3;

    const timeDecay = Math.exp(-hoursSincePost / 24);

    const velocity =
      ((post.likesCount || 0) + savesCount + (post.repostCount || 0)) /
      Math.max(hoursSincePost, 1);

   const rawScore = topScore * timeDecay * (1 + velocity);
   const trendingScore = safeTrendingScore(rawScore);

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        savesCount,
        topScore,
        trendingScore,
      }
    );

    // NOTIFICATION
    await createNotification({
      type: "save",
      receiver: post.creator,
      sender: userId,
      postId,
    });

    return saved;
  } catch (error: any) {
    if (error?.code === 409) return null;
    throw error;
  }
}

export async function deleteSavedPost(savedRecordId: string, postId: string) {
  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.savesCollectionId,
    savedRecordId
  );

  const saves = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.savesCollectionId,
    [Query.equal("post", postId)]
  );

  const savesCount = saves.documents.length;

  const post = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId
  );

  const hoursSincePost =
    (Date.now() - new Date(post.$createdAt).getTime()) / 3600000;

  const topScore =
    (post.likesCount || 0) * 2 +
    savesCount * 5 +
    (post.repostCount || 0) * 3;

  const timeDecay = Math.exp(-hoursSincePost / 24);

  const velocity =
    ((post.likesCount || 0) + savesCount + (post.repostCount || 0)) /
    Math.max(hoursSincePost, 1);

  const rawScore = topScore * timeDecay * (1 + velocity);
  const trendingScore = safeTrendingScore(rawScore);

  await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    {
      savesCount,
      topScore,
      trendingScore,
    }
  );
}


export async function getSavedPosts(userId: string) {
  try {
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [
        Query.equal("user", userId),
         Query.orderDesc("$createdAt"),
        Query.limit(50),
        Query.select([
          "*",
          "post.*",
          "post.creator.$id",
          "post.creator.name",
          "post.creator.username",
          "post.creator.imageUrl",
          "post.creator.isVerified",
        ])
      ]
    );

    return savedPosts.documents;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      [
        Query.select([
          "*",
          "creator.*"
        ])
      ]
    );

    return post;
  } catch (error) {
    console.log(error);
  }
}


export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file && post.file.length > 0;

  try {
    let imageUrl = post.imageUrl;
    let imageId = post.imageId;

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("Upload failed");

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) throw new Error("Preview failed");

      imageUrl = fileUrl;
      imageId = uploadedFile.$id;
    }

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,  
        imageUrl,             
        imageId,
      }
    );

    return updatedPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deletePost(postId: string, imageid: string) {
  if(!postId || !imageid) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}


export async function getPostsWithLikes(posts: any[]) {
  // likesCount is maintained on the post document. Never scan the likes
  // collection once per post just to calculate a count.
  return posts.map((post) => ({
    ...post,
    likesCount: post.likesCount ?? 0,
  }));
}

export async function getInfinitePosts({
  pageParam,
  mode = "latest",
}: {
  pageParam?: string | null;
  mode?: "latest" | "trending";
}) {
  const queries: any[] = [
    Query.limit(20),
    Query.select([
      "*",
      "creator.$id",
      "creator.name",
      "creator.username",
      "creator.imageUrl",
      "creator.isVerified",
    ]),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  // Sorting happens in Appwrite using indexed denormalized fields.
  // We do not fetch every like document and sort in the browser.
  queries.push(
    Query.orderDesc(
      mode === "trending" ? "trendingScore" : "$createdAt"
    )
  );

  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    queries
  );

  return posts;
}
// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  const term = searchTerm.trim();
  if (!term) return { documents: [], total: 0 };

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.search("caption", term),
        Query.limit(30),
        Query.select([
          "*",
          "creator.$id",
          "creator.name",
          "creator.username",
          "creator.imageUrl",
          "creator.isVerified",
        ]),
      ]
    );

    return posts;
  } catch (error) {
    console.log(error);
    return { documents: [], total: 0 };
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function searchUsers(searchTerm: string) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.search("username", searchTerm), // change field if needed
        Query.limit(20),
      ]
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}


export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      [
        Query.select([
          "*",
        ]),
      ]
    );

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        username: user.username,
        bio: user.bio,
        ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}



export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [
          Query.equal("creator", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(50),
          Query.select([
            "*",
            "creator.$id",
            "creator.name",
            "creator.username",
            "creator.imageUrl",
            "creator.isVerified",
          ]),
        ]
      );
      return res.documents;
    },
  });
};


// ============Analytics
export async function getUserAnalytics(userId: string) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId),

      Query.select([
      "*",
      "creator.$id",
      "creator.username",
      "creator.imageUrl",
      "creator.isVerified",
    ]),
      ]
    );

    const posts = response.documents;

    const totalPosts = posts.length;

    // ✅ USE REAL COUNTERS (premium accurate)
    const totalLikes = posts.reduce(
      (acc, post) => acc + (post.likesCount || 0),
      0
    );

    const totalSaves = posts.reduce(
      (acc, post) => acc + (post.savesCount || 0),
      0
    );

    const totalReposts = posts.reduce(
      (acc, post) => acc + (post.repostCount || 0),
      0
    );

    return {
      posts,
      totalPosts,
      totalLikes,
      totalSaves,     // ✅ NEW
      totalReposts,
    };
  } catch (error) {
    console.log(error);
  }
}


type GetExplorePostsProps = {
  pageParam?: string | null;
  mode?: "top" | "trending";
};


//emza
export async function getAdminAnalytics() {
  try {
    const [postsRes, usersRes, followsRes] = await Promise.all([
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.limit(1000)]
      ),

      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.limit(1000)]
      ),

      databases.listDocuments(
        appwriteConfig.databaseId,
        "follows",
        [Query.limit(1000)]
      ),
    ]);

    const posts = postsRes.documents;

    // CORE PLATFORM METRICS
    const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);
    const totalSaves = posts.reduce((sum, p) => sum + (p.savesCount || 0), 0);
    const totalReposts = posts.reduce((sum, p) => sum + (p.repostCount || 0), 0);

    // ENGAGEMENT RATE
    const totalEngagement = totalLikes + totalSaves + totalReposts;

    // TOP POSTS (important for admin panel)
    const topPosts = [...posts]
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, 10);

    // GROWTH SIGNAL
    const recentPosts = posts.filter((p) => {
      const created = new Date(p.$createdAt);
      const now = new Date();
      return now.getTime() - created.getTime() < 7 * 24 * 60 * 60 * 1000;
    });

    return {
      users: usersRes.total,
      posts: postsRes.total,
      follows: followsRes.total,

      totalLikes,
      totalSaves,
      totalReposts,
      totalEngagement,

      topPosts,
      recentPostsCount: recentPosts.length,
      rawPosts: posts,
    };
  } catch (err) {
    console.error("Admin analytics error:", err);
    return null;
  }
}


export const getExplorePosts = async ({
  pageParam,
  mode = "top",
}: GetExplorePostsProps) => {
  try {
    const queries: any[] = [
      Query.limit(10),
      Query.select(["*", "creator.*"]), 
    ];

    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }

    if (mode === "top") {
      queries.push(Query.orderDesc("topScore"));
    }

    if (mode === "trending") {
      queries.push(Query.orderDesc("trendingScore"));
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    return {
      documents: response.documents,
      nextCursor:
        response.documents.length === 10
          ? response.documents[response.documents.length - 1].$id
          : null,
    };
  } catch (error) {
    console.error("Error fetching explore posts:", error);
    throw error;
  }
};

export async function createNotification({
  type,
  receiver,
  sender,
  postId,
  emoji,
}: {
  type: "like" | "save" | "repost" | "follow" | "mention";
  receiver: string;
  sender: string;
  postId?: string;
  emoji?: string;
}) {
  try {
    // prevent self notification
    if (receiver === sender) return null;

    // build query safely
    const queries: any[] = [
      Query.equal("type", type),
      Query.equal("sender", sender),
      Query.equal("receiver", receiver),
    ];

    // only attach postId for post-based notifications
    if (type !== "follow" && postId) {
      queries.push(Query.equal("post", postId));
    }

    // check duplicates
    const existing = await databases.listDocuments(
      appwriteConfig.databaseId,
      "notifications",
      queries
    );

    // OPTION 1: allow repost duplicates
  if (type !== "repost") {
    if (existing.documents.length > 0) return null;
  };

    // create notification
    return await databases.createDocument(
      appwriteConfig.databaseId,
      "notifications",
      ID.unique(),
      {
        type,
        receiver,
        sender,
        post: type === "follow" ? null : postId || null,
        emoji: emoji || null,
        isRead: false,
      }
    );
  } catch (error) {
    console.log("Notification error:", error);
    return null;
  }
}


export async function syncFollowerCount(userId: string) {
  const followers = await databases.listDocuments(
    appwriteConfig.databaseId,
    "follows",
    [Query.equal("followingId", userId)]
  );

  const following = await databases.listDocuments(
    appwriteConfig.databaseId,
    "follows",
    [Query.equal("followerId", userId)]
  );

  await databases.updateDocument(
    appwriteConfig.databaseId,
    "users",
    userId,
    {
      followersCount: followers.total,
      followingCount: following.total,
    }
  );
}

export async function followUser(followerId: string, followingId: string) {
  if (!followerId || !followingId) return null;

  try {
    const follow = await databases.createDocument(
      appwriteConfig.databaseId,
      "follows",
      ID.unique(),
      { followerId, followingId }
    );

    // sync counts AFTER write (safe)
    await Promise.all([
      syncFollowerCount(followerId),
      syncFollowerCount(followingId),
    ]);

     await createNotification({
      type: "follow",
      receiver: followingId, // person being followed
      sender: followerId,    // person who followed
      postId: "none",        // IMPORTANT FIX (no post for follow)
    });

    return follow;
  } catch (error: any) {
    // Appwrite will throw error if duplicate (because of UNIQUE index)
    console.log("FOLLOW ERROR:", error);
  }
}


export async function unfollowUser(followerId: string, followingId: string) {
  try {
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      "follows",
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
      ]
    );

    if (res.documents.length === 0) return null;

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      "follows",
      res.documents[0].$id
    );

    await Promise.all([
      syncFollowerCount(followerId),
      syncFollowerCount(followingId),
    ]);

    return true;
  } catch (error) {
    console.log(error);
  }
}


export async function getNewFollowers(userId: string, days = 3) {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      "follows",
      [
        Query.equal("followingId", userId),
        Query.greaterThanEqual("$createdAt", fromDate.toISOString()),
      ]
    );

    return res.total; 
  } catch (error) {
    console.log("NEW FOLLOWERS ERROR:", error);
    return 0;
  }
}

export async function checkIsFollowing(
  followerId: string,
  followingId: string
) {
  if (!followerId || !followingId) return false; // prevents crashes when following

  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    "follows",
    [
      Query.equal("followerId", followerId),
      Query.equal("followingId", followingId),
    ]
  );

  return res.documents.length > 0;
}        

export async function getFollowersCount(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      [Query.select(["followersCount"])]
    );

    return user.followersCount ?? 0;
  } catch {
    return 0;
  }
}

export async function getFollowingCount(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      [Query.select(["followingCount"])]
    );

    return user.followingCount ?? 0;
  } catch {
    return 0;
  }
}

export async function getFollowers(userId: string) {
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    "follows",
    [
      Query.equal("followingId", userId),
      Query.limit(100),
      Query.orderDesc("$createdAt"),
    ]
  );

  return res.documents;
}

export async function getFollowing(userId: string) {
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    "follows",
    [
      Query.equal("followerId", userId),
      Query.limit(100),
      Query.orderDesc("$createdAt"),
    ]
  );

  return res.documents;
}

export const useGetFollowers = (userId: string) => {
  return useQuery({
    queryKey: ["FOLLOWERS", userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
};

export const useGetFollowing = (userId: string) => {
  return useQuery({
    queryKey: ["FOLLOWING", userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
};


export async function createNote(note: {
  text: string;
  userId: string;
  users?: string[];
  mentions?: string[];
  isVerified: boolean;
  username: string;
  imageUrl: string;
  emoji: string;
  expiresAt: string;
}) {
  const newNote = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.notesCollectionId,
    ID.unique(),
    {
      text: note.text,
      user: note.userId,
      username: note.username,
      imageUrl: note.imageUrl,
      users: note.users || [],
      mentions: note.mentions || [],
      expiresAt: note.expiresAt,
      isVerified: note.isVerified,
      emoji: note.emoji || "",
    }
  );

  // ✅ SEND NOTIFICATIONS FOR MENTIONS
  if (note.mentions?.length) {
  await Promise.all(
    note.mentions.map(async (mentionedUserId) => {
      await createNotification({
        type: "mention",
        receiver: mentionedUserId,
        sender: note.userId,
        postId: newNote.$id,
      });
    })
  );
}

  return newNote;
}

export async function getNotes() {
  const now = new Date().toISOString();

  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.notesCollectionId,
    [
      Query.greaterThan("expiresAt", now),

      Query.orderDesc("$createdAt"),
    ]
  );

  return response.documents;
}

export async function deleteNote(noteId: string) {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      noteId
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
