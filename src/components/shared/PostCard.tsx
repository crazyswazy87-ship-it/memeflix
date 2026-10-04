import { formatCountRepost, multiFormatDateString } from "@/lib/utils";
import type { Models } from "appwrite";
import { Link } from "react-router";

import { useUserContext } from "@/constants/context/AuthContext";

import { useInView } from "framer-motion";
import { useRef } from "react";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import comment from "../../../public/assetss/icons/message-text-1-svgrepo-com (4).svg";


import {
  useDeletePost,
  useGetCurrentUser,
  useReportPost,
} from "@/lib/react-query/queriesAndMutations";

import { ButtonGroup } from "@/components/ui/button-group";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";

import WordReveal from "./WordReveal";
import VerifiedBadge from "./VerifiedBadge";
import PostDetails from "./PostDetails";
import PostStats from "./PostStats";

import { toast } from "sonner";

import men from "../../../public/assetss/icons/more-svgrepo-com (1).svg";
import trash from "../../../public/assetss/icons/trush-square-svgrepo-com.svg";
import ruse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg";
import repoo from "../../../public/assetss/icons/alarm-svgrepo-com.svg";
import detail from "../../../public/assetss/icons/maximize-1-svgrepo-com.svg";
import editt from "../../../public/assetss/icons/edit-svgrepo-com.svg";


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import Comments from "./Comments";


// ======================================================
// TYPES
// ======================================================

type Post = Models.Document & {
  caption: string;
  imageId: string;
  imageUrl?: string;
  previewUrl?: string;

  likes: Models.Document[];

  originalPostId: string | null;

  repostCount: number;

  savesCount?: number;

  creator: {
    $id: string;
    username: string;
    imageUrl?: string;
    isVerified: boolean;
  };
};


type PostCardProps = {
  post: Post;
};


// ======================================================
// ANIMATED COMMENTS
// ======================================================

interface Comment {
  id: string;
  username: string;
  text: string;
}


const comments: Comment[] = [
  {
    id: "1",
    username: "jummu.man33",
    text: "This is actually insane 😂",
  },
  {
    id: "2",
    username: "Amina",
    text: "Nahhh this is 🔥🔥",
  },
  {
    id: "3",
    username: "Wanjiku",
    text: "Okay this one goes hard 👀",
  },
  {
    id: "4",
    username: "Brian",
    text: "Bro really cooked with this 😂",
  },
  {
    id: "5",
    username: "Zuri",
    text: "I need this immediately 😭",
  },
];


const commentUsers = [
  {
    id: "1",
    name: "Amina",
    imageUrl:
      "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "2",
    name: "Brian",
    imageUrl:
      "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "3",
    name: "Wanjiku",
    imageUrl:
      "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "4",
    name: "Kevin",
    imageUrl:
      "https://randomuser.me/api/portraits/men/75.jpg",
  },
];


const AnimatedComments = ({
  users,
}: {
  users: typeof commentUsers;
}) => {

  const [commentIndex, setCommentIndex] = useState(0);


  useEffect(() => {

    const interval = setInterval(() => {

      setCommentIndex(
        (prev) =>
          (prev + 1) % comments.length
      );

    }, 6000);


    return () => clearInterval(interval);

  }, []);


  const comment = comments[commentIndex];


  return (
    <div className="liked-by">

      {/* PEOPLE */}

      <div className="people-here">

        <div className="avatar-stack">

          {users.slice(0, 3).map(
            (user, index) => (

              <div
                className="wavy-avatar-border"
                key={user.id}
                style={{
                  zIndex: 3 - index,
                }}
              >

                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="wavy-circle-tabs"
                />

              </div>

            )
          )}

        </div>


        {users.length > 3 && (

          <span className="people-count">

            <span className="comment-count">
              +{" "}
              {formatCountRepost(
                users.length - 3
              )}
            </span>

            

          </span>

        )}

      </div>


      {/* COMMENT */}

      <div className="comment-window">

        <AnimatePresence
          mode="popLayout"
          initial={false}
        >

          <motion.div
            key={comment.id}
            className="comment-line"

            initial={{
              y: 25,
              opacity: 0,
            }}

            animate={{
              y: 0,
              opacity: 1,
            }}

            exit={{
              y: -25,
              opacity: 0,
            }}

            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <strong className="plugwalk">
              {comment.username}
            </strong>

            <span>
              {comment.text}
            </span>

          </motion.div>

        </AnimatePresence>

      </div>

    </div>
  );
};


// ======================================================
// POST CARD
// ======================================================

const PostCard = ({
  post,
}: PostCardProps) => {

  const { user } = useUserContext();

  const { data: currentUser } =
    useGetCurrentUser();


  // ====================================================
  // MUTATIONS
  // ====================================================

  const {
    mutate: deletePostMutation,
    isPending: isDeleting,
  } = useDeletePost();


  const {
    mutateAsync: reportPost,
    isPending: isReporting,
  } = useReportPost();


  // ====================================================
  // IMAGE
  // ====================================================

  const [imgLoaded, setImgLoaded] =
    useState(false);

  const [imgError, setImgError] =
    useState(false);


  // ====================================================
  // CAPTION
  // ====================================================

  const [showCaption, setShowCaption] =
    useState(false);


  // ====================================================
  // VERIFIED SHIMMER
  // ====================================================

  const [
    runUsernameShimmer,
    setRunUsernameShimmer,
  ] = useState(false);


  // ====================================================
  // SAVE STATE
  // ====================================================

  // ====================================================
  // REPORT
  // ====================================================

  const [reason, setReason] =
    useState("");

  const [details, setDetails] =
    useState("");

  const [open, setOpen] =
    useState(false);


  // ====================================================
  // DETAILS DIALOG
  // ====================================================

  const [openDialog, setOpenDialog] =
    useState(false);


  // ====================================================
  // CARD ANIMATION
  // ====================================================

  const cardRef = useRef(null);

  const isInView = useInView(
    cardRef,
    {
      once: true,
    }
  );


  // ====================================================
  // VERIFIED SHIMMER
  // ====================================================

  useEffect(() => {

    if (!isInView) return;


    const timer = setTimeout(() => {

      setRunUsernameShimmer(true);

    }, 4000);


    return () =>
      clearTimeout(timer);

  }, [isInView]);


  // ====================================================
  // CAPTION DELAY
  // ====================================================

  useEffect(() => {

    const timer = setTimeout(() => {

      setShowCaption(true);

    }, 800);


    return () =>
      clearTimeout(timer);

  }, []);


  // ====================================================
  // REUSE
  // ====================================================

  const handleReuse = () => {

    window.location.href =
      `/repost/${post.$id}`;

  };


  // ====================================================
  // DELETE
  // ====================================================

  const handleDeletePost = () => {

    if (isDeleting) return;


    deletePostMutation(

      {
        postId: post.$id,
        imageId: post.imageId,
      },

      {
        onSuccess: () => {

          toast.success(
            "Meme deleted"
          );

        },

        onError: () => {

          toast.error(
            "Failed to delete meme"
          );

        },
      }

    );

  };


  // ====================================================
  // REPORT
  // ====================================================

  const handleReport = async () => {

    try {

      if (!reason) {

        return toast.error(
          "Select a reason"
        );

      }


      await reportPost({

        postId: post.$id,

        userId:
          user.id,

        creatorId:
          post.creator.$id,

        reason,

        details,

      });


      toast.success(
        "Report submitted. Thanks for keeping Memeflix safe"
      );


      setOpen(false);

      setReason("");

      setDetails("");

    } catch (err: any) {

      toast.error(
        err.message
      );

    }

  };


  // ====================================================
  // SAFETY
  // ====================================================

  if (!post.creator) {
    return null;
  }


  // ====================================================
  // COUNTS
  // ====================================================

  const repostCount =
    post.repostCount || 0;


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <>

      <article
        ref={cardRef}
        className="post-card"
      >

        {/* ==========================================
            USER
        =========================================== */}

        <div className="post-user">

          <Link
            to={`/profile/${post.creator.$id}`}
            className="avatar-wrapper wavy-circle-cxl"
          >

            <img
              src={
                post.creator.imageUrl ||
                "/assetss/icons/profile-placeholder.svg"
              }
              alt="Creator Avatar"
              className="post-avatar wavy-circle-xxx"
            />

          </Link>


          <div className="username">
            <Link to={`/profile/${post.creator.$id}`} className="nameuser">
              <div
                className={`nameuser ${
                  post.creator.isVerified && runUsernameShimmer
                    ? "verified-shimmer"
                    : ""
                }`}
              >
                <span>{post.creator.username}</span>
              </div>
            </Link>

            {post.creator.isVerified && <VerifiedBadge />}

            <span className="time">
              {multiFormatDateString(post.$createdAt)}
            </span>
          </div>

          {/* ========================================
              FOLLOW / UNFOLLOW
          ========================================= */}
          <div className="aditicha">
           <img 
              src="/assetss/icons/profile-tick-svgrepo-com (1).svg"
              alt="plug"
              className="nawamal"
            /> 
          </div>

          {/* ========================================
              MENU / EDIT
          ========================================= */}

          <div className="post-menu">
            <ButtonGroup>

              <DropdownMenu >

                <DropdownMenuTrigger
                  asChild
                  className="aditicha"
                >

                  <Button
                    variant="outline"
                  >

                    <img
                      src={men}
                      alt="menu"
                      width={30}
                      height={30}
                    />

                  </Button>

                </DropdownMenuTrigger>


                <DropdownMenuContent
                  align="end"
                  className="desc-back"
                >

                  <DropdownMenuGroup>

                    {/* EDIT */}

                    <DropdownMenuItem>

                      <div
                        className={`deta1ls-sec ${
                          user?.id !==
                          post.creator.$id
                            ? "hidden"
                            : ""
                        }`}
                      >

                        <Link
                          to={`/update-post/${post.$id}`}
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
                          className="tgl"
                        >
                          Edit
                        </Link>

                      </div>

                    </DropdownMenuItem>


                    {/* REUSE */}

                    <DropdownMenuItem>

                      <div className="deta1ls-sec">

                        <Link
                          to={`/repost/${post.$id}`}
                        >

                          <img
                            src={ruse}
                            alt="reuse"
                            width={23}
                            height={23}
                            className="warn"
                          />

                        </Link>


                        <Link
                          to={`/repost/${post.$id}`}
                          className="tgl"
                        >
                          Reuse
                        </Link>

                      </div>

                    </DropdownMenuItem>


                    {/* DETAILS */}

                    <DropdownMenuItem>

                      <div className="deta1ls-sec">

                        <img
                          src={detail}
                          alt="details"
                          width={28}
                          height={28}
                          className="warn"
                          onClick={(e) => {

                            e.stopPropagation();

                            setOpenDialog(
                              true
                            );

                          }}
                        />


                        <span
                          className="tgl"
                          onClick={(e) => {

                            e.stopPropagation();

                            setOpenDialog(
                              true
                            );

                          }}
                        >
                          Details
                        </span>

                      </div>

                    </DropdownMenuItem>

                  </DropdownMenuGroup>


                  <DropdownMenuSeparator />


                  <DropdownMenuGroup>

                    {/* REPORT */}

                    {user?.id !==
                      post.creator.$id && (

                      <DropdownMenuItem>

                        <div className="deta1ls-sec">

                          <img
                            src={repoo}
                            alt="report"
                            width={23}
                            height={23}
                            className="warn"
                            onClick={() =>
                              setOpen(true)
                            }
                          />


                          <span
                            className="tgl"
                            onClick={() =>
                              setOpen(true)
                            }
                          >
                            Report
                          </span>

                        </div>

                      </DropdownMenuItem>

                    )}


                    {/* DELETE */}

                    {user?.id ===
                      post.creator.$id && (

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={
                          handleDeletePost
                        }
                      >

                        <div className="deta1ls-sec">

                          <img
                            src={trash}
                            alt="delete"
                            width={23}
                            height={23}
                          />


                          <p className="tgl">
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </p>

                        </div>

                      </DropdownMenuItem>

                    )}

                  </DropdownMenuGroup>

                </DropdownMenuContent>

              </DropdownMenu>

            </ButtonGroup>

          </div>

        </div>


        {/* ==========================================
            IMAGE + CAPTION
        =========================================== */}

        <div className="idk">


          {/* CAPTION */}

          {showCaption && (

            <motion.div
              className="idk-cap cursor-pointer"
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              onClick={() =>
                setShowCaption(false)
              }
            >

              <WordReveal
                text={post.caption}
                speed={120}
              />

            </motion.div>

          )}


          {/* IMAGE */}

          <div className="post-img-wrapper">

            {/* BLURRED PREVIEW */}

            <img
              src={
                post.previewUrl ||
                post.imageUrl
              }
              alt="preview"
              className={`post-img ${
                imgLoaded
                  ? "sharp"
                  : "blur"
              }`}
            />


            {/* REAL IMAGE */}

            <img
              src={post.imageUrl}
              alt="Post Image"
              className={`post-img absolute top-0 left-0 transition-opacity duration-300 ${
                imgLoaded
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() =>
                setImgLoaded(true)
              }
              onError={() =>
                setImgError(true)
              }
              onClick={() =>
                setShowCaption(
                  (prev) => !prev
                )
              }
            />


            {/* FALLBACK */}

            {imgError && (

              <img
                src="/assetss/images/default-meme.png"
                className="post-img"
                alt="fallback"
              />

            )}

          </div>

        </div>


        {/* ==========================================
            POST STATS
        =========================================== */}

        <PostStats
          post={post}
          userId={user.id}
        />


        {/* ==========================================
            COMMENTS / PEOPLE
        =========================================== */}

        <div className="comments-section">

          {/* ANIMATED COMMENT PREVIEW */}

          <AnimatedComments
            users={commentUsers}
          />


          {/* OPEN COMMENTS */}

          <div className="post-comments-action">

            <Drawer>

              <DrawerTrigger asChild>

                <button
                  className="comment-action-button"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  aria-label="View comments"
                >

                  <img
                    src={comment}
                    alt="comments"
                    className="gengeng"
                  />

                </button>

              </DrawerTrigger>


              <DrawerContent
                className="
                  max-h-[60vh]
                  p00p
                "
              >

                <DrawerHeader>

                  <DrawerTitle>
                    Comments
                  </DrawerTitle>

                </DrawerHeader>


                <div
                  className="
                    px-4
                    py-3
                    overflow-y-auto
                  "
                >

                  <Comments
                    postId={post.$id}
                  />

                </div>

              </DrawerContent>

            </Drawer>

          </div>

        </div>


        {/* ==========================================
            DETAILS DIALOG
        =========================================== */}

        <Dialog
          open={openDialog}
          onOpenChange={
            setOpenDialog
          }
        >

          <DialogContent
            className="condit1ons"
          >

            <DialogHeader>

              <DialogTitle
                className="diff"
              >

                <img
                  src="/assetss/images/block7.png"
                  width={40}
                  alt="Memeflix"
                />

                <span className="ditf">
                  Memeflix
                </span>

              </DialogTitle>

            </DialogHeader>


            <PostDetails
              post={post}
              userId={
                currentUser?.$id || ""
              }
            />

          </DialogContent>

        </Dialog>

      </article>


      {/* ==========================================
          REPORT DIALOG
      =========================================== */}

      {open && (

        <div className="rep0o">

          <div className="rep0o">

            <h3 className="text-white font-bold">
              Report This Meme
            </h3>


            <select
              className="w-full p-2 bg-black text-white rounded"
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
            >

              <option value="">
                Select reason
              </option>

              <option value="spam">
                Spam
              </option>

              <option value="nudity">
                Nudity
              </option>

              <option value="hate">
                Hate Speech
              </option>

              <option value="violence">
                Violence
              </option>

            </select>


            <textarea
              placeholder="Extra details (optional)"
              className="w-full p-2 bg-black text-white rounded"
              value={details}
              onChange={(e) =>
                setDetails(
                  e.target.value
                )
              }
            />


            <div className="flex justify-between p-4">

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="repo-btnn"
              >
                Cancel
              </button>


              <button
                onClick={
                  handleReport
                }
                disabled={
                  isReporting
                }
                className="repo-btn"
              >

                {isReporting
                  ? "Reporting..."
                  : "Submit"}

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );
};


export default PostCard;