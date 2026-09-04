import { useUserContext } from "@/constants/context/AuthContext";
import {
  useGetCurrentUser,
  useGetNewFollowers,
  useGetUserAnalytics,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { formatCount } from "@/lib/utils";
import Ansave from "@/components/shared/Ansave";
import AnlyIcon from "@/components/shared/AnlyIcon";


import PostDetails from "@/components/shared/PostDetails";
import { useState } from "react";
import type { Models } from "appwrite";
import Anreuser from "@/components/shared/Anreuser";
import Anliker from "@/components/shared/Anliker";

/* =========================
   Gradient Spiral Component
========================= */
type SpiralProps = {
  value: number;
  max: number;
  label: string;
  gradientId: string;
  colors: string[];
};

const SpiralGraph = ({
  value,
  max,
  label,
  gradientId,
  colors,
}: SpiralProps) => {
  const radius = 55;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;


  const progress = value / max;
  const strokeDashoffset =
    circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>

        <circle
          stroke="#1f1f1f"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke={`url(#${gradientId})`}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.8s ease",
          }}
        />
      </svg>

      <p className="mt-2 text-sm text-light-4">{label}</p>
      <p className="font-bold text-lg">{formatCount(value)}</p>
    </div>
  );
};

/* =========================
   TYPES (FIXED)
========================= */
type Post = Models.Document & {
  caption: string;
  imageId: string;
  imageUrl?: string;

  likesCount?: number;
  savesCount?: number;

  repostCount: number;
  isRepost: boolean;

  creator: {
    $id: string;
    username: string;
    imageUrl?: string;
    isVerified: boolean;
  };
};

/* =========================
   MAIN COMPONENT
========================= */
const Analytics = () => {
  const { user } = useUserContext();

  const { data, isPending } = useGetUserAnalytics(user.id);
  const { data: currentUser } = useGetCurrentUser();

  // ✅ followers data
  const { data: newFollowers3d = 0 } = useGetNewFollowers(user.id, 3);
  const { data: newFollowers24h = 0 } = useGetNewFollowers(user.id, 1);

  const totalFollowers = currentUser?.followersCount || 0;

  // ✅ DERIVED METRICS
  const growthRate =
    totalFollowers > 0
      ? ((newFollowers3d / totalFollowers) * 100).toFixed(2)
      : 0;

  const followerVelocity = (newFollowers3d / 3).toFixed(1); // per day

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (isPending) return <Loader />;

  const posts = data?.posts || [];

  const chartData = posts.map((post) => ({
    id: post.$id,
    caption: post.caption?.slice(0, 90) || "Post",
    impressions: post.likesCount || 0,
    saves: post.savesCount || 0,
    reuse: post.repostCount || 0,
    fullPost: post,
  }));

  const maxValue = Math.max(
    ...chartData.flatMap((i) => [i.impressions, i.saves, i.reuse]),
    1
  );

  const maxStat = Math.max(
    data?.totalPosts || 0,
    data?.totalLikes || 0,
    data?.totalReposts || 0,
    data?.totalSaves || 0,
    1
  );

  const safe = (v: number) => Math.min(v, maxValue);

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-6 pt-20 analytics-page">
        <h3 className="analii">
          <span className="flex gap-3">
            Meme Lab <AnlyIcon />
          </span>
          <span className="text-white text-sm">
            Track your meme performance
          </span>
        </h3>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-2">

          <div className="p-4 rounded-2xl kich">
            <p className="text-sm font-bold">Total Memes</p>
            <h3>{data?.totalPosts || 0}</h3>
          </div>

          <div className="p-4 rounded-2xl">
            <p className="text-sm font-bold">Your Plugged-In Crew</p>
            <h3>{formatCount(totalFollowers)}</h3>
          </div>

          <div className="p-4 rounded-2xl">
            <p className="text-sm font-bold">Today's Plugg-ins (24h)</p>
            <h3>+{newFollowers24h}</h3>
          </div>

          <div className="p-4 rounded-2xl">
            <p className="text-sm font-bold">Last 3 Days pluged-ins</p>
            <h3>+{newFollowers3d}</h3>
          </div>

          <div className="p-4 rounded-2xl kaa">
            <p className="text-sm font-bold">Growth Rate</p>
            <h3>{growthRate}%</h3>
          </div>

          <div className="p-4 rounded-2xl liech">
            <p className="text-sm font-bold">Velocity</p>
            <h3>{followerVelocity}/day</h3>
          </div>

          <div className="p-4 rounded-2xl kaa">
            <p className="text-sm font-bold">Total Saves</p>
            <h3>{formatCount(data?.totalSaves || 0)}</h3>
          </div>

          <div className="p-4 rounded-2xl liech">
            <p className="text-sm font-bold">Total Impressions</p>
            <h3>{formatCount(data?.totalLikes || 0)}</h3>
          </div>

          <div className="bg-green-500 p-4 rounded-2xl whyy">
            <p className="text-sm font-bold">Total Reuses</p>
            <h3>{formatCount(data?.totalReposts || 0)}</h3>
          </div>
        </div>

        {/* ===== SPIRALS ===== */}
        <div className="bg-dark-2 p-6 rounded-2xl mb-8">
          <h3 className="mb-6">Overall Performance</h3>

          <div className="flex flex-wrap gap-6 justify-around">
            <SpiralGraph value={data?.totalPosts || 0} max={maxStat} label="Memes" gradientId="g1" colors={["#ff4d4d","#a6c1e"]} />
            <SpiralGraph value={data?.totalSaves || 0} max={maxStat} label="Saves" gradientId="g4" colors={["#ff4d4d","#a6c1ee"]} />
            <SpiralGraph value={data?.totalLikes || 0} max={maxStat} label="Impressions" gradientId="g2" colors={["#ff4d4d","#ff0000"]} />
            <SpiralGraph value={data?.totalReposts || 0} max={maxStat} label="Reuses" gradientId="g3" colors={["#43e97b","#38f9d7"]} />
          </div>
        </div>

        {/* ===== BARS ===== */}
        <div className="bg-dark-2 p-6 rounded-2xl">
          <span className="mb-6 analii flex gap-3">
            <span className="flex gap-3">
              Engagement per meme <AnlyIcon />
            </span>
          </span>

          {chartData.length === 0 ? (
            <p className="text-center py-10 text-light-4">
              No engagement yet!
            </p>
          ) : (
            <div className="space-y-5">
              {chartData.map((item) => {
                const saveWidth = (safe(item.saves) / maxValue) * 100;
                const likeWidth = (safe(item.impressions) / maxValue) * 100;
                const repostWidth = (safe(item.reuse) / maxValue) * 100;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedPost(item.fullPost);
                      setOpenDialog(true);
                    }}
                    className="cursor-pointer hover:bg-dark-3 bg-white/8 p-3 rounded-xl analytics-card"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="truncate max-w-[60%]">
                        ✦ {item.caption}
                      </span>

                      <span className="banna">
                        <Ansave /> {item.saves} ·
                        <Anliker /> {item.impressions} ·
                        <Anreuser /> {item.reuse}
                      </span>
                    </div>

                    <div className="h-2 bg-dark-4 rounded mb-1">
                      <div
                        className="h-full rounded"
                        style={{ width: `${saveWidth}%`, background: "linear-gradient(to right,#a6c1ee)" }}
                      />
                    </div>

                    <div className="h-2 bg-dark-4 rounded mb-1">
                      <div
                        className="h-full rounded"
                        style={{ width: `${likeWidth}%`, background: "linear-gradient(to right,#ff4d4d,#ff0000)" }}
                      />
                    </div>

                    <div className="h-2 bg-dark-4 rounded">
                      <div
                        className="h-full rounded"
                        style={{ width: `${repostWidth}%`, background: "linear-gradient(to right,#43e97b,#38f9d7)" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== DIALOG ===== */}
      {openDialog && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p00p">
          <div className="post-card-two max-h-[90vh] overflow-y-auto rounded-lg relative popo pt-13">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setOpenDialog(false)}
            >
              ✕
            </button>

            <PostDetails
              post={selectedPost}
              userId={selectedPost?.creator?.$id || ""}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default Analytics;