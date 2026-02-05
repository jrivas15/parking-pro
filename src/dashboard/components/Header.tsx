import BellNotification from "@/components/shared/BellNotification";

const Header = () => {
  return (
    <header className="flex items-center justify-end gap-6 bg-transparent py-4 px-8">
      {/* Notificación */}

      <BellNotification />

      {/* Usuario y turno */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="font-bold text-white text-lg leading-tight">
            Admin Usuario
          </span>
          <span className="text-zinc-400 text-sm leading-none">
            Turno: Mañana
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-300 to-orange-500 flex items-center justify-center shadow-inner">
          {/* Círculo de estado, puedes agregar animación si lo deseas */}
        </div>
      </div>
    </header>
  );
};

export default Header;
