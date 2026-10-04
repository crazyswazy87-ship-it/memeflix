import { useUserContext } from "@/constants/context/AuthContext";
import { formatCountRepost } from "@/lib/utils";
import type { Models } from "appwrite";
import { Link} from "react-router-dom";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import { ButtonGroup } from "@/components/ui/button-group";

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import WordReveal from "./WordReveal";
import { useDeletePost, useGetCurrentUser, useReportPost } from "@/lib/react-query/queriesAndMutations";
import PostStats from "./PostStats";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import VerifiedBadge from "./VerifiedBadge";
import { formatShortTimeAgo } from "./FormartShortTimeAgo";
import PostDetails from "./PostDetails";

import men from "../../../public/assetss/icons/more-svgrepo-com (1).svg"
import trash from "../../../public/assetss/icons/trush-square-svgrepo-com.svg"
import ruuse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg"
import ruse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg"
import repoo from "../../../public/assetss/icons/alarm-svgrepo-com.svg"
import detail from "../../../public/assetss/icons/maximize-1-svgrepo-com.svg"
import editt from "../../../public/assetss/icons/edit-svgrepo-com.svg"

type Post = Models.Document & {
  caption: string
  imageId: string
  imageUrl?: string
  previewUrl?: string   
  repostCount: number  
  originalPostId: string | null
  likes: Models.Document[]
  creator: {
    $id: string
    username: string
    imageUrl?: string
    isVerified: boolean
  }
}

type GridPostListProps = {
  posts: Post[];
  showUser?: boolean;
  showStats?: boolean;
   isLoading?: boolean;
};

const GridPostLists = ({
  posts,
  showUser = true,
  showStats = true,
  isLoading = false,
}: GridPostListProps) => {
  const { user } = useUserContext();
  const { mutate: deletePostMutation, isPending: isDeleting } = useDeletePost();
  const { mutateAsync: reportPost, isPending } = useReportPost();
  
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageLoad = (postId: string) => {
    setLoadedImages((prev) => ({ ...prev, [postId]: true }));
  };

  const handleImageError = (postId: string) => {
    setImageErrors((prev) => ({ ...prev, [postId]: true }));
  };

  const { data: currentUser } = useGetCurrentUser();
  const [openDialog, setOpenDialog] = useState(false);

  // GLOBAL modal state (BEST APPROACH)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false); 
  const [runUsernameShimmer, setRunUsernameShimmer] = useState(false)


  const [showCaption, setShowCaption] = useState(false)
  const handleDeletePost = (postId: string, imageId: string) => {
    deletePostMutation({ postId, imageId });
    toast.success("Meme deleted");
  };

  useEffect(() => {
  const timer = setTimeout(() => {
    setRunUsernameShimmer(true);
  }, 4000);

  return () => clearTimeout(timer);
}, []);

  const handleReport = async () => {
  try {
    if (!selectedPost) return;

    if (!reason) {
      return toast.error("Select a reason");
    }

    await reportPost({
      postId: selectedPost.$id,
      userId: user.id,
      creatorId: selectedPost.creator.$id,
      reason,
      details,
    });

    // SUCCESS MESSAGE (improved)
    toast.success("Report submitted. Thanks for keeping Memeflix safe");

    // CLOSE MODAL
    setOpen(false);

    // RESET STATE
    setSelectedPost(null);
    setReason("");
    setDetails("");

  } catch (err: any) {
    toast.error(err.message);
  }
};  

const SkeletonCard = () => (
   <Card className="w-full max-w-xs mt-5 post-card">
      <CardHeader>
      <div className="flex w-fit items-center gap-0 pl-0 b-topper">
        <Skeleton className=" wavy-circle-sign user-prof" />
        <div className="flex gap-12 align-middle">
          <Skeleton className="h-5 w-[190px]" />
          <Skeleton className="h-5 w-[90px]" />
        </div>
      </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full " />
      </CardContent>
        <div className="flex gap-9 ml-8 mt-2">
          <Skeleton className="h-3 w-[190px]" />
          <Skeleton className="h-3 w-[90px]" />
        </div>
    </Card>
);



 return (
  <>
    <div className="grid-container">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))
      ) : (
        posts
          ?.filter((post) => post && post.creator)
          .map((post) => (
            <div key={post.$id} className="post-card">
              <div className="topper">
                {showUser && (
                  <Link to={`/profile/${post.creator?.$id}`} className="user-prof wavy-circle">
                    <img
                      src={post.creator?.imageUrl || "/assetss/images/profile-pic.png"}
                      className="user-pro"
                      alt="Creator Avatar"
                    />
                  </Link>
                )}

                {showUser && (
                  <div className="topper-sec">
                    <Link to={`/profile/${post.creator?.$id}`}>
                      <div
                        className={`username-card ${
                          post.creator?.isVerified && runUsernameShimmer
                            ? "verified-shimmer"
                            : ""
                        }`}
                      >
                        <span className="kichele">
                          {post.creator?.username}
                          {post.creator?.isVerified && <VerifiedBadge />}
                        </span>
                      </div>
                    </Link>

                    <Link to={`/posts/${post.$id}`}>
                      <p className="user-time">
                        {formatShortTimeAgo(post.$createdAt)}
                      </p>
                    </Link>
                  </div>
                )}

                <div className="btrr btn-edit">
                  {(post.repostCount > 0 || post.originalPostId) && (
                    <p
                      className={`reused ${
                        post.repostCount === 0 ? "text-gray-400 opacity-60" : "text-white"
                      }`}
                    >
                      <img src={ruuse} className="reuse-icc" />
                      {formatCountRepost(post.repostCount)}
                    </p>
                  )}

                  <ButtonGroup>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <img
                            src={men}
                            alt="menu"
                            width={30}
                            height={30}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="desc-back">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <div className={`deta1ls-sec ${user?.id !== post.creator.$id && "hidden"}`}>
                              <Link
                                to={`/update-post/${post.$id}`}
                                className={`${user?.id !== post.creator.$id && "hidden"}`}
                              >
                                <img
                                  src={editt}
                                  alt="edit"
                                  width={23}
                                  height={23}
                                />
                              </Link>
                                <Link
                                  to={`/update-post/${post.$id}`}
                                  className={`tgl ${user?.id !== post.creator.$id ? "hidden" : ""}`}
                                >
                                  Edit
                                </Link>
                                </div>
                          </DropdownMenuItem>
                          {/* CONTROLLED DIALOG */}
                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                              <DialogContent className="condit1ons">
                                <DialogHeader>
                                  <DialogTitle className="diff">
                                    <img src="/assetss/images/block7.png" width={40} />
                                    <span className="ditf">Memeflix</span>
                                  </DialogTitle>
                                </DialogHeader>
          
                                <PostDetails
                                  post={post}
                                  userId={currentUser?.$id || ""}
                                />
                              </DialogContent>
                            </Dialog>
                          <DropdownMenuItem>
                            <div className="deta1ls-sec">
                              <Link to={`/repost/${post.$id}`}>
                                <img
                                  src= {ruse}
                                  alt="reuse"
                                  width={23}
                                  height={23}
                                  className="warn"
                                />
                              </Link>
                                <Link to={`/repost/${post.$id}`} className="tgl">
                                Reuse
                                </Link>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div 
                            className="deta1ls-sec">
                              <img
                                  src={detail}
                                  alt="details"
                                  width={28}
                                  height={28}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDialog(true);
                                  }}
                                  className="warn"
                                />
                                <span className="tgl" onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDialog(true);
                                  }}>
                                    Details
                                </span>
                            </div>
                            
                            
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {user.id !== post.creator.$id && (
                          <DropdownMenuItem>
                            <div className="deta1ls-sec">
                              <img
                                  src={repoo}
                                  alt="report"
                                  width={23}
                                  height={23}
                                  onClick={() => {
                                    setSelectedPost(post);
                                    setOpen(true);
                                  }}
                                  className="warn"
                                />
                              <span
                              className="tgl"
                              onClick={() => {
                                setSelectedPost(post);
                                setOpen(true);
                              }}
                            >
                              Report
                            </span>
                            </div>
                          </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              !isDeleting &&
                              handleDeletePost(post.$id, post.imageId)
                            }
                          >
                            <div className="deta1ls-sec">
                              <img
                                src={trash}
                                alt="delete"
                                width={23}
                                height={23}
                                className={`${user?.id !== post?.creator.$id && "hidden"}`}
                              />
                              <p className={`tgl ${user?.id !== post?.creator.$id && "hidden"}`}
                                onClick={() =>
                              !isDeleting &&
                              handleDeletePost(post.$id, post.imageId)
                            }>
                                Delete
                              </p>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ButtonGroup>
                  
                </div>
              </div>

              <div className="idk">
                {showCaption && (
                  <motion.div
                    className="idk-cap"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setShowCaption(false)}
                  >
                    <WordReveal text={post.caption} speed={120} />
                  </motion.div>
                )}

                <div className="post-img-wrapper">
              {/* Only load a separate preview when one exists. */}
              {post.previewUrl && (
                <img
                  src={post.previewUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={`post-img ${loadedImages[post.$id] ? "sharp" : "blur"}`}
                />
              )}

              {/* FULL IMAGE */}
              <img
                src={post.imageUrl}
                alt="Post Image"
                className={`post-img absolute top-0 left-0 transition-opacity duration-300 ${
                  loadedImages[post.$id] ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad(post.$id)}
                onError={() => handleImageError(post.$id)}
                onClick={() => setShowCaption(!showCaption)}
              />

              {/* FALLBACK */}
              {imageErrors[post.$id] && (
                <img
                  src="/assetss/images/default-meme.png"
                  className="post-img"
                  alt="fallback"
                />
              )}
            </div>

            </div>

              <PostStats post={post} userId={user.id} />
            </div>
          ))
      )}
    </div>

    {/*REPORT MODAL (moved outside map) */}
    {open && (
      <div className="rep0o">
        <div className="rep0o">
          <h3 className="text-white font-bold">Report This Meme</h3>

          <select
            className="w-full p-2 bg-black text-white rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select reason</option>
            <option value="spam">Spam</option>
            <option value="nudity">Nudity</option>
            <option value="hate">Hate Speech</option>
            <option value="violence">Violence</option>
          </select>

          <textarea
            className="w-full p-2 bg-black text-white rounded"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <div className="flex justify-between p-4">
            <button onClick={() => setOpen(false)} className="repo-btnn">
              Cancel
            </button>

            <button
              onClick={handleReport}
              disabled={isPending || !reason}
              className="repo-btn"
            >
              {isPending ? "Reporting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)};

export default GridPostLists;