import { ShieldAlert} from "lucide-react";
import { Link } from "react-router-dom";

const AccountSession = () => {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center px-4 overflow-hidden con-to">
      <div className="w-full max-w-md  border border-red-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-145 align-middle ">

        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-red-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-orange-500/10 blur-3xl rounded-full" />

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="text-red-500 w-10 h-10" />
        </div>

        {/* Content */}
        <div className="text-center space-y-4 relative z-10">
          <h1 className="text-3xl font-bold text-white">
            Access Interrupted
          </h1>

          <p className="text-zinc-400 leading-relaxed text-sm">
            We detected unusual activity on your account and ended this
            session to keep your account secure.
          </p>

          <p className="text-zinc-500 text-sm">
            Reconnect to continue using MemeFlix safely.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 relative z-10">
          <Link
            to="/sign-in"
            className="w-full h-12 rounded-xl btn-grad"
          >
            Reconnect
          </Link>

          <Link
            to="/support"
            className="w-full h-12 rounded-xl btn-grad"
          >
            Contact Support
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-zinc-600 relative z-10">
          MemeFlix Security System • Session Protection Enabled
        </div>
      </div>
    </div>
  );
};

export default AccountSession;