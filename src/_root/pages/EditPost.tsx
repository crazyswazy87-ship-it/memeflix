import PostFormm from "@/components/forms/PostFormm"
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom"

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");

  if (isPending || !post) return <Loader />;

  return (
    <div className="flex flex-1 mt-20 pt-3 justify-center overflow-y-scroll scroll-smooth">
      <div className="common-container">
        <div className="publish-des">
          <img 
            src="/assetss/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full mb-3">
            Edit Your Meme
          </h2>
        </div>

        <PostFormm 
          action="Update"
          post={{
            $id: post.$id,
            caption: post.caption ?? "",
            imageId: post.imageId ?? "",
            imageUrl: post.imageUrl ?? "",
          }}
        />

        <Link to="/blockseven" className="brandd">
          FROM BLOCK SEVEN
        </Link>
      </div>
    </div>
  );
};

export default EditPost;