//import Drops from "@/components/shared/Drops";
//import Loader from "@/components/shared/Loader";
import Occupation from "@/components/shared/Occupation";
import { OccupationsSkeleton } from "@/components/shared/OccupationSkeleton";
//import Occupation from "@/components/shared/Occupation";
import PostCard from "@/components/shared/PostCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import type { Models } from "appwrite";

const Home = () => {
  
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPost,
  } = useGetRecentPosts();

  return (
    <div className="flex flex-1 justify-center p-4">
      <div className="home-container w-ful max-w-3xl">
          {isPostLoading && !posts ? (
             <div className="ngosti">
                <OccupationsSkeleton />
                <span className="hellen mt-3">Summoning humour</span>
                 <SkeletonCard />
             </div>
          ) : (
            <>
            <Occupation />
            
            <ul className="flex flex-1 flex-col gap-7 w-full pt-5 ">
              {posts ?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id}/>
              ))}
            </ul>
            </>
          )}
      </div>
    </div>
  );
};

export default Home;
