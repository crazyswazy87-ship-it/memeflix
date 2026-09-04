import PostFormm from "@/components/forms/PostFormm"



const CreatePost = () => {
  return (
    <div className="flex flex-1 mt-20 justify-center">
      <div className="common-container">
        <div className="publish-des">
          <img 
            src="/assetss/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Publish Your Meme
          </h2>
        </div>

        <PostFormm/>
      </div>
    </div>
  )
}

export default CreatePost