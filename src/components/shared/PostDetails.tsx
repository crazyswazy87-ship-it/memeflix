import Loader from "@/components/shared/Loader";


import { useState } from "react";
import type { Models } from "appwrite";
import VerifiedBadge from "./VerifiedBadge";
import { Link } from "react-router-dom";
import { formatCountRepost, multiFormatDateString } from "@/lib/utils";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@base-ui/react";
import { useUserContext } from "@/constants/context/AuthContext";
import PostStatsRate from "./PostStatsRate";
import { useReportPost } from "@/lib/react-query/queriesAndMutations";

import men from "../../../public/assetss/icons/more-svgrepo-com (1).svg"
import trash from "../../../public/assetss/icons/trush-square-svgrepo-com.svg"
import ruuse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg"
//import ruse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg"
import repoo from "../../../public/assetss/icons/alarm-svgrepo-com.svg"
import editt from "../../../public/assetss/icons/edit-svgrepo-com.svg"

type Post = Models.Document & {
  caption: string;
  imageId: string;
  imageUrl?: string;
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

type PostDetailsProps = {
  post: Post;
  userId: string;
};

const PostDetails = ({ post }: PostDetailsProps) => {
  const { user } = useUserContext();
  const { mutateAsync: reportPost, isPending } = useReportPost();

  const [showCaption, setShowCaption] = useState(true);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  

  const isOwner = user?.id === post.creator.$id;

  if (!post) return <Loader />;

  // REPORT HANDLER
  const handleReport = async () => {
    if (!reason) return;

    await reportPost({
      postId: post.$id,
      reason,
      details,
    });

    setOpen(false);
    setReason("");
    setDetails("");
  };

  // DELETE HANDLER (placeholder — replace with your mutation)
  const handleDeletePost = (postId: string, imageId: string) => {
    console.log("delete", postId, imageId);
  };

  return (
    <div className="post-deta1l-conta1ner">
      <div className="post-card-two">
        {/* HEADER */}
        <div className="toppa">
          <Link to={`/profile/${post.creator.$id}`} className="user-prof wavy-circle">
            <img
              src={
                post.creator?.imageUrl ||
                "/assetss/icons/profile-placeholder.svg"
              }
              className="user-pro"
              alt="Creator"
            />
          </Link>

          <div className="topper-sec">
            <Link to={`/profile/${post.creator.$id}`}>
              <h3 className="username-card">
                {post.creator.username}
                {post.creator.isVerified && <VerifiedBadge />}
              </h3>
            </Link>

            <p className="user-time">
              {multiFormatDateString(post.$createdAt)}
            </p>
          </div>

          <div className="btn-dite">
            {post.isRepost && (
              <p className="reused">
                <img
                  src={ruuse}
                  className="reuse-icc"
                  alt="reuse"
                />
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
                    {isOwner && (
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
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    {!isOwner && (
                      <DropdownMenuItem onClick={() => setOpen(true)}>
                        <img
                          src={repoo}
                          width={23}
                          height={23}
                          alt="report"
                        />
                        <span>Report</span>
                      </DropdownMenuItem>
                    )}

                    {isOwner && (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          handleDeletePost(post.$id, post.imageId)
                        }
                      >
                        <img
                          src={trash}
                          width={23}
                          height={23}
                          alt="bin"
                        />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </div>

        {/* CAPTION */}
        <div className="cpaa">{post.caption}</div>

        {/* IMAGE */}
        <img
          src={post.imageUrl}
          alt="Post"
          className="post-img"
          onClick={() => setShowCaption(!showCaption)}
        />

        <hr className="boder w-105 mb-2 mt-2 boder-dark-4/80" />

        {/* STATS (FIXED) */}
        <PostStatsRate post={post} />
      </div>

      {/* REPORT MODAL */}
      {open && (
        <div className="rep0o">
          <h3 className="text-white font-bold">Report This Post</h3>

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
            placeholder="Extra details (optional)"
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
              disabled={isPending}
              className="repo-btn"
            >
              {isPending ? "Reporting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;