import type { Models } from "appwrite";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import VerifiedBadge from "./VerifiedBadge";
import Loader from "./Loader";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

import {
  useFollowUser,
  useGetFollowersCount,
  useGetFollowingCount,
  useUnfollowUser,
  useGetCurrentUser,
  useIsFollowing,
} from "@/lib/react-query/queriesAndMutations";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { data: currentUser } = useGetCurrentUser();
  const isOwnProfile = currentUser?.$id === user?.$id;

  const navigate = useNavigate();

  const { data: isFollowing } = useIsFollowing(
    currentUser?.$id,
    user?.$id
  );

  const { mutate: follow, isPending: followingLoading } =
    useFollowUser();
  const { mutate: unfollow, isPending: unfollowingLoading } =
    useUnfollowUser();

  const loading = followingLoading || unfollowingLoading;

  const { data: pluggedIn } = useGetFollowersCount(user?.$id);
  const { data: plugs } = useGetFollowingCount(user?.$id);

  const handleFollow = () => {
    if (!currentUser || !user || loading) return;

    if (isFollowing) {
      unfollow({
        followerId: currentUser.$id,
        followingId: user.$id,
      });
    } else {
      follow({
        followerId: currentUser.$id,
        followingId: user.$id,
      });
    }
  };

  const [runUsernameShimmer, setRunUsernameShimmer] =
    useState(false);

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      setRunUsernameShimmer(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <div className="user-card" ref={ref}>
      {/* Image */}
      <Link to={`/profile/${user.$id}`}>
        <div className="profff wavy-circle-bl">
          <img
            src={
              user.imageUrl ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt="creator"
            className="userr-img "
          />
        </div>
      </Link>

      {/* Name + Username */}
      <Link
        to={`/profile/${user.$id}`}
        className="userr-det"
      >
        <>
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>

          <p className="usir">
            <span
              className={
                user.isVerified && runUsernameShimmer
                  ? "verified-shimmer"
                  : ""
              }
            >
              {user.username}
            </span>

            {user.isVerified && <VerifiedBadge />}
          </p>
        </>
      </Link>

      {/* FOLLOW STATS (Plugs system optional display) 
      <div className="flex gap-2 text-xs text-gray-400 mb-2">
        <span>
          {pluggedIn ?? 0} Plugged In
        </span>
        <span>
          {plugs ?? 0} Plugs
        </span>
      </div>

      */}

      {/* Button */}
      {isOwnProfile ? (
  <Button
    className="lock-genje-btnn"
    onClick={() => navigate(`/update-profile/${user.$id}`)}
  >
    Edit Profile
  </Button>
      ) : (
        <Button
          onClick={handleFollow}
          disabled={loading}
          size="sm"
          className={`lock-genje-btnn transition-all duration-200 ${
            isFollowing
              ? "bg-gradient-to-r from-red-500 to-red-600 text-black shadow-lg"
              : "bg-gradient-to-r from-white to-red-500 text-black shadow-lg"
          }`}
        >
          {loading ? <Loader /> : isFollowing ? "Plugged in" : "Plug in"}
        </Button>
      )}
    </div>
  );
};

export default UserCard;