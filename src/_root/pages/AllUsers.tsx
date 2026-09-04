import { toast } from "sonner";
import UserCard from "@/components/shared/UserCard";

import { useState, useEffect } from "react";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutations";
import MemelordSearchInput from "@/components/shared/MemelordsSearchInput";
import { SkeletonSearch } from "@/components/shared/SearchSkeleton";

import kakamega from "../../../public/assetss/icons/search-status-svgrepo-com (1).svg"

const AllUsers = () => {
  const [searchValue, setSearchValue] = useState("");

  const {
    data: searchedUsers,
    isLoading: isSearching,
  } = useSearchUsers(searchValue);

  const {
    data: creators,
    isLoading,
    isError,
    error,
  } = useGetUsers();

  // decide what to show
  const usersToShow = searchValue.trim() ? searchedUsers : creators;

  // Handle error properly
  useEffect(() => {
    if (isError) {
      toast("Something went wrong fetching memelords.");
      console.error(error);
    }
  }, [isError, error]);

  // SHIMMER LOADER
  if (isLoading || (searchValue && isSearching)) {
    return (
      <div className="memelords-cornerr">
        <div className="memelords-corner">
          
          {/* SEARCH (keep visible even when loading) */}
          <div className="topper-searchh">
            <MemelordSearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <img
              src={kakamega}
              alt="search"
              className="search-topper"
            />

            <div className="right-filter">
              <p className="left-filter">ALL</p>
              <img src="/assetss/icons/all.png" width={20} height={20} />
            </div>
          </div>

          {/* SHIMMER GRID */}
          <ul className="user-grid">
            {[...Array(8)].map((_, i) => (
              <li key={i} className="userr shimmer-card">
                <div className="shimmer-avatar" />
                <div className="shimmer-line short" />
                <div className="shimmer-line long" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Safe fallback
  if (!usersToShow || !usersToShow.documents) {
    return (
      <div className="ngosti">
        <SkeletonSearch />
        <div className=" wavy-circle-xl">
          <img
            src="/assetss/images/profile-pic.png"
            alt="Users"
            className="user-image-sidebar"
          />
        </div>
        <p className="hellen">Oops No Memelords Found!</p>
      </div>
    );
  }

  return (
    <div className="memelords-cornerr">
      <div className="memelords-corner">
        
        {/* SEARCH */}
        <div className="topper-searchh">
          <MemelordSearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <img
            src="/assetss/icons/searchh.png"
            alt="search"
            className="search-topper"
          />

          <div className="right-filter">
            <p className="left-filter">ALL</p>
            <img src="/assetss/icons/all.png" width={20} height={20} />
          </div>
        </div>

        {/* FILTER */}
        <div className="filter-des">
          <div className="left-fillter">Discover Top Memelords</div>
        </div>

        <ul className="user-grid">
          {usersToShow.documents.map((creator: any) => (
            <li key={creator?.$id} className="userr">
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllUsers;