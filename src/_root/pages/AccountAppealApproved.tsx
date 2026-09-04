import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountAppealApproved = () => {
  const navigate = useNavigate();

  return (
    <div className="suspended-container">

      <div className="w-full max-w-md text-center border border-zinc-800 rounded-2xl p-6 bg-zinc-900/40">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-white">
          Appeal Approved
        </h1>

        {/* MESSAGE */}
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
          Your account suspension appeal has been reviewed and approved.
          Your account has been restored and you can now continue using MemeFlix normally.
        </p>

        {/* STATUS INFO */}
        <div className="mt-5 text-xs text-zinc-500 space-y-1">
          <p>Status: <span className="text-green-400">Active</span></p>
          <p>Access: Restored</p>
          <p>Review Outcome: Approved</p>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full h-12 bg-green-600 hover:bg-green-700 transition rounded-xl font-medium"
        >
          Return to Feed
        </button>

      </div>

    </div>
  );
};

export default AccountAppealApproved;