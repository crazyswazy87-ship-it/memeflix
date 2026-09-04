import type { Models } from "appwrite";
import type React from "react";


export type SavedPost = Models.Document & {
  post: Post;   // relation field
  user: Models.Document;
};

export type Save = Models.Document & {
  post: {
    $id: string;
  };
};

export type User = Models.Document & {
  $id: string;
};

export type Post = Models.Document & {
  caption: string;
  imageUrl: string;
  creator: User;
  likes: Models.Document[];
};

export type IContextType = 
{
  user: IUser;
  isLoading: boolean;
  isVerified:boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  username: string;
  bio: string;
  imageId: string;
  phoneNumber:string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  imageUrl?: string;
  imageId?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
};

export type INote = {
  $id: string;
  text: string;

  user: {
    $id: string;
    username: string;
    imageUrl?: string;
    isVerified: boolean; 
  };

  users?: string[];

  mentions?: string[];

  expiresAt: string;

  $createdAt: string;
  $updatedAt: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  imageUrl: string;
  bio: string;
  isVerified: boolean;
  isMods: boolean;
  isAdmin: boolean;
};

export type INewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
};