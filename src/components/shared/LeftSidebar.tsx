import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import type { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "../ui/button";


const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  },[isSuccess])

  return (
      <nav className="leftsidebar">
      <div>
        <Link to="/" className="flex gap-3 items-center ">
          <img
            src="/assetss/images/memeflix.icon.jpg"
            alt="logo"
            height={385}
            width={230}
          />
        </Link>

        <Link to = {'/profile/${user.id}'}
          className="flex gap-1 items-center">
            <img 
              src={user.imageUrl || "/assetss/icons/profile-placehlder.svg"}
              alt="profile"
              width={60}
              height={150}
              className="user-image-sidebar" //"rounded-full py-2 px-2"
            />
            <div className="flex">
              <p className="maja">
                {user.username}
              </p>
            </div>
        </Link>

        <ul className="flex flex-col gap-9 mt-7">
          { sidebarLinks.map((link: INavLink) => {
             const isActive = pathname === link.route;

              return (
                <li key={ link.label }
                  className={`leftsidebar-links group
                    ${isActive & 'bg-red-300'}`}
                  >
                  <NavLink
                    to = {link.route}
                    className= "mboka"//"flex gap-3 items-center p-4 bg-red"
                    >
                      <img 
                        src= {link.imgURL}
                        alt= {link.label}
                        className={`mboto ${isActive &&'bg-red-600'}`}
                      />
                      {link.label}

                  </NavLink>
                </li>
              )
          }) }
        </ul>
      </div>

          <Button 
            variant = "ghost" 
            className="shad-button_ghost mt-5"
            onClick={() =>signOut()}>
            <img 
              src="assetss/icons/logout.svg"
              alt="logout"
            />
            <p className="small-medium lg:small-medium">Logout</p>
          </Button>

    </nav>
  )
}

export default LeftSidebar