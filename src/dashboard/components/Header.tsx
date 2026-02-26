import BellNotification from "@/components/shared/BellNotification";
import useUsers from "../settings/users/hooks/useUsersQuery";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { logout } from "../settings/users/services/users.service";
import { sileo } from "sileo";

const Header = () => {
  const {profile} = useUsers()
  const nav = useNavigate();
  const handleLogOut = async () => {
    const logoutSuccess = await logout();
    if (logoutSuccess) {
      nav("/");
    } else {
      sileo.error({title:"Cerrar sesión", description:"Error al cerrar sesión. Por favor, inténtalo de nuevo."});
    }
  }

  return (
    <header className="flex items-center justify-between gap-6 bg-transparent py-3 px-6 ">
      <div>

      <BellNotification />
      </div>

      {/* Usuario y turno */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="font-bold text-white text-lg leading-tight">
            {profile?.username || "Usuario"}
          </span>
          <span className="text-zinc-400 text-sm leading-none">
           Ultimo login: {profile?.lastLogin ? dayjs(profile.lastLogin).format("DD/MM/YYYY HH:mm") : "Nombre completo"}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-300 to-orange-500 flex items-center justify-center shadow-inner text-2xl">
          {profile?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      <Button onClick={handleLogOut}><LogOut /></Button>
      </div>
    </header>
  );
};

export default Header;
