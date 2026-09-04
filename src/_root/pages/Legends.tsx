import Loader from "@/components/shared/Loader";
import MemelordSearchInput from "@/components/shared/MemelordsSearchInput";
import VerifiedBadge from "@/components/shared/VerifiedBadge";
import { useGetUsersById } from "@/lib/react-query/queriesAndMutations";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type LegendsProps = {
  users?: any[];
  type?: "followers" | "following";
};

const LegendItem = ({
  item,
  type,
}: {
  item: any;
  type?: "followers" | "following";
}) => {
  const targetUserId =
    type === "followers"
      ? item.followerId
      : item.followingId;

  const { data: user, isLoading } =
    useGetUsersById(targetUserId);

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true })

  const [runUsernameShimmer, setRunUsernameShimmer] = useState(false)
    
   useEffect(() => {
    if (!isInView) return
  
    const timer = setTimeout(() => {
      setRunUsernameShimmer(true)
    }, 4000)
  
    return () => clearTimeout(timer)
  }, [isInView])

  if (isLoading) {
    return <Loader />;
  }

  if (!user) return null;
  console.log(user)

  return (
  <Link
      to={`/profile/${user.$id}`}
    >
    <div className="yung">
          
         
          {/* USERS */}
          <ul className="streatham"> 
                <li
                  key={user.$id}
                  className={`ze-e cursor-pointer`}
                 >
                  <div className="user-prof">
                    <img
                      src={user.imageUrl || "/assetss/images/profile-pic.png"}
                      className="user-pro"
                      
                    />
          
                  </div>
    
                <div
                  className={ `krg username-card ${
                    user?.isVerified && runUsernameShimmer
                      ? "verified-shimmer"
                      : ""
                  }` } ref={cardRef}>

                  <span>@{user.username}</span>
                  <span>||</span>
                  <span className="signature">{user.name}</span>
                    
                  {user.isVerified && <VerifiedBadge/> }
                  </div>
                </li>
              
          </ul>
        </div>
    </Link>
  );
};

const Legends = ({ users = [], type }: LegendsProps) => {
  console.log(users);

  if (!users.length) {
    return (
      <div className="text-center text-light-4 py-4">
        No {type} yet
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {users.map((item: any) => (
        <LegendItem
          key={item.$id}
          item={item}
          type={type}
        />
      ))}
    </ul>
  );
};

export default Legends;