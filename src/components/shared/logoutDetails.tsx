"use client"

import logout from "../../../public/assetss/icons/logout-icon.png"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useUserContext } from "@/constants/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const LogoutDetails = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

 useEffect(() => {
  if (isSuccess) navigate(0);
}, [isSuccess, navigate]);

  return (
    <Drawer>

      <DrawerTrigger asChild>
        
          <Button variant = "ghost" className="logout-top"
            >
            <img 
              src={logout}
              alt="logout"
              className="log"
            />
            
          </Button>
        
      </DrawerTrigger>

      <DrawerContent className="p00p">
        <div className="p00p ">
          <DrawerHeader>
            <DrawerTitle className="desc-log">You're about to miss the next meme drop!</DrawerTitle>
            <DrawerDescription className="desc-l0g">Use this email when logging back to this account {user.email}</DrawerDescription>
          </DrawerHeader>
          
          <DrawerFooter>
            <Button
            onClick={() =>signOut()} 
            className="input2"
            >Logout</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="input2">Keep browsing</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default LogoutDetails

