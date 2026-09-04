import PostFormm from "@/components/forms/PostFormm"
import { Link } from "react-router-dom"



const CreatePost = () => {
  return (
    <div className="yoyoma">
      <div className="common-conta1ner">
        <div className="publish-des">
          <img 
            src="/assetss/icons/add-post-icon.png"
            width={46}
            height={46}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-center w-full mb-3">
            Publish Your Meme
          </h2>
        </div>
        <PostFormm action= "Publish"/>
        <Link to={'/blockseven'} className="brand">
          FROM BLOCK SEVEN
        </Link>
      </div>
    </div>
  )
}

export default CreatePost