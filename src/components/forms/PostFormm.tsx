import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {Form,FormControl,FormItem,FormMessage,FormField} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";

import { PostValidation } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/constants/context/AuthContext";
import { incrementRepostCount } from "@/lib/appwrite/api";
import { useEffect, useRef, useState } from "react";

import mtukutu from '../../../public/assetss/icons/gallery-add-svgrepo-com (1).svg'
import tea from '../../../public/assetss/icons/tag-user-svgrepo-com.svg'
import marada from '../../../public/assetss/icons/document-text-svgrepo-com (1).svg'
import aura from '../../../public/assetss/icons/auraa.png'

import mbuzi from '../../../public/assetss/icons/arrow-up-1-svgrepo-com (1).svg'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Stepper, { Step } from "../shared/Stepper";

interface Post {
  $id: string;
  caption: string;
  imageId: string;
  imageUrl?: string;
  originalPostId?: string;
  aura?:string;
}

type PostFormProps = {
  post?: Post;
  action: "Publish" | "Update";
};

const auraCategories = {
  "🌍 Kenyan Culture": [
    "Kanairo Aura",
    "Sheng Aura",
    "Nganya Aura",
    "Campus Aura",
    "Mjengo Aura",
    "Street Aura",
    "Hustler Aura",
  ],

  "📈 Aura Status ": [
    "Aura Lost",
    "Aura Farming",
    "-1000 Aura",
    "+1000 Aura",
    "Rising Aura",
    "Legendary Aura",
    "Infinite Aura",
  ],

  "😈 Personality ": [
    "Villian Aura",
    "Delulu Aura",
    "Broke Aura",
    "Savage Aura",
    "Toxic Aura",
    "Lucky Aura",
    "Genius Aura",
    "Overthinker Aura",
    "Batman Aura",
  ],

  "🌐 Social Media": [
    "Viral Aura",
    "Fyp Aura",
    "Comment-sec Aura",
    "DM Aura",
    "Screenshot Aura",
  ],

  "🌌 Vibes": [
    "Midnight Aura",
  ],
};




const PostFormm = ({post, action}: PostFormProps) => {
  const [selectedAura, setSelectedAura] = useState("");
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
  useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();


  const { user } = useUserContext();
  const navigate = useNavigate();

  const [fileUrl, setFileUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

const form = useForm<z.infer<typeof PostValidation>>({
  resolver: zodResolver(PostValidation),
  defaultValues: {
    caption: "",
    file: [],
    imageUrl: "",
    aura: "",
  },
});

useEffect(() => {
  if (post) {
    form.reset({
      caption: post.caption || "",
      file: [],
      imageUrl: post.imageUrl || "",
      aura: post.aura || "",
    });

    setSelectedAura(post.aura || "");
    setFileUrl(post.imageUrl || "");
  }
}, [post]);

  async function onSubmit(values: z.infer<typeof PostValidation>) {
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
       toast.error(" Your meme update failed. Please try again.");
      }
      
      toast.success("Meme updated succefully")
      return navigate('/');
    }

    const newPost = await createPost({
    ...values,
    imageUrl: post?.imageUrl,
    imageId: post?.imageId,
    isRepost: !!post?.originalPostId,
    //originalPostId: post?.originalPostId,
    userId: user.id,
    });

   const rootPostId = post?.originalPostId || post?.$id;

  if (rootPostId && user?.id) {
    await incrementRepostCount(rootPostId, user.id);
  }


    if(!newPost) {
      return toast.error("Please insert a photo and try again.");
    }


    navigate('/');
  }
  

  return (
    <Form {...form}>
     <div className="create-meme-sec">
      <form onSubmit= {form.handleSubmit(onSubmit)}
          className="popcaan">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
            <div className="rot-oo">
            <FormItem>
            <FormControl>
              {/*Stepper*/}
              <Stepper
                initialStep={1}
                onStepChange={(step) => {
                  console.log(step);
                }}
                onFinalStepCompleted={() => console.log("All steps completed!")}
                backButtonText="Previous"
                nextButtonText="Next"
              >
                
                <Step>
                  {/* Input */}
                  <div className="mt-1 border-b border-white/10 pb-0">
                    <Textarea
                      type="text"
                      placeholder="What’s on your mind?"
                      className="input4"
                      {...field}
                    />
                  </div>
                  {/* Bottom */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-5 text-white text-xl">
                        <div
                          className='dreams'
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <img 
                            src={mtukutu}
                            alt="ADD"
                            onClick={() => fileInputRef.current?.click()}
                            className='post-photo'
                          />
                        </div>
                        

                        <div className='dreams'>
                          <img 
                            src={marada}
                            alt="DRAFTS"
                            className='post-photo'
                          />
                        </div>
                        

                      </div>
                      

                    </div>
                    {/*mboto */}
                  <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem >
                      <FormControl>
                        <FileUploader 
                          fieldChange={field.onChange}
                          mediaUrl={fileUrl || post?.imageUrl}
                          fileInputRef={fileInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </Step>
                <Step>
                  {/* Top */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="user-1mgg wavy-circle-sm">
                            <img
                              src={
                                //user.imageUrl ||
                                "/assetss/images/profile-pic.png"
                              }
                              className="user-image"
                            />
                          </div>

                        <div>
                          <h2 className="text-white font-semibold text-lg">
                            ishow.weed
                          </h2>
                        <div className="text-gray-300 text-sm wastedd">
                            {selectedAura ? selectedAura : "Set Aura"}
                        </div>
                        </div>
                      </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <div className='find'>
                                <button className='someone'
                                  type="button"
                                >
                                    <img
                                      src={aura}
                                      alt='A'
                                      className='auraa'
                                    />
                                </button>
                                <div className="text-white text-2xl leading-none her">
                                  <span className='me'>
                                  </span>
                                </div>
                                
                              </div>
                            </DialogTrigger>
                      
                              <DialogContent className="terms-conditions">
                                <DialogHeader>
                                  <DialogTitle>Set Aura for this meme</DialogTitle>
                                </DialogHeader>

                                <div className="-mx-4 no-scrollbar max-h-[65vh] overflow-y-auto px-4 space-y-6">

                                  {Object.entries(auraCategories).map(([category, auras]) => (
                                    <div key={category} className="space-y-3">

                                      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                                        {category}
                                      </h2>

                                      <div className="grid grid-cols-2 gap-3">
                                        {auras.map((aura) => (
                                          <button
                                            key={aura}
                                            type="button"
                                            onClick={() => {
                                              setSelectedAura(aura);
                                              form.setValue("aura", aura, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                              });
                                            }}
                                            className={`btn-grad rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200
                                            
                                            ${
                                              selectedAura === aura
                                                ? "border-white bg-white text-black"
                                                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                            }`}
                                          >
                                            {aura}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <DialogFooter>
                                  <DialogClose asChild>
                                    <button className="lock-btn2">
                                      {selectedAura ? selectedAura : "Select Aura"}
                                    </button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            
                          </Dialog>
                    </div>
                  
                  {/*mboto */}
                  <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem >
                      <FormControl>
                        <FileUploader 
                          fieldChange={field.onChange}
                          mediaUrl={fileUrl || post?.imageUrl}
                          fileInputRef={fileInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </Step>
                <Step >
                  <div className="daps">
                  Tag memelords
                  <div className='dreams'>
                    <img 
                      src={tea}
                      alt="TAG"
                      className='post-photo'
                    />
                  </div>
                  </div>
                </Step>
                <Step>
                  <div className="daps">
                    Your Meme is ready 
                  <button type="submit" className="publisher"
                    disabled={isLoadingCreate || isLoadingUpdate}>
                    {isLoadingCreate ? <Loader/> : 
                    <span className="seg">
                      {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                      {action}
                      <img 
                        src={mbuzi}
                        alt="post"
                        className="pushh"
                      />

                    </span>}
                  </button>
                  </div>
                </Step>
              </Stepper>
            </FormControl>
            <FormMessage className="msg"/>
              </FormItem>
              </div>
            )}
            /> 
    </form>
     </div>
    </Form>
  )
}

export default PostFormm
