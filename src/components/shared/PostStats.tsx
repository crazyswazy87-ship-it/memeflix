import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useGetSavedPost,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


import { formatCount, formatCountRepost } from "@/lib/utils";
import type { Post } from "@/types";

import { useEffect, useState } from "react";
import EmojiNdechu from "./EmojiNdechu";

import { motion, AnimatePresence } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";

import PostDetails from "./PostDetails";

import save from "../../../public/assetss/icons/archive-1-svgrepo-com (2).svg";
import reuse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg";



// ==============================
// TYPES
// ==============================

type EmojiItem = {
  code: string;
  value: string;
  continent: string;
  label: React.ReactNode;
};

type PostStatsProps = {
  post?: Post;
  userId: string;
};


// ==============================
// POST STATS
// ==============================

const PostStats = ({ post, userId }: PostStatsProps) => {

  const navigate = useNavigate();

  // ==============================
  // LIKE STATE
  // ==============================

  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);

  const [burstEmoji, setBurstEmoji] =
    useState<React.ReactNode | null>(null);


  // ==============================
  // SAVE STATE
  // ==============================

  const [savesCount, setSavesCount] =
    useState(post?.savesCount || 0);

  const [savedRecordId, setSavedRecordId] =
    useState<string | null>(null);

  const [isSaved, setIsSaved] =
    useState(false);


  // ==============================
  // DIALOG
  // ==============================

  const [openDialog, setOpenDialog] =
    useState(false);


  // ==============================
  // CURRENT USER
  // ==============================

  const { data: currentUser } =
    useGetCurrentUser();


  // ==============================
  // MUTATIONS
  // ==============================

  const {
    mutate: likePost,
    isPending: isLiking,
  } = useLikePost();

  const {
    mutate: savePost,
    isPending: isSaving,
  } = useSavePost();

  const {
    mutate: deleteSavePost,
    isPending: isDeletingSave,
  } = useDeleteSavedPost();


  // The feed already carries the aggregate counter. Do not fetch every
  // like document for every PostStats instance (N+1 requests).
  useEffect(() => {
    setLikesCount(post?.likesCount || 0);
  }, [post?.likesCount]);

  // ==============================
  // SAVE STATE
  // ==============================

  const { data: savedPosts } = useGetSavedPost(
    currentUser?.$id || ""
  );

  useEffect(() => {
    if (!post?.$id || !savedPosts?.documents) return;

    const record = savedPosts.documents.find(
      (item: any) =>
        (typeof item.post === "string" ? item.post : item.post?.$id) === post.$id
    );

    setIsSaved(!!record);
    setSavedRecordId(record?.$id ?? null);
  }, [post?.$id, savedPosts]);


  // ==============================
  // UPDATE SAVE COUNT
  // ==============================

  useEffect(() => {

    if (post?.savesCount !== undefined) {

      setSavesCount(post.savesCount);

    }

  }, [post?.savesCount]);


  // ==============================
  // LIKE
  // ==============================

  const handleLikePost = (
    e: React.MouseEvent<HTMLElement>,
    item: EmojiItem
  ) => {

    e.stopPropagation();

    if (
      !currentUser ||
      !post ||
      isLiking
    ) {
      return;
    }


    setBurstEmoji(item.label);

    setTimeout(() => {
      setBurstEmoji(null);
    }, 2000);


    likePost(
      {
        postId: post.$id,
        userId: currentUser.$id,
        emoji: item.value,
      },
      {
        onSuccess: (data) => {
          if (typeof data?.likesCount === "number") {
            setLikesCount(data.likesCount);
          }
        },
      }
    );

  };


  // ==============================
  // SAVE / UNSAVE
  // ==============================

  const handleSavePost = (
    e: React.MouseEvent
  ) => {

    e.stopPropagation();

    if (
      !currentUser ||
      !post ||
      isSaving ||
      isDeletingSave
    ) {
      return;
    }


    // ==============================
    // UNSAVE
    // ==============================

    if (
      isSaved &&
      savedRecordId
    ) {

      setIsSaved(false);

      setSavesCount(
        (prev) =>
          Math.max(prev - 1, 0)
      );


      deleteSavePost({
        savedRecordId,
        postId: post.$id,
        userId: currentUser.$id,
      });

      return;
    }


    // ==============================
    // SAVE
    // ==============================

    setIsSaved(true);

    setSavesCount(
      (prev) => prev + 1
    );


    savePost(
      {
        postId: post.$id,
        userId: currentUser.$id,
      },
      {
        onSuccess: (data) => {

          if (data) {

            setSavedRecordId(
              data.savedRecordId
            );

          }

        },

        onError: () => {

          setIsSaved(false);

          setSavesCount(
            (prev) =>
              Math.max(prev - 1, 0)
          );

        },

      }
    );

  };


  // ==============================
  // REUSE
  // ==============================

  const handleReuse = (
    e: React.MouseEvent
  ) => {

    e.stopPropagation();

    if (!post) return;

    navigate(
      `/repost/${post.$id}`
    );

  };


  // ==============================
  // RENDER
  // ==============================

  if (!post) return null;


  return (
    <>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="rounded-bat">


        {/* =================================================
            SAVE
        ================================================= */}

        <button
          className="action-button send-button"

          onClick={handleSavePost}

          disabled={
            isSaving ||
            isDeletingSave ||
            !currentUser ||
            !post
          }

          aria-label={
            isSaved
              ? "Unsave post"
              : "Save post"
          }
        >

          <div className="tension">

            <img
              src={save}
              alt={
                isSaved
                  ? "unsave"
                  : "save"
              }
              className="gengeng"
            />

            <span className="kount">

              {formatCountRepost(
                savesCount
              )}

            </span>

          </div>

        </button>


        {/* =================================================
            REUSE
        ================================================= */}

        <button
          className="action-button send-button"

          onClick={handleReuse}

          disabled={!post}

          aria-label="Reuse post"
        >

          <div className="tension">

            <img
              src={reuse}
              alt="reuse"
              className="gengeng"
            />

            <span className="kount">

              {formatCountRepost(
                post.repostCount || 0
              )}

            </span>

          </div>

        </button>


        {/* =================================================
            LIKE
        ================================================= */}

        <button
          className="action-button heart-button"

          onClick={(e) => {
            e.stopPropagation();
          }}

          disabled={
            !currentUser ||
            !post ||
            isLiking
          }

          aria-label="Like post"
        >

          <div className="tension relative">

            {/* EMOJI BURST */}

            <AnimatePresence>

              {burstEmoji && (

                <motion.div
                  initial={{
                    scale: 0,
                    opacity: 1,
                  }}

                  animate={{
                    scale: 2,
                    opacity: 0,
                  }}

                  transition={{
                    duration: 2,
                  }}

                  className="
                    absolute
                    left-2
                    bottom-5
                    text-3xl
                    pointer-events-none
                  "
                >

                  {burstEmoji}

                </motion.div>

              )}

            </AnimatePresence>


            {/* EMOJI PICKER */}

            <EmojiNdechu
              handleLikePost={
                handleLikePost
              }
            />

            <span
              className="kount cursor-pointer"

              onClick={(e) => {

                e.stopPropagation();

                setOpenDialog(true);

              }}
            >

              {formatCount(
                likesCount
              )}

            </span>

          </div>

        </button>


      </div>


      {/* =================================================
          COMMENTS
      ================================================= */}

     


      {/* =================================================
          DETAILS DIALOG
      ================================================= */}

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
              />

              <span className="ditf">
                Memeflix
              </span>

              <Link
                to={`/profile/${post.creator?.$id}`}
              >
                @{post.creator?.username}
              </Link>

            </DialogTitle>

          </DialogHeader>


          <PostDetails
            post={post}
            userId={
              currentUser?.$id ||
              userId ||
              ""
            }
          />

        </DialogContent>

      </Dialog>

    </>
  );
};

export default PostStats;