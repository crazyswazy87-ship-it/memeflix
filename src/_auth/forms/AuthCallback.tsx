import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { account } from "@/lib/appwrite/config";

const AuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const login = async () => {
      try {
        const userId = params.get("userId");
        const secret = params.get("secret");

        if (!userId || !secret) throw new Error("Invalid link");

        // create session from magic link
        await account.createSession(userId, secret);

        navigate("/auth-loading");
      } catch (err) {
        console.error(err);
        navigate("/sign-in");
      }
    };

    login();
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthCallback;