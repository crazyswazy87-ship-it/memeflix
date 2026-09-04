import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "@/components/shared/Loader";

import {
  useUserContext,
} from "@/constants/context/AuthContext";

import bloco from "../../../public/assetss/images/block-7.png";

const AuthLoading = () => {

  const {
    checkAuthUser,
  } = useUserContext();

  const navigate =
    useNavigate();

  useEffect(() => {

    let alive = true;

    const init = async () => {

      try {

        const loggedIn =
          await checkAuthUser();

        if (!alive) return;

        if (!loggedIn) {
          navigate("/sign-in", {
            replace: true,
          });

          return;
        }

        navigate("/", {
          replace: true,
        });

      } catch (error) {

        console.error(error);

        navigate("/sign-in", {
          replace: true,
        });
      }
    };

    init();

    return () => {
      alive = false;
    };

  }, [checkAuthUser, navigate]);

  return (
    <div className="block-saba">

      <img
        src={bloco}
        className="w-100 h-100 animate-pulse"
        alt="Block Seven"
      />

      <Loader />

      <p className="brandd">
        A BLOCK SEVEN CREATION
      </p>

    </div>
  );
};

export default AuthLoading;