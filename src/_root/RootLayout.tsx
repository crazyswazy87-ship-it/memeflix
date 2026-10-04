//import Bottombar from '@/components/shared/Bottombar'
//import Dock from '@/components/shared/Dock'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Topbar from '@/components/shared/Topbar'
import { Outlet, useNavigate } from 'react-router-dom'

import home from "../../public/assetss/icons/home-smile-svgrepo-com (1).svg"
import memelords from "../../public/assetss/icons/users-group-rounded-svgrepo-com (1).svg"
import explore from "../../public/assetss/icons/slider-horizontal-1-svgrepo-com (1).svg"
import saved from "../../public/assetss/icons/archive-1-svgrepo-com (1).svg"
import publish from "../../public/assetss/icons/gallery-add-svgrepo-com.svg"
import { BottomNavBar } from '@/components/shared/BottomNavBar'
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'
import { useRealtimeNotifications } from '@/lib/react-query/useRealtimeNotifications'


export const RootLayout = () => {

  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUser();
  useRealtimeNotifications(currentUser?.$id);

  //dock
  const itemd = [
    { icon: home, label: 'Home', onClick: () => navigate('/')},
    { icon: memelords, label: 'Memelords', onClick: () => navigate('/all-users') },
    { icon: explore, label: 'Explore', onClick: () => navigate('/explore') },
    { icon: saved, label: 'Saved', onClick: () => navigate('/saved') },
    { icon: publish, label: 'Publish', onClick: () => navigate('/create-post') },
  ];

  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar/>

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      {/*Dock  
      <Dock 
          items={itemd}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />

      */}
       <BottomNavBar />
            
        
    
    </div>
  )
}
