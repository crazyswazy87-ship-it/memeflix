import { ID, Query } from 'appwrite'
import type { INewPost, INewUser } from "../../types";   
import { account, appwriteConfig, avatars, databases, storage } from './config';


export async function createUserAccount(user :INewUser ){
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

     const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
     })


      return newUser;
    } catch (error) {
      console.log(error);
      return error;
    }

}

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
      user,
    )

    return newUser;
  } catch (error) {
    console.log(error)
  }

}

export async function signInAccount(user: { email: string; password: string })
{
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password);
             
      return session;
    }
    catch (error) {
      console.log(error);
    }
  }

export async   function getCurrentUser() {
  try {
    const currentAccount = await account.get();  
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [ Query.equal("accountId", currentAccount.$id)]
      
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  }catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  }catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    //upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    //Get file url
    const fileUrl = getFilePreview(uploadedFile.$id)

    if (!fileUrl) {
      deleteFile(uploadedFile.$id)
      throw Error;
    }

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        Caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,

      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error;
    }

    return newPost
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error)
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      600,   // smaller width
      600,   // smaller height
      'top',
      100     // lower quality = shorter UR
    )

    return fileUrl.toString();
  } catch (error) {
    console.log(error)
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
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt '), Query.limit(20)]
  )
  if (!posts) throw Error; 

  return posts;
}