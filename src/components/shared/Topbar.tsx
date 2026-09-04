import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";


const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  },[isSuccess])

  return (
    <section className="topbar ">
      <div className="flex gap-45 py-2 px-2">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assetss/images/memeflix.icon.jpg"
            alt="logo"
            height={325}
            width={160}
          />
        </Link>

        <div className="flex gap-4">
          <Button variant = "ghost" className="shad-button_ghost"
            onClick={() =>signOut()}>
            <img 
              src="assetss/icons/logout.svg"
              alt="logout"
            />
          </Button>

          <Link to={'/profile/${user.id}'} className="flex-center gap-3 items-centre">
            <img 
              src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
              alt="profile"
              className="user-image" //"h-10 w-30 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar