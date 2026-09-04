import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import toxic from "../../../public/assetss/icons/add-square-svgrepo-com.svg";
import aste from "../../../public/assetss/images/block7.png";

import { deleteNote, getNotes } from "@/lib/appwrite/api";
import { useUserContext } from "@/constants/context/AuthContext";
import Loader from "./Loader";
import VerifiedBadge from "./VerifiedBadge";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useInView } from "framer-motion";
import { toast } from "sonner";

const Occupation = () => {
  const navigate = useNavigate();

  const { user } = useUserContext();

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef(null);

  const isInView = useInView(cardRef, {
    once: true,
  });

  const [runUsernameShimmer, setRunUsernameShimmer] =
    useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        setNotes(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const myNote = notes.find((note) => {
    const isMine = note.user === user.id;

    const notExpired =
      note.expiresAt &&
      new Date(note.expiresAt) > new Date();

    return isMine && notExpired;
  });

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      setRunUsernameShimmer(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isInView]);

  const formatShortTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() -
        new Date(date).getTime()) /
        1000
    );

    const minutes = Math.floor(seconds / 60);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);

    return `${days}d`;
  };

  const handleDelete = async (noteId: string) => {
  try {
    await deleteNote(noteId);

    setNotes((prev) =>
      prev.filter((note) => note.$id !== noteId)
    );

    toast.success("Note Deleted")
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="slider-wrapper" ref={cardRef}>
      {/* Add Note */}
      {!myNote ? (
        <div className="gichan">
          <div className="mboto-jicha wavy-circle">
            <img
              src={toxic}
              alt="add"
              className="mbocha"
              onClick={() => navigate("/add-note")}
            />
          </div>

          <span className="rietwa">Your Drop</span>

        </div>
      ) : (
        <div className="gichan">
          <div className="mboto-jicha wavy-circle-cxl">
            <img
              src={aste}
              alt="profile"
              className="mbotos-jicha"
            />
          </div>

          <span className="rietwa">
            Memeflix.lol
          </span>

          <div className="bororonja">
           .
          </div>
        </div>
      )}

      {/* Notes Feed */}
      {loading ? (
        <Loader />
      ) : (
        notes
          .filter(
            (item) =>
              item.expiresAt &&
              new Date(item.expiresAt) > new Date()
          )
          .map((item, i) => (
            <Dialog key={item.$id}>
              <DialogTrigger asChild>
                <div
                  className={
                    i % 2 === 0
                      ? "gicha"
                      : "gichan"
                  }
                >
                  <div className="mboto-jicha wavy-circle-cxl">
                    <img
                      src={item.imageUrl  || "/assetss/images/profile-pic.png"}
                      alt="drop"
                      className="mbotos-jicha"
                    />
                  </div>

                  <div className="tems">
                    {item.isVerified && (
                      <VerifiedBadge />
                    )}
                  </div>

                  <div className="bororonja">
                    {item.text}
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="kick-off">
                <DialogHeader>
                  <DialogTitle className="justify-center flex">
                    ✦ Note ✦
                  </DialogTitle>
                </DialogHeader>

                <div className="toppa">
                  <Link
                    to={`/profile/${item.user}`}
                    className="user-prof"
                  >
                    <img
                      src={
                        item.imageUrl ||
                        "/assetss/icons/profile-placeholder.svg"
                      }
                      className="user-pro"
                      alt="Creator Avatar"
                    />
                  </Link>

                  <div className="topper-sec">
                    <Link
                      to={`/profile/${item.user}`}
                    >
                      <div
                        className={`username-card ${
                          item.isVerified &&
                          runUsernameShimmer
                            ? "verified-shimmer"
                            : ""
                        }`}
                      >
                        <span className="kichele">
                          {item.username}

                          {item.isVerified && (
                            <VerifiedBadge />
                          )}
                        </span>
                      </div>
                    </Link>

                    <p className="user-time">
                      {formatShortTimeAgo(
                        item.$createdAt
                      )}
                    </p>
                  </div>
                </div>

                <div className="chura">
                  {item.text}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    {item.user === user.id ? (
                      <Button
                        variant="outline"
                        className="lock-btn2"
                        onClick={() => handleDelete(myNote.$id)}
                      >
                        Delete Note
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="lock-btn2"
                      >
                        Continue browsing
                      </Button>
                    )}
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))
      )}
    </div>
  );
};

export default Occupation;