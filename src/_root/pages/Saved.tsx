
import GridPostLists from "@/components/shared/GridPostLists";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
//import { savePost } from "@/lib/appwrite/api";
import {
  useGetCurrentUser,
  useGetSavedPosts,
} from "@/lib/react-query/queriesAndMutations";

const Saved = () => {
  const { data: currentUser, isLoading: userLoading } = useGetCurrentUser();

  const { data: savedPosts, isLoading: savedLoading } =
    useGetSavedPosts(currentUser?.$id);

  // ✅ dedupe properly
  const posts = [
    ...new Map(
      savedPosts
        ?.filter((i) => i.post)
        .map((i) => [i.post.$id, i.post])
    ).values(),
  ].reverse();

  const isLoading = userLoading || savedLoading;

  return (
    <div className="saved-container">
      {isLoading ? (
        <div className="ngosti">
          <span className="mt-3 hellen">Saved Memes</span>
          <SkeletonCard />
        </div>
      ) : (
        <ul className="saved-arrangement">
          {posts.length === 0 ? (
            <>
              <img
                src="assetss/images/search-back.png"
                alt="Kanairo"
                className="mboto-fisa"
              />
              <p className="messo">
                No saved meme yet! Start saving your favourites memes
              </p>
            </>
          ) : (
            <GridPostLists posts={posts} showUser showStats />
          )}
        </ul>
      )}
    </div>
  );
};


export default Saved;