import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="w-full h-screen con-to justify-cenr con-to px-4">
      <div className="text-center space-y-4">
        
        <h1 className="text-4xl font-bold text-white">
          Meme Not Found
        </h1>

        <p className="text-zinc-500 text-sm">
          The meme you’re looking for doesn’t exist or may have been removed.
        </p>

        <Link
          to="/"
          className="mdagi btn-grad"
        >
          Continue Browsing
        </Link>

      </div>
    </div>
  );
};

export default PageNotFound;