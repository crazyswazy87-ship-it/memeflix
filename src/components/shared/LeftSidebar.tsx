import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSignOutAccount, useGetNotifications } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useMemo } from "react";
import type { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "../ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUserContext } from "@/constants/context/AuthContext";
import LogoutDetails from "./logoutDetails";
import { DialogStickyFooter } from "./Terms&Condition";
import AiCon from "./AiCon";
import VerifiedBadge from "./VerifiedBadge";
import Alitics from "./Alitics";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatCount } from "@/lib/utils";
import Supports from "./Supports";
import Avo from "./Avo";
import Edits from "./Edits";

import ruse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg"
import tagg from '../../../public/assetss/icons/tag-user-svgrepo-com.svg'
import saved from "../../../public/assetss/icons/archive-1-svgrepo-com (1).svg"
import comment from "../../../public/assetss/icons/message-notif-svgrepo-com.svg"
import folo from "../../../public/assetss/icons/profile-add-svgrepo-com (1).svg"
import anfolo from "../../../public/assetss/icons/profile-remove-svgrepo-com (1).svg"
import hearty from "../../../public/assetss/icons/lovely-svgrepo-com.svg"

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const queryClient = useQueryClient();

  // ✅ prevent crash
  if (!user) return null;

  // ✅ notifications hook
  const { data } = useGetNotifications(user.id);
  const notifications = data?.documents || [];

  // ✅ memoized counts
  const counts = useMemo(() => {
    const c = {
      like: 0,
      save: 0,
      repost: 0,
      follow: 0,
      mention: 0,
    };

    notifications.forEach((n: any) => {
      if (!n.isRead && c[n.type] !== undefined) {
        c[n.type]++;
      }
    });

    return c;
  }, [notifications]);

  const totalUnread = useMemo(() => {
    return Object.values(counts).reduce((a, b) => a + b, 0);
  }, [counts]);

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  const handleLogoClick = () => {
    if (pathname === "/") {
      queryClient.invalidateQueries(["GET_NOTIFICATIONS", user.id]);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="leftsidebar">
      <div>
        {/* LOGO */}
        <Link to="/" className="flex gap-3 items-center" onClick={handleLogoClick}>
          <img
            src="/assetss/images/logo-1.png"
            alt="logo"
            height={385}
            width={230}
            onClick={() => window.location.reload()}
          />
        </Link>

        {/* PROFILE */}

        <DropdownMenu>
           <DropdownMenuTrigger asChild className="logs">
              <Button variant="outline" className="nyonyoi">
                <div className="side-proff wavy-circle-xl">
                  <img
                    src={user.imageUrl || "/assetss/images/profile-pic.png"}
                    alt="profile"
                    className="user-image-sidebar"
                  />
                </div>

                <div className="majaa">
                  <span className="maja">{user.username || "Memelord"}</span>
                  {user.isVerified && <VerifiedBadge />}
                </div>
              </Button>
            </DropdownMenuTrigger>

           <DropdownMenuContent className="p0p">
              <DropdownMenuItem>
                {/* PROFILE */}
              <Link to={`/profile/:${user.id}`}>
                <Avo />
              </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                {!user.isVerified && (
                  <Link to={"/verify/:id"} className="seg-prof">
                    <VerifiedBadge />
                    Get Verified
                  </Link>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to={`/update-profile/:${user.id}`}>
                  <Button className="regulr">
                  <Edits />
                </Button>
                </Link>
              </DropdownMenuItem>
              

              <DropdownMenuItem>
                {user.isVerified ? (
                  <Link to={"/analytics"}>
                    <Button className="regulr">
                      <Alitics />
                    </Button>
                  </Link>
                ) : (
                  <div
                    className="regulr"
                    onClick={() =>
                      toast.message("Get Verified to Unlock This Feature")
                    }
                  >
                    <Alitics />
                    
                  </div>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem>
              <Link to={"/support"}>
               <div className="regulr">
                <Supports />
                   
               </div>
               </Link>
              </DropdownMenuItem>

                <LogoutDetails />


            </DropdownMenuContent>
        </DropdownMenu>

        {/* 🔔 NOTIFICATIONS */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <AiCon />

              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {formatCount(totalUnread)}
                </span>
              )}
            </Button>
          </PopoverTrigger>


          <Link to={'/notifications'}>
            <PopoverContent align="start" className="tify">
              <div className="dem">
                <img
                  src={folo}
                  className="inline w-6.5 h-6.5"
                />
                <span className={`sos  ${counts.follow === 0 && "hidden"}`}>+{formatCount(counts.follow)}</span>
              </div>

              {/* UNFOLLOW */}
              <div className="dem">
                <img
                  src={anfolo}
                  className="inline w-6.5 h-6.5"
                />
                <span className={`sos  ${counts.follow === 0 && "hidden"}`}>-{formatCount(counts.follow)}{/*should be unfollow */}</span>
              </div>

              <div className="dem">
                <img
                  src={hearty}
                  className="inline w-6.5 h-6.5"
                />
                <span className={`sos  ${counts.like === 0 && "hidden"}`}>+{formatCount(counts.like)}</span>
              </div>

               {/* Comment */}
              <div className="dem">
                <img
                  src={comment}
                  className="inline w-6.5 h-6.5"
                />
              </div>

              <div className="dem">
                <img
                  src={ruse}
                  className="inline w-6.5 h-6.5"
                />
                <span className={`sos  ${counts.repost === 0 && "hidden"}`}>+{formatCount(counts.repost)}</span>
              </div>

              <div className="dem">
                <img
                  src={tagg}
                  className="inline w-6.5 h-6.5"
                />
                <span className={`sos  ${counts.mention === 0 && "hidden"}`}>+{formatCount(counts.mention)}</span>
              </div>
              
              <div className="dem">
               <img
                  src={saved}
                  className="inline w-6.5 h-6.5"
                />
                <span className={`sos  ${counts.save === 0 && "hidden"}`}>+{formatCount(counts.save)}</span>
              </div>

            </PopoverContent>
          </Link>
        </Popover>

        {/* NAV LINKS */}
        <ul className="nyafi">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-links ${isActive ? "bg-black" : ""}`}
              >
                <NavLink
                  to={link.route}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 ${
                      isActive ? "text-red-500" : "text-gray-700"
                    }`
                  }
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className="mboto"
                  />
                  <span className="puta ">{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* FOOTER 
        <div className="left-secc">
          <LogoutDetails />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <AiCon />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p0p">
              <DropdownMenuItem>
                {!user.isVerified && (
                  <Link to={"/verify/:id"} className="seg-prof">
                    <VerifiedBadge />
                    Get Verified
                  </Link>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem>
                {user.isVerified ? (
                  <Link to={"/analytics"}>
                    <Button className="lock-btn">
                      <Alitics />
                    </Button>
                  </Link>
                ) : (
                  <div
                    className="regular"
                    onClick={() =>
                      toast.message("Get Verified to Unlock This Feature")
                    }
                  >
                    <Alitics />
                    See Analytics
                  </div>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          */}

        <DialogStickyFooter />
      </div>
    </nav>
  );
};

export default LeftSidebar;