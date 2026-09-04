import { useState } from "react"

import home from "../../../public/assetss/icons/home-smile-svgrepo-com.svg"
import memelords from "../../../public/assetss/icons/users-group-rounded-svgrepo-com (2).svg"
import explore from "../../../public/assetss/icons/slider-horizontal-1-svgrepo-com.svg"
import saved from "../../../public/assetss/icons/archive-1-svgrepo-com (2).svg"
import publish from "../../../public/assetss/icons/gallery-add-svgrepo-com (1).svg"

/* ------------------------------------------------------------------ */
/* BottomNavBar                                                       */
/* ------------------------------------------------------------------ */

interface NavItem {
  id: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: home },
  { id: "memelords", label: "Memelords", icon: memelords },
  { id: "explore", label: "Explore", icon: explore },
  { id: "saved", label: "Saved", icon: saved },
  { id: "publish", label: "Publish", icon: publish },
]

interface BottomNavBarProps {
  defaultActive?: string
  onChange?: (id: string) => void
  className?: string
}

export function BottomNavBar({
  defaultActive = "home",
  onChange,
  className = "",
}: BottomNavBarProps) {
  const [active, setActive] = useState(defaultActive)

  const handleSelect = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <nav className={`navbottom ${className}`}>
      {NAV_ITEMS.map(({ id, label, icon }) => {
        const isActive = id === active

        return (
          <button
          key={id}
          type="button"
          aria-pressed={isActive}
          aria-label={label}
          onClick={() => handleSelect(id)}
          className= "ndanasu"
        >
          <img
            src={icon}
            alt={label}
            className="h-7 w-7 shrink-0 object-contain"
          />

          <span
            className={`text-sm font-medium transition-all duration-300 ${
              isActive
                ? "max-w-[80px] opacity-100 text-white-500"
                : "max-w-0 opacity-0 overflow-hidden text-white"
            }`}
          >
            {label}
          </span>
        </button>
        )
      })}
    </nav>
  )
}
