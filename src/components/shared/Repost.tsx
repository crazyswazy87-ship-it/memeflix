import PostFormm from "@/components/forms/PostFormm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";

interface Post {
  $id: string;
  caption: string;
  imageId: string;
  imageUrl?: string;
  originalPostId: Post.$id;
  action: "Create";
}

const Repost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");

  if (isPending) return <Loader />;
  if (!post) return <Loader />;

  const mappedPost: Post = {
    $id: "",
    caption: "",
    imageId: post.imageId,
    imageUrl: post.imageUrl,
    originalPostId: post.$id,
    action: "Create",
  };

  return (
    <div className="repost-sec">
      <div className="common-container">
        <div className="publish-des">
          <img
            src="/assetss/icons/add-post.svg"
            width={36}
            height={36}
            alt="repost"
          />

          <h2 className="h3-bold md:h2-bold text-left w-full mb-3">
            Reuse Media 
          </h2>
          
        </div>

        <PostFormm action="Publish" post={mappedPost} />

        <Link to={'/blockseven'} className="brandd">
          FROM BLOCK SEVEN
        </Link>
      </div>
    </div>
  );
};

export default Repost;