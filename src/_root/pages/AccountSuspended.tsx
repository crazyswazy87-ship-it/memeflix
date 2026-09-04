import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const AccountSuspended = () => {
  // Example data (replace with backend values)
  const pardonCount = 1; // current strikes
  const maxPardons = 3;

  return (
    <div className="suspended-container">
      <div className="cardi">

        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <ShieldAlert className="text-red-500 w-10 h-10" />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Account Suspended
          </h1>

          <p className="text-zinc-400 text-sm">
            Your account has violated our Community Guidelines.
          </p>
        </div>

        {/* Pardon Counter */}
        <div className="mt-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-sm text-zinc-400">
            Report Pardons Used
          </p>

          <p className="text-xl font-bold text-white mt-1">
            {pardonCount} / {maxPardons}
          </p>

          <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${(pardonCount / maxPardons) * 100}%` }}
            />
          </div>

          <p className="text-xs text-zinc-500 mt-2">
            At 3 pardons, your account will be permanently blocked.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">

          <Link
            to="/appeal"
            className="btn-grad"
          >
            Go to Appeal
          </Link>

          <Link
            to="/suspension-history"
            className="btn-grad"
          >
            
            Suspension History
          </Link>

          <Link
            to="/support"
            className=" btn-grad"
          >
            
            Contact Support
          </Link>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          MemeFlix Moderation System
        </p>
      </div>
    </div>
  );
};

export default AccountSuspended;