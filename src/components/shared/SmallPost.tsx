import type { Models } from "appwrite";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import AiCon from "./AiCon";
import PostDetails from "./PostDetails";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

type Post = Models.Document & {
  caption: string;
  imageId: string;
  imageUrl?: string;
  likesCount: number;
  likes: Models.Document[];
  isRepost: boolean;
  repostCount: number;
  creator: {
    $id: string;
    username: string;
    imageUrl?: string;
    isVerified: boolean;
  };
};

type GridPostListProps = {
  posts: Post[];
};

const formatCount = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (num >= 100_000) return Math.floor(num / 1_000) + "K";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(".0", "") + "K";
  return num.toString();
};

const avatarImages = [
  "/assetss/emojis/rec-43re.png",
  "/assetss/emojis/rec-12re.png",
  "/assetss/emojis/rec-4re.png",
  "/assetss/emojis/rec-57re.png",
  "/assetss/emojis/rec-66re.png",
  "/assetss/emojis/rec-54re.png",
  "/assetss/emojis/rec-6re.png",
  "/assetss/emojis/rec-14re.png",
  "/assetss/emojis/rec-16re.png",
  "/assetss/emojis/rec-17re.png",
  "/assetss/emojis/rec-21re.png",
  "/assetss/emojis/rec-23re.png",
  "/assetss/emojis/rec-26re.png",
  "/assetss/emojis/rec-28re.png",
  "/assetss/emojis/rec-30re.png",
  "/assetss/emojis/rec-34re.png",
  "/assetss/emojis/rec-41re.png",
  "/assetss/emojis/rec-47re.png",
  "/assetss/emojis/rec-48re.png",
  "/assetss/emojis/rec-58re.png",
  "/assetss/emojis/rec-96re.png",
  "/assetss/emojis/rec-80re.png",
  "/assetss/emojis/rec-114re.png",
  "/assetss/emojis/rec-91re.png",
  "/assetss/emojis/rec-99re.png",
  "/assetss/emojis/rec-102re.png",
  "/assetss/emojis/rec-110re.png",
  "/assetss/emojis/rec-113re.png",
  "/assetss/emojis/rec-165re.png",
  "/assetss/emojis/rec-178re.png",
  "/assetss/emojis/rec-179re.png",
  "/assetss/emojis/rec-150re.png",
  "/assetss/emojis/rec-170re.png",
  "/assetss/emojis/rec-158re.png",
  "/assetss/emojis/rec-100re.png",
  "/assetss/emojis/rec-116re.png",
  "/assetss/emojis/rec-111re.png",
  "/assetss/emojis/rec-156re.png",
  "/assetss/emojis/rec-71re.png",
  "/assetss/emojis/rec-75re.png",
  "/assetss/emojis/rec-69re.png",
  "/assetss/emojis/rec-142re.png",
  "/assetss/emojis/rec-183re.png",
];

const SmallPost = ({ posts = [] }: GridPostListProps) => {
  // ✅ Hooks MUST be inside component
  const { data: currentUser } = useGetCurrentUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [shiftIndex, setShiftIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShiftIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAvatar = (seed: string, position: number) => {
    const baseIndex = seed.charCodeAt(0);
    const index =
      (baseIndex + shiftIndex + position) % avatarImages.length;
    return avatarImages[index];
  };

  return (
    <>
      <div className="porof-pos">
        {posts.map((post) => (
          <div
            key={post.$id}
            className="small-post-card"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPost(post);   // set correct post
              setOpenDialog(true);    
            }}
          >
            <img
              src={post.imageUrl}
              alt="post"
              className="post-explore-1m-m"
            />

            <div className="smallpost-overlay">
              <AvatarGroup >
                {Array.from({
                  length: Math.min(post.likesCount || 0, 3),
                }).map((_, index) => (
                  <Avatar key={index}>
                    <AvatarImage
                      src={getAvatar(post.$id, index)}
                    />
                    <AvatarFallback>
                      <AiCon />
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>

              <span className="l-c">
                {formatCount(post.likesCount || 0)}
                
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SINGLE GLOBAL MODAL */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="condit1ons">
          <DialogHeader>
            <DialogTitle className="diff">
              <img src="/assetss/images/block7.png" width={40} />
              <span className="ditf">Memeflix</span>
            </DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <PostDetails
              post={selectedPost}
              userId={currentUser?.$id || ""}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmallPost;