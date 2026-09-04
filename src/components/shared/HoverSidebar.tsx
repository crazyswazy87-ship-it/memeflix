import { useState } from "react";
import {
  Home,
  Grid2X2,
  Shirt,
  Star,
  Heart,
  Settings,
} from "lucide-react";
import "./HoverSidebar.css";

const items = [
  { icon: Home, label: "Home" },
  { icon: Grid2X2, label: "Categories" },
  { icon: Shirt, label: "New Arrivals" },
  { icon: Star, label: "Featured" },
  { icon: Heart, label: "Wishlist" },
  { icon: Settings, label: "Settings" },
];

export default function HoverSidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="logo">
        <span>W</span>
        {expanded && <h2>WOLFGANG</h2>}
      </div>

      <nav>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button key={item.label} className="nav-item">
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}