import {
  useDeleteSavedPost,
  useGetCurrentUser,
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
import type { Post, Save } from "@/types";

import { useEffect, useState } from "react";
import EmojiNdechu from "./EmojiNdechu";

import { motion, AnimatePresence } from "framer-motion";

import { getLikes } from "@/lib/appwrite/api";

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

  const [likesCount, setLikesCount] = useState(0);
  const [postLikes, setPostLikes] = useState<any[]>([]);
  const [emojiMap, setEmojiMap] = useState<Record<string, number>>({});

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


  // ==============================
  // FETCH LIKES
  // ==============================

  useEffect(() => {

    const fetchLikes = async () => {

      if (!post?.$id) return;

      try {

        const res = await getLikes(post.$id);

        const docs = res.documents;

        setPostLikes(docs);
        setLikesCount(docs.length);


        const map: Record<string, number> = {};

        docs.forEach((like: any) => {

          if (like.emoji) {

            map[like.emoji] =
              (map[like.emoji] || 0) + 1;

          }

        });

        setEmojiMap(map);

      } catch (error) {

        console.error(
          "Failed to fetch likes:",
          error
        );

      }

    };

    fetchLikes();

  }, [post?.$id]);


  // ==============================
  // SAVE STATE
  // ==============================

  useEffect(() => {

    if (!currentUser || !post?.$id) return;

    const record = currentUser.save?.find(
      (r: Save) =>
        r.post?.$id === post.$id
    );

    if (record) {

      setIsSaved(true);
      setSavedRecordId(record.$id);

    } else {

      setIsSaved(false);
      setSavedRecordId(null);

    }

  }, [
    currentUser,
    post?.$id,
  ]);


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


    const existingReaction =
      postLikes.find(
        (like) =>
          like.user === currentUser.$id
      );


    let updatedLikes = [...postLikes];

    const updatedEmojiMap = {
      ...emojiMap,
    };

    let updatedCount = likesCount;


    // ==============================
    // REMOVE / CHANGE REACTION
    // ==============================

    if (existingReaction) {

      if (
        existingReaction.emoji ===
        item.value
      ) {

        updatedLikes =
          updatedLikes.filter(
            (like) =>
              like.user !== currentUser.$id
          );

        updatedCount =
          Math.max(updatedCount - 1, 0);

        updatedEmojiMap[item.value] =
          Math.max(
            (updatedEmojiMap[item.value] || 1) - 1,
            0
          );

      } else {

        updatedLikes =
          updatedLikes.map((like) =>
            like.user === currentUser.$id
              ? {
                  ...like,
                  emoji: item.value,
                }
              : like
          );


        updatedEmojiMap[
          existingReaction.emoji
        ] =
          Math.max(
            (updatedEmojiMap[
              existingReaction.emoji
            ] || 1) - 1,
            0
          );


        updatedEmojiMap[item.value] =
          (updatedEmojiMap[item.value] || 0) + 1;

      }

    }

    // ==============================
    // NEW LIKE
    // ==============================

    else {

      updatedLikes.push({
        user: currentUser.$id,
        emoji: item.value,
      });

      updatedCount++;

      updatedEmojiMap[item.value] =
        (updatedEmojiMap[item.value] || 0) + 1;

    }


    setPostLikes(updatedLikes);
    setLikesCount(updatedCount);
    setEmojiMap(updatedEmojiMap);


    likePost({
      postId: post.$id,
      userId: currentUser.$id,
      emoji: item.value,
    });

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
              data.$id
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