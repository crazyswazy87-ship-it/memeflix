import type { Models } from "appwrite";
import Loader from "@/components/shared/Loader";
import GridPostLists from "./GridPostLists";


type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({isSearchFetching, searchedPosts}: 
  SearchResultsProps) => {
    if(isSearchFetching){ return <Loader />
    }
      else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostLists posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="messo">No Memes found ~_~.   Try adjusting your search</p>
    );
  }
};


export default SearchResults