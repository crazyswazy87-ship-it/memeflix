import { bottombarLinks } from "@/constants";
import {Link, useLocation} from "react-router-dom";

const Bottombar = () => {
  const {pathname} = useLocation();

  return (
    <section className="bottom-bar">
      { bottombarLinks.map((link) => {
             const isActive = pathname === link.route;

              return (
                <li key={ link.label }
                  className={`bottombar-links group
                    ${isActive & 'bg-red-300'}`}
                  >
                  <Link
                    to = {link.route}
                    className= "mboka-nichi"//"flex gap-3 items-center p-4 bg-red"
                    >
                      <img 
                        src= {link.imgURL}
                        alt= {link.label}
                        className={`mboto ${isActive &&'bg-red-800'}`}
                      />
                      <span className="digz">{link.label}</span>

                  </Link>
                </li>
              )
          }) }
    </section>
  )
}

export default Bottombar