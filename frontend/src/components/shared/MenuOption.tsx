import { useNavigate } from "react-router-dom";

interface MenuOptionProps {
  route?: string;
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const MenuOption = ({ route, text, icon, onClick }: MenuOptionProps) => {
  const nav = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else if (route) nav(route);
  };

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center justify-center gap-3 size-36 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 shadow-sm hover:shadow-primary/10 hover:shadow-md"
    >
      <div className="flex items-center justify-center size-12 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors duration-200 text-white/60 group-hover:text-primary">
        {icon}
      </div>
      <span className="text-xs font-medium text-center leading-tight px-2">
        {text}
      </span>
    </button>
  );
};

export default MenuOption;