import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { account } from "@/lib/appwrite/config";
import { useUserContext } from "@/constants/context/AuthContext";
import Loader from "@/components/shared/Loader";

const AuthOAuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { checkAuthUser } = useUserContext();

  useEffect(() => {
    const completeGoogleLogin = async () => {
      try {
        const userId = params.get("userId");
        const secret = params.get("secret");

        if (!userId || !secret) {
          throw new Error("Google authentication failed.");
        }

        await account.createSession(userId, secret);

        const loggedIn = await checkAuthUser();

        if (!loggedIn) {
          throw new Error(
            "Google login succeeded, but your account could not be loaded."
          );
        }

        navigate("/auth-loading", {
          replace: true,
        });
      } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error);

        navigate("/sign-in", {
          replace: true,
        });
      }
    };

    completeGoogleLogin();
  }, [checkAuthUser, navigate, params]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader />
      <p className="text-white text-sm">
        Connecting with Google...
      </p>
    </div>
  );
};

export default AuthOAuthCallback;