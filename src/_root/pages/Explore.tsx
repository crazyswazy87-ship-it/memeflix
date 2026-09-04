import Ejimo117 from "@/components/shared/EjimosEmoji/Ejimo117";
import GridPostLists from "@/components/shared/GridPostLists";
import Loader from "@/components/shared/Loader";
import MemeSearchInput from "@/components/shared/MemeSearchInput";
import SearchResults from "@/components/shared/SearchResults";
import { SkeletonSearch } from "@/components/shared/SearchSkeleton";
import SimpleTooltip from "@/components/shared/SimpleTooltip";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import useDebounce from "@/hooks/useDebounce";
import { useGetExplorePosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useState } from "react";

import kakamega from "../../../public/assetss/icons/search-status-svgrepo-com (1).svg"

const Explore = () => {

const [mode, setMode] = useState<"top" | "trending">("trending");

const {
  data: posts,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useGetExplorePosts(mode);
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue, 600);

  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debounceValue);



  if (!posts?.pages) {
    return (
      <div className="ngosti explore-container">
        <SkeletonSearch />
        <span className="mt-5 hellen">Explore Popular Memes</span>
        <SkeletonCard />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";

  return (
    <div className="explore-container">
      {/* SEARCH */}
      <div className="topper-search">
        <MemeSearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <img
          src={kakamega}
          alt="search"
          className="search-topper"
        />

        <div className="right-filter">
            <SimpleTooltip text="Trending">
              <p onClick={() => setMode("trending")}>
                <img
                  src={
                    mode === "trending"
                      ? "/assetss/icons/trendingre.png"
                      : "/assetss/icons/trendingg.png"
                  }
                  width={30}
                  height={30}
                />
              </p>
            </SimpleTooltip>

            <SimpleTooltip text="Top">
              <p onClick={() => setMode("top")}>
                <img
                  src={
                    mode === "top"
                      ? "/assetss/icons/top.png"
                      : "/assetss/icons/topre.png"
                  }
                  width={27}
                  height={27}
                />
              </p>
            </SimpleTooltip>
        </div>
      </div>

      {/* FEED */}
      
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : (
          posts.pages.map((item, index) => (
            <GridPostLists
              key={`page-${index}`}
              posts={item?.documents?.filter(Boolean) || []}
            />
          ))
        )}


       {/* INFINITE SCROLL TRIGGER */}
      {!searchValue && (
        <div className="refleshh">
          {isFetchingNextPage ? (
            <Loader />
          ) : hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              className="ntb"
            >
              <img 
                src="/public/assetss/images/lef.png"
                height={60}
                width={90}
              />
            </button>
          ) : (
            <div className="ndomko">Seems like there is nothing here <Ejimo117/> </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Explore;