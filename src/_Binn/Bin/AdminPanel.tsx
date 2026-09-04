import { useGetAdminAnalytics } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { formatCount } from "@/lib/utils";
import { useState } from "react";
import type { Models } from "appwrite";

type Post = Models.Document & {
  caption: string;
  likesCount?: number;
  savesCount?: number;
  repostCount?: number;
};

const Admin = () => {
  const { data, isPending } = useGetAdminAnalytics();
  const [tab, setTab] = useState<"overview" | "posts">("overview");

  if (isPending) return <Loader />;

  if (!data) return <p className="text-white">No admin data found</p>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pt-20">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          ⚡ Admin Dashboard
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("overview")}
            className={`px-4 py-2 rounded ${
              tab === "overview" ? "bg-white text-black" : "bg-dark-4"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setTab("posts")}
            className={`px-4 py-2 rounded ${
              tab === "posts" ? "bg-white text-black" : "bg-dark-4"
            }`}
          >
            Top Posts
          </button>
        </div>
      </div>

      {/* ===================== */}
      {/* OVERVIEW */}
      {/* ===================== */}
      {tab === "overview" && (
        <>
          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

            <Stat label="Users" value={data.users} />
            <Stat label="Posts" value={data.posts} />
            <Stat label="Follows" value={data.follows} />

            <Stat label="Engagement" value={data.totalEngagement} />
          </div>

          {/* ENGAGEMENT BREAKDOWN */}
          <div className="bg-dark-2 p-6 rounded-xl">
            <h2 className="mb-4 font-bold">Engagement Breakdown</h2>

            <div className="grid grid-cols-3 gap-4 text-center">
              <MiniStat label="Likes" value={data.totalLikes} />
              <MiniStat label="Saves" value={data.totalSaves} />
              <MiniStat label="Reposts" value={data.totalReposts} />
            </div>
          </div>

          {/* GROWTH INFO */}
          <div className="mt-6 bg-dark-2 p-6 rounded-xl">
            <h2 className="font-bold mb-2">Growth Insight</h2>

            <p className="text-light-3">
              🔥 Recent Posts (7 days): {data.recentPostsCount}
            </p>

            <p className="text-light-3">
              ⚡ Engagement Score: {formatCount(data.totalEngagement)}
            </p>
          </div>
        </>
      )}

      {/* ===================== */}
      {/* TOP POSTS */}
      {/* ===================== */}
      {tab === "posts" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Top Performing Posts</h2>

          {data.topPosts?.map((post: Post) => (
            <div
              key={post.$id}
              className="bg-dark-3 p-4 rounded-xl hover:bg-dark-4 transition"
            >
              <p className="font-medium text-white truncate">
                {post.caption}
              </p>

              <div className="flex gap-4 text-sm text-light-3 mt-2">
                <span>❤️ {post.likesCount || 0}</span>
                <span>💾 {post.savesCount || 0}</span>
                <span>🔁 {post.repostCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===================== */
/* SMALL COMPONENTS */
/* ===================== */

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-dark-2 p-4 rounded-xl text-center">
    <p className="text-light-3 text-sm">{label}</p>
    <h3 className="text-xl font-bold">{formatCount(value)}</h3>
  </div>
);

const MiniStat = ({ label, value }: { label: string; value: number }) => (
  <div>
    <p className="text-light-3 text-sm">{label}</p>
    <h3 className="font-bold">{formatCount(value)}</h3>
  </div>
);

export default Admin;