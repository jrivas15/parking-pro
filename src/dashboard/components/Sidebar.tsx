import {
  LayoutDashboard,
  SquareParking,
  DollarSign,
  BarChart3,
  Settings,
  icons,
  HammerIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/parking", icon: SquareParking, label: "Parking" },
    { path: "/tools", icon: HammerIcon, label: "Herramientas" },
    { path: "/administracion", icon: DollarSign, label: "Tarifas" },
    { path: "/reportes", icon: BarChart3, label: "Reportes" },
    { path: "/settings", icon: Settings, label: "Configuración" },
  ];

  return (
    <nav className="bg-sidebar py-2 px-4">
      <div className="flex p-1 my-6 gap-2 items-center">
        <div className="bg-primary size-10 rounded-xl flex items-center justify-center text-white font-bold text-3xl">
          P
        </div>
        <div className="flex flex-col">
          <span>
            PARKING <span className="text-primary">PRO</span>
          </span>
          <span className="text-[9pt] text-muted-foreground">V.1.0</span>
        </div>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 p-2 rounded-xl my-1 transition-all duration-300 border-l-2 border-transparent ${isActive ? "bg-primary/20 text-primary border-l-primary" : "text-gray-400 hover:bg-primary/20 hover:text-primary "}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;
