import LogoutDetails from "@/components/shared/logoutDetails";
import { DialogStickyFooter } from "@/components/shared/Terms&Condition";
import { Ban, Headset} from "lucide-react";
import { Link } from "react-router-dom";

const AccountBan = () => {
  return (
    <div className="banned-screen">
      <div>

        {/* Icon */}
        <div className="w-25 wavy-circle h-25 mx-auto rounded-full bg-red-500/40 border border-red-500/20 flex items-center justify-center mb-6">
          <Ban className="w-10 h-10 text-red-500" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Account Permanently Banned
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed mt-4">
            Your account has been permanently banned due to repeated
            violations of our Community Guidelines.
          </p>
        </div>

        {/* Pardon Counter */}
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">

          <p className="text-sm text-zinc-500">
            Report Pardons Used
          </p>

          <p className="text-2xl font-bold text-red-500 mt-1">
            3 / 3
          </p>

          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-3">
            <div className="w-full h-full bg-red-500 rounded-full" />
          </div>

          <p className="text-xs text-zinc-600 mt-3">
            Maximum violation threshold exceeded
          </p>

        </div>

        {/* Description */}
        <p className="text-center text-zinc-400 text-sm mt-6 leading-relaxed">
          This account can no longer access MemeFlix services.
        </p>

        {/* Buttons */}
        <div className="mt-5 h-60 flex flex-col gap-3">

          <Link
            to="/support"
            className="btn-grad"
          >
            Contact Support
          </Link>

          <DialogStickyFooter />

          <LogoutDetails />

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          MemeFlix Moderation Systems
        </p>

      </div>
    </div>
  );
};

export default AccountBan;