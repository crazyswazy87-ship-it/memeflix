import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useUserContext } from "@/constants/context/AuthContext";

import AiCon from "./AiCon";
import VerifiedBadge from "./VerifiedBadge";
import Alitics from "./Alitics";
import LogoutDetails from "./logoutDetails";
import Supports from "./Supports";
import Avo from "./Avo";

import { toast } from "sonner";

import {
  useGetNotifications,
} from "@/lib/react-query/queriesAndMutations";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { formatCount } from "@/lib/utils";
import { useNotificationSound } from "@/hooks/useNotificationSound";

import Edits from "./Edits";
import ruse from "../../../public/assetss/icons/recovery-convert-svgrepo-com.svg"
import tagg from '../../../public/assetss/icons/tag-user-svgrepo-com.svg'
import saved from "../../../public/assetss/icons/archive-1-svgrepo-com (1).svg"
import comment from "../../../public/assetss/icons/message-notif-svgrepo-com.svg"
import folo from "../../../public/assetss/icons/profile-add-svgrepo-com (1).svg"
import anfolo from "../../../public/assetss/icons/profile-remove-svgrepo-com (1).svg"
import hearty from "../../../public/assetss/icons/lovely-svgrepo-com.svg"

const Topbar = () => {
  const navigate = useNavigate();

  const { user } = useUserContext();

  // prevent crash
  if (!user) return null;

  const { data } = useGetNotifications(user.id);

  const notifications = data?.documents || [];

  // =========================================
  // COUNTS
  // =========================================

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
    return Object.values(counts).reduce(
      (a, b) => a + b,
      0
    );
  }, [counts]);

  // =========================================
  // NOTIFICATION SOUND
  // =========================================

  useNotificationSound(totalUnread);

  // =========================================
  // AUTO POPOVER
  // =========================================

  const [notifOpen, setNotifOpen] = useState(false);

  const previousCount = useRef(totalUnread);

  useEffect(() => {
    // ignore first render
    if (previousCount.current === 0) {
      previousCount.current = totalUnread;
      return;
    }

    // new notification arrived
    if (totalUnread > previousCount.current) {
      setNotifOpen(true);

      // auto close
      const timer = setTimeout(() => {
        setNotifOpen(false);
      }, 7000);

      return () => clearTimeout(timer);
    }

    previousCount.current = totalUnread;
  }, [totalUnread]);

  return (
    <section className="topbar">
      <div className="top-sec">

        {/* LOGO */}
        <div className="flex gap-3 items-center">
          <img
            src="/assetss/images/logo-1.png"
            alt="logo"
            height={325}
            width={160}
            onClick={() => window.location.reload()}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-2">

          {/* NOTIFICATIONS */}
          <Popover
            open={notifOpen}
            onOpenChange={setNotifOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative"
              >
                <AiCon />

                {/* BADGE */}
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {formatCount(totalUnread)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="center"
              className="tify cursor-pointer"
              onClick={() =>
                navigate("/notifications")
              }
            >
              {/* FOLLOW */}
              <div className="dem">
                <img
                  src={folo}
                  className="inline w-6.5 h-6.5"
                />

                <span
                  className={`sos ${
                    counts.follow === 0 && "hidden"
                  }`}
                >
                  +{formatCount(counts.follow)}
                </span>
              </div>

              {/* UNFOLLOW */}
              <div className="dem">
                <img
                  src={anfolo}
                  className="inline w-6.5 h-6.5"
                />
                <span
                  className={`sos ${
                    counts.follow === 0 && "hidden"
                  }`}
                >
                -{formatCount(counts.follow)}{/*should be unfollow */}
                </span>
              </div>

              {/* LIKE */}
              <div className="dem">
                <img
                  src={hearty}
                  className="inline w-6.5 h-6.5"
                />

                <span
                  className={`sos ${
                    counts.like === 0 && "hidden"
                  }`}
                >
                  +{formatCount(counts.like)}
                </span>
              </div>

              {/* Comment */}
              <div className="dem">
                <img
                  src={comment}
                  className="inline w-6.5 h-6.5"
                />
              </div>

              {/* REPOST */}
              <div className="dem">
                <img
                  src={ruse}
                  className="inline w-6.5 h-6.5"
                />

                <span
                  className={`sos ${
                    counts.repost === 0 && "hidden"
                  }`}
                >
                  +{formatCount(counts.repost)}
                </span>
              </div>

              {/* MENTION */}
              <div className="dem">
                <img
                  src={tagg}
                  className="inline w-6.5 h-6.5"
                />

                <span
                  className={`sos ${
                    counts.mention === 0 && "hidden"
                  }`}
                >
                  +{formatCount(counts.mention)}
                </span>
              </div>

              {/* SAVE */}
              <div className="dem">
                <img
                  src={saved}
                  className="inline w-6 h-6"
                />

                <span
                  className={`sos ${
                    counts.save === 0 && "hidden"
                  }`}
                >
                  +{formatCount(counts.save)}
                </span>
              </div>
            </PopoverContent>
          </Popover>

          {/* MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="nyonyoi"
              >
                <div className="user-1mgg wavy-circle-sm">
                  <img
                    src={
                      user.imageUrl ||
                      "/assetss/images/profile-pic.png"
                    }
                    className="user-image"
                  />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="p0p">

              {/* PROFILE */}
              <DropdownMenuItem>
                <Link to={`/profile/:${user.id}`}>
                  <Avo />
                </Link>
              </DropdownMenuItem>

              {/* VERIFIED */}
              <DropdownMenuItem>
                {!user.isVerified && (
                  <Link
                    to={"/verify/:id"}
                    className="seg-prof"
                  >
                    <VerifiedBadge />
                    Get Verified
                  </Link>
                )}
              </DropdownMenuItem>

                {/**Edit profile */}
              <DropdownMenuItem>
                <Link to={`/update-profile/:${user.id}`}>
                 <Button className="regulr">
                  <Edits />
                </Button>
                </Link>
              </DropdownMenuItem>

              {/* ANALYTICS */}
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
                      toast.message(
                        "Get Verified to Unlock This Feature"
                      )
                    }
                  >
                    <Alitics />
                  </div>
                )}
              </DropdownMenuItem>

              {/* SUPPORT */}
              <DropdownMenuItem>
                <Link to={"/support"}>
                <div className="regulr">
                  <Supports />
                </div>
                </Link>
              </DropdownMenuItem>

              {/* LOGOUT */}
              <LogoutDetails />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
};

export default Topbar;