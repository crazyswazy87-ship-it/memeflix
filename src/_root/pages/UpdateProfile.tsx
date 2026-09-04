import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetUsersById,
  useSignOutAccount,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutations";

import { databases, appwriteConfig } from "@/lib/appwrite/config";
import { Query } from "appwrite";

import { AlertDialogDestructive } from "@/components/shared/AlertDialogueDestructive";
import { DialogStickyFooter } from "@/components/shared/Terms&Condition";
import LogoutDetails from "@/components/shared/logoutDetails";
import { useUserContext } from "@/constants/context/AuthContext";
import { toast } from "sonner";
import Alitics from "@/components/shared/Alitics";
import VerifiedBadge from "@/components/shared/VerifiedBadge";
import { SkeletonUpdate } from "@/components/shared/SkeletonUpdate";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: ProfileUser, isLoading } = useGetUsersById(id || "");
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  

  const [usernameError, setUsernameError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  const usernameCache = useRef<Record<string, boolean>>({});

  const reservedUsernames = [
    "memeflix",
    "memefl1x",
    "memeflixx",
    "mmemeflix",
    "memmeflix",
    "mmemmeflix",
    "mmemmefl1x",
    "memmefl1x",
    "memefl1x",
    "memeflixxx",
  ];

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();

  // 🔐 Logout redirect fix
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);  

  // 📥 Load user data
  useEffect(() => {
    if (!ProfileUser) return;

    setUsername(ProfileUser.username || "");
    setName(ProfileUser.name || "");
    setBio(ProfileUser.bio || "");
    setPhoneNumber(ProfileUser.phoneNumber ?? "");

    const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
    const lastUpdate = ProfileUser.usernameUpdatedAt;

    // No previous change → allow instantly
    if (!lastUpdate) {
      setCanChangeUsername(true);
      setTimeLeft("");
      return;
    }

    const unlockTime = new Date(lastUpdate).getTime() + COOLDOWN_MS;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = unlockTime - now;

      if (remaining <= 0) {
        setCanChangeUsername(true);
        setTimeLeft("");
        return true; // signal to stop
      }

      setCanChangeUsername(false);

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      return false;
    };

    // Run immediately
    const shouldStop = updateTimer();

    if (shouldStop) return;

    const interval = setInterval(() => {
      const stop = updateTimer();
      if (stop) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [ProfileUser]);

  // Username validation (NO DIGITS)
  const validateUsername = (value: string) => {
    if (value.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-z._]+$/.test(value))
      return "Only lowercase letters, . and _ allowed (no numbers)";
    return "";
  };

  //  Check username in DB
  const checkUsernameExists = async (value: string) => {
    if (!ProfileUser) return;

    if (usernameCache.current[value] !== undefined) {
      setIsAvailable(usernameCache.current[value]);
      return;
    }

    try {
      setIsChecking(true);

      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("username", value)]
      );

      const exists = res.documents.some(
        (doc: any) => doc.$id !== ProfileUser.$id
      );

      const available = !exists;
      usernameCache.current[value] = available;
      setIsAvailable(available);
    } catch (error) {
      console.log(error);
    } finally {
      setIsChecking(false);
    }
  };

  // ⚡ MAIN USERNAME EFFECT (CLEAN)
  useEffect(() => {
  if (!username || !ProfileUser) return;

  if (!canChangeUsername) {
    setIsAvailable(null);
    return;
  }

    // skip if unchanged
    if (username === ProfileUser.username) {
      setIsAvailable(true);
      setUsernameError("");
      return;
    }

    const error = validateUsername(username);
    setUsernameError(error);

    if (error) {
      setIsAvailable(null);
      return;
    }

    // Reserved check
    const isReserved = reservedUsernames.includes(username);

    if (isReserved) {
      setIsAvailable(false);
      setUsernameError("This username is not allowed");
      return;
    }

    const delay = setTimeout(() => {
      checkUsernameExists(username);
    }, 500);

    return () => clearTimeout(delay);
  }, [username, canChangeUsername, ProfileUser]);

  // Handle input (BLOCK DIGITS)
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canChangeUsername) return;

    let value = e.target.value.toLowerCase();

    value = value.replace(/[0-9]/g, ""); // remove numbers
    value = value.replace(/\s/g, "");    // remove spaces

    setUsername(value);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ProfileUser) return;

    let finalUsername = ProfileUser.username;

    if (canChangeUsername && username !== ProfileUser.username) {
      const error = validateUsername(username);

      if (error || isAvailable === false) {
        setUsernameError(error || "Username already taken");
        return;
      }

      finalUsername = username;
    }

    try {
      await updateUser({
      userId: ProfileUser.$id,
      username: finalUsername,
      name,
      bio,
      phoneNumber: phoneNumber.trim() !== "" ? phoneNumber : null, // ✅ FIX
      file,
      imageUrl: ProfileUser.imageUrl,
      imageId: ProfileUser.imageId,
      ...(canChangeUsername &&
      username !== ProfileUser.username
        ? { usernameUpdatedAt: new Date().toISOString() }
        : {}),
    });
      
       toast.success("Profile updated" );

      navigate(`/profile/${ProfileUser.$id}`);
    } catch (error: any) {
      toast.error("Failed to update profile ");

      if (
        error?.message?.toLowerCase().includes("unique") ||
        error?.code === 409
      ) {
        setUsernameError("Username already taken");
        setIsAvailable(false);
      } else {
        console.error(error);
      }
    }
  };


  if (isLoading || !ProfileUser) {
    return (
      <div className="ngosti">
        <SkeletonUpdate />
      </div>
    );
  }

  return (
    <div className="update-prof1le">
      <form onSubmit={handleSubmit} className="update-form">

        {/* Profile Image */}
        <div className="flex flex-col gap-2">
          <img
            src={
              previewImage ||
              ProfileUser.imageUrl ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="up-profile"
          />

          <div className="njapi">
            <label className="cursor-pointer">
              <img
                src="/assetss/icons/profile-add.png"
                alt="upload profile"
                height={30}
                width={30}
              />

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];

                  if (selectedFile) {
                    setFile([selectedFile]);

                    // instant preview
                    const previewUrl = URL.createObjectURL(selectedFile);
                    setPreviewImage(previewUrl);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Username */}
        <div className="flex flex-col gap-1">
          <span className="kipande">Username</span>

          <div className="inp">
            <Input
              type="text"
              placeholder="choose your memflix handle"
              value={username}
              onChange={handleUsernameChange}
              disabled={!canChangeUsername}
            />

            <div className="inp-verify">
             {user.isVerified && <VerifiedBadge />}
            </div>
          </div>

          {!canChangeUsername && timeLeft && (
            <p className="text-yellow-500 text-sm">
              Locked • try again in {timeLeft}
            </p>
          )}

          {isChecking && (
            <p className="text-yellow-500 text-sm">Checking availability...</p>
          )}

          {isAvailable === true && !usernameError && !user.isVerified && (
            <p className="avail">
              Username available ✓

              <span className="aviator">
                Elevate your precense by owning this username
              </span>

              <button
                type="button"
                className="lock-btn"
                onClick={() => navigate(`/verify/${ProfileUser.$id}`)}
              >
                Get verified <VerifiedBadge />
              </button>
            </p>
          )}
          

          {(isAvailable === false || usernameError) && (
            <p className="text-red-500 text-sm">
              {usernameError || "Username already taken ✗"}
            </p>
          )}

          {username && isAvailable === null && !usernameError && (
            <p className="text-yellow-500 text-sm">
              Checking availability...
            </p>
          )}
        </div>

        {/* Name */}
        <span className="kipande">Name</span>
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Bio */}
        <span className="kipande">Bio</span>
        <Textarea
          placeholder="Habari Yako"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

         {/* Phone Number */}
        <span className="kipande">Phone</span>
        <Input
          type="text"
          placeholder="e.g 254712345678"
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhoneNumber(value);
          }}
        />

        {/* Email */}
        <span className="kipande">
          Email: <span className="mail">{user.email}</span>
        </span>

        {/* Actions */}
        <div className="actions-prof1le">
          <AlertDialogDestructive />

          <Button
           type="submit"
           disabled={
              isPending ||
              isChecking ||
              (canChangeUsername && isAvailable === false)
            }
            className="up-btn"
          >
            {isPending ? <Loader /> : "Update Profile"}
          </Button>
        </div>

        <div className="copyrightings">
          
          {user.isVerified && (
          <Link to={'/analytics'}>
            <Button className=" lock-btn">
              <Alitics />
            </Button>
          </Link>
          )}

          {!user.isVerified && (
            <div 
            className=" regulr"
            onClick={() => toast.message("Get Verified to Unlock This Feature")}>
              <Alitics />
            </div>
          )}

          <DialogStickyFooter />

          <LogoutDetails />
          <Link to={'/blockseven'} className="brand">
            FROM BLOCK SEVEN
          </Link>
        </div>

      </form>
    </div>
  );
};

export default UpdateProfile;