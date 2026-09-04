import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {Form,FormControl,FormItem,FormMessage,FormField} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button"
import { PostValidation } from "@/lib/validation";
import { Textarea } from "../ui/textarea";

import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/constants/context/AuthContext";
import { incrementRepostCount } from "@/lib/appwrite/api";
import FileUpload from "../shared/FileUpload";
import Occupation from "../shared/Occupation";

interface Post {
  $id: string;
  caption: string;
  imageId: string;
  imageUrl?: string;
  originalPostId?: string;
}

type PostFormProps = {
  post?: Post;
  action: "Publish" | "Update";
};


const PostForm = ({post, action}: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
  useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();


  const { user } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
  resolver: zodResolver(PostValidation),
  defaultValues: {
    caption: post ? post.caption : "",
    file: [],
    imageUrl: post?.imageUrl || "",   // ✅ ADDED THIS SHY
  }, 
});

async function onSubmit(values: z.infer<typeof PostValidation>) {
  // ❗ Safety fallback (extra protection)
  if (!values.file || values.file.length === 0) {
    return toast.error("Something went wrong with image upload.");
  }

  if (post && action === "Update") {
    const updatedPost = await updatePost({
      ...values,
      postId: post.$id,
      imageId: post?.imageId,
      imageUrl: post?.imageUrl,
      originalPostId: post?.originalPostId,
      userId: user.id,
    });

    if (!updatedPost) {
      toast.error("Post update failed. Please try again.");
    }

    return navigate(`/posts/${post.$id}`);
  }

  const newPost = await createPost({
    ...values,
    imageUrl: post?.imageUrl,
    imageId: post?.imageId,
    isRepost: !!post?.originalPostId,
    userId: user.id,
  });

  if (post?.originalPostId) {
    await incrementRepostCount(post.originalPostId);
  }

  if (!newPost) {
    return toast.error("Failed to create post.");
  }

  navigate("/");
}
  

  return (
    <Form {...form}>
     <div className="create-meme-sec">
      <div className="brizi">
        <img 
          src="assetss/images/search-back.png"
          className="zibri"
        />
      </div>

      <div className="fis">
      <form onSubmit= {form.handleSubmit(onSubmit)}
        className="top-pub">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea className="inpu2" placeholder="Your turn! Unleash your humour,,," {...field} />
              </FormControl>
              <FormMessage className="msg"/>
            </FormItem>
          )}
        /> 

      <div className="julius">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUpload 
                  fieldChange={field.onChange}
                  mediaUrl={post ?.imageUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mabut-tons">
          <Button type="submit" className="submittt-btn" 
            disabled={isLoadingCreate || isLoadingUpdate}>
            {isLoadingCreate ? <Loader/> : 
            <span className="seg">
              {(isLoadingCreate || isLoadingUpdate) && <Loader />}
              {action}
              <img 
                src="/assetss/icons/upload.png"
                alt="post"
                className="pushh"
              />

            </span>}
          </Button>
        </div>  

        </div>
      </form>
      </div>
      <Occupation />
     </div> 
    </Form>
  )
}

export default PostForm
