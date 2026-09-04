import { getCurrentUser } from "@/lib/appwrite/api";
import { createContext, useContext, useEffect, useState } from "react";
//import { set } from "zod";
//import { fa } from "zod/v4/locales";
import { useNavigate } from "react-router-dom";
import type { IContextType, IUser } from "@/types";

export const INITIAL_USER = {  
  id:'',
  name: '',
  email: '',
  username: '',
  imageUrl: '',
  bio:''
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isAuthenticated: false,
  isLoading: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const checkAuthUser =  async () => {
    try {
      const currentAccount  = await getCurrentUser();

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        })

        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //localStorage.getItem('cookieFallback') === null

    if
     (
      localStorage.getItem('cookieFallback') === '[]' ||
      localStorage.getItem('cookieFallback') === null
      
    ) navigate('/sign-in');

    checkAuthUser();
    
  },[]);

  const value = {
    user,
    setUser,
    isAuthenticated,    
    setIsAuthenticated,
    isLoading,
    checkAuthUser
  }

return (
    <AuthContext.Provider value={value} >
      {children}
    </AuthContext.Provider> 
  )
}
export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);