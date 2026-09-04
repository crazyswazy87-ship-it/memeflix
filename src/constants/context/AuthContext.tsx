import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  getCurrentUser,
  getUserFromDB,
} from "@/lib/appwrite/api";

import type {
  IContextType,
  IUser,
} from "@/types";

export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  email: "",
  username: "",
  imageUrl: "",
  bio: "",
  isVerified: false,
  isMods: false,
  isAdmin: false,
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isAuthenticated: false,
  isVerified: false,
  isLoading: true,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

const AuthContext =
  createContext<IContextType>(
    INITIAL_STATE
  );

const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<IUser>(INITIAL_USER);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const checkAuthUser = useCallback(
    async () => {
      try {
        setIsLoading(true);

        const currentAccount =
          await getCurrentUser();

        if (!currentAccount) {
          setUser(INITIAL_USER);
          setIsAuthenticated(false);
          return false;
        }

        const userDoc =
          await getUserFromDB(
            currentAccount.$id
          );

        if (!userDoc) {
          setUser({
            id: currentAccount.$id,
            name: currentAccount.name || "",
            email: currentAccount.email || "",
            username: "",
            imageUrl: "",
            bio: "",
            isVerified: false,
            isMods: false,
            isAdmin: false,
          });

          setIsAuthenticated(true);

          return true;
        }

        setUser({
          id: currentAccount.$id,

          name:
            userDoc.name ??
            currentAccount.name ??
            "",

          email:
            userDoc.email ??
            currentAccount.email ??
            "",

          username:
            userDoc.username ?? "",

          imageUrl:
            userDoc.imageUrl ?? "",

          bio:
            userDoc.bio ?? "",

          isVerified:
            userDoc.isVerified ?? false,

          isMods:
            userDoc.isMods ?? false,

          isAdmin:
            userDoc.isAdmin ?? false,
        });

        setIsAuthenticated(true);

        return true;

      } catch (error) {
        console.error(
          "CHECK AUTH ERROR:",
          error
        );

        setUser(INITIAL_USER);
        setIsAuthenticated(false);

        return false;

      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    checkAuthUser();
  }, [checkAuthUser]);

  const value: IContextType = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    isVerified: user.isVerified,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useUserContext = () =>
  useContext(AuthContext);