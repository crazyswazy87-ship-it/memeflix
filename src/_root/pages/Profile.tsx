import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  useFollowUser,
  useGetCurrentUser,
  useGetFollowersCount,
  useGetFollowingCount,
  useGetUsersById,
  useIsFollowing,
  useUnfollowUser,
} from "@/lib/react-query/queriesAndMutations";
import { useNavigate, useParams } from "react-router-dom";

import { useInView } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { useGetFollowers, useGetFollowing, useGetUserPosts } from "@/lib/appwrite/api";

import VerifiedBadge from "@/components/shared/VerifiedBadge";
import SmallPost from "@/components/shared/SmallPost";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import GridPostLists from "@/components/shared/GridPostLists";
import { formatPlugCount } from "@/lib/utils";
import Legends from "./Legends";
import { SkeletonProfile } from "@/components/shared/SkeletonProfile";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const isInView = useInView(profileRef, { once: true });

  const [runShimmer, setRunShimmer] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "small">("grid");
  const [filter, setFilter] = useState<"recent" | "top" | "oldest">("recent");
  const [showInnerProfile, setShowInnerProfile] = useState(true);

  const { data: currentUser } = useGetCurrentUser();
  const { data: user, isLoading } = useGetUsersById(id || "");
  const { data: userPosts, isLoading: postsLoading } = useGetUserPosts(id || "");

 const totalImpressions = useMemo(() => {
  return (userPosts || []).reduce((acc, post) => {
    return (
      acc +
      (post.likesCount || 0) +
      (post.savesCount || 0) +
      (post.repostCount || 0)
    );
  }, 0);
}, [userPosts]);

  // FOLLOW LOGIC 
  const { data: isFollowing } = useIsFollowing(
  currentUser?.$id,
  user?.$id
);

const { mutate: follow, isPending: followingLoading } = useFollowUser();
const { mutate: unfollow, isPending: unfollowingLoading } = useUnfollowUser();

const loading = followingLoading || unfollowingLoading;

const { data: pluggedInCount } = useGetFollowersCount(user?.$id);
const { data: plugsCount } = useGetFollowingCount(user?.$id);

const { data: followers } = useGetFollowers(user?.$id);
const { data: following } = useGetFollowing(user?.$id);

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

  const postCount = userPosts?.length || 0;

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num);

  const formatCompact = (num: number) =>
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);




  const sortedPosts = useMemo(() => {
    return [...(userPosts || [])].sort((a, b) => {
      if (filter === "recent") {
        return (
          new Date(b.$createdAt).getTime() -
          new Date(a.$createdAt).getTime()
        );
      }

      if (filter === "oldest") {
        return (
          new Date(a.$createdAt).getTime() -
          new Date(b.$createdAt).getTime()
        );
      }

      if (filter === "top") {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }

      return 0;
    });
  }, [userPosts, filter]);

  useEffect(() => {
    if (!isInView || !user?.isVerified) return;

    const timer = setTimeout(() => {
      setRunShimmer(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isInView, user?.isVerified]);

  if (isLoading || !user) {
    return (
      <div className="ngosti">
        <SkeletonProfile />
      </div>
    );
  }

  return (
    <div ref={profileRef} className="profile-container">
      <div className="conto">
        <div className="kwani">
          <Popover>
            <PopoverTrigger asChild className="majembe">
              <Button variant="outline" className="priv">
                <img
                  src="/assetss/images/block7.png"
                  alt="details"
                  height={35}
                  width={35}
                />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-64 lyricist">
              <PopoverHeader>
                <PopoverTitle>Profile Details</PopoverTitle>
              </PopoverHeader>

              <div className="flex items-center gap-3 mt-2">
                <div className="user-dd-1mgg wavy-circle">
                  <img
                    src={user.imageUrl || "/assetss/images/profile-pic.png"}
                    alt="profile"
                    className="user-dd-image"
                  />
                </div>

                <div
                  className={`username-profile-det ${
                    runShimmer && user.isVerified ? "username-shimmer" : ""
                  }`}
                >
                  <p className="font-semibold flex items-center gap-1">
                    @{user.username || "Memelord"}
                    {user.isVerified && <VerifiedBadge />}
                  </p>
                  <p className="mogatha">✦{user.name}</p>
                </div>
              </div>

              <p className="mogatha">
                Been cooking since{" "}
                {new Date(user.$createdAt).toLocaleDateString("en", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </PopoverContent>
          </Popover>

          <img
            src={
              showInnerProfile
                ? "/assetss/icons/view.png"
                : "/assetss/icons/unview.png"
            }
            alt="img"
            height={30}
            width={30}
            onClick={() => setShowInnerProfile((prev) => !prev)}
          />
        </div>

        <div className="profile-1mg ">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="profile-image "
          />

          <div
            className={`profile-stats ${
              showInnerProfile ? "stats-visible" : "stats-hidden"
            }`}
          >
            <div
              className={`inner-prof1le ${
                !showInnerProfile ? "hidden" : ""
              }`}
            >

              <Dialog>
                <DialogTrigger asChild className="count">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.currentTarget.blur();
                    }}
                    className="mori"
                  >
                   <div className={` ${!showInnerProfile ? "hidden" : ""}`}>
                    <p>{formatPlugCount(pluggedInCount ?? 0)}</p>
                    <p>Plugged In</p>  
                  </div>
                  </Button>
                </DialogTrigger>

                <DialogContent className="plugs-sec">
                  <DialogHeader>
                    <DialogTitle className="justify-center flex ">  ✦ MEMELORDS  ✦</DialogTitle>
                    <p>{formatPlugCount(pluggedInCount ?? 0)} Plugged ins</p>
                  </DialogHeader>

                    <div className="free-mind">
                      <Legends users={followers} type="followers" />
                    </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="lock-btn2">Continue browsing</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="small-prof1le wavy-circle-bxl">
                <img src={user.imageUrl} className="pro-f1le" />
              </div>

              <Dialog>
                <DialogTrigger asChild className="count">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.currentTarget.blur();
                    }}
                    className="mori"
                  >
                  <div className={` ${!showInnerProfile ? "hidden" : ""}`}>
                    <p>{formatPlugCount(plugsCount ?? 0)}</p>
                    <p>Plugs</p>
                  </div>
                  </Button>
                </DialogTrigger>

                <DialogContent className="plugs-sec">
                  <DialogHeader>
                    <DialogTitle className="justify-center flex">  ✦ MEMELORDS  ✦</DialogTitle>
                    <p>{formatPlugCount(plugsCount ?? 0)} Plugs</p>
                  </DialogHeader>

                    <div className="free-mind">
                      <Legends users={following} type="following" />
                    </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="lock-btn2">Continue browsing</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div
              className={`username-profile ${
                runShimmer ? "username-shimmer" : ""
              }`}
            >
              <span className="username-profile">
                {user.username}
                {user.isVerified && <VerifiedBadge />}
              </span>
            </div>

            <h2 className="name-profile">{user.name}</h2>

            <div className="count-imp">
              <p className="ic-num">{formatNumber(totalImpressions)}</p>
              <p className="ic-imp">Impressions</p>
            </div>
          </div>

          <div className="pt-3 pb-2">
            {currentUser?.$id === user?.$id ? (
              <Button
                className="lock-genje-btnn"
                onClick={() =>
                  navigate(`/update-profile/${user.$id}`)
                }
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
                    :  "bg-gradient-to-r from-white to-red-500 text-black shadow-lg"
                }`}
              >
                {loading ? <Loader /> : isFollowing ? "Plugged in" : "Plug in"}
              </Button>
            )}
          </div>

          <h3 className="bio">
            <img
              src="/assetss/icons/quote.png"
              alt="quote"
              className="quote"
            />
            {user.bio}
          </h3>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${
            activeTab === "grid" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("grid")}
        >
          <img
            src={
              activeTab === "grid"
                ? "/assetss/icons/row-y.png"
                : "/assetss/icons/row-n.png"
            }
            width={25}
          />
        </button>

        <button
          className={`tab-btn ${
            activeTab === "small" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("small")}
        >
          <img
            src={
              activeTab === "small"
                ? "/assetss/icons/grid-y.png"
                : "/assetss/icons/grid-n.png"
            }
            width={25}
          />
        </button>

        <div className="unk">
          <span>
            {postsLoading ? "..." : formatCompact(postCount)}{" "}
            <span className="dmc">memes</span>
          </span>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-btn ${
              filter === "recent" ? "active-filter" : ""
            }`}
            onClick={() => setFilter("recent")}
          >
            Recent
          </button>

          <button
            className={`filter-btn ${
              filter === "top" ? "active-filter" : ""
            }`}
            onClick={() => setFilter("top")}
          >
            Top
          </button>

          <button
            className={`filter-btn ${
              filter === "oldest" ? "active-filter" : ""
            }`}
            onClick={() => setFilter("oldest")}
          >
            Oldest
          </button>
        </div>
      </div>

      <div className="profile-posts">
        {activeTab === "grid" ? (
          sortedPosts.length ? (
            <GridPostLists posts={sortedPosts} showUser />
          ) : (
            <Loader />
          )
        ) : (
          <SmallPost posts={sortedPosts} showUser />
        )}
      </div>
    </div>
  );
};

export default Profile;