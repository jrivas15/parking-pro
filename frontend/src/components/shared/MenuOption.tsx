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
    className="size-30 flex flex-col justify-center items-center bg-neutral-800 text-white hover:bg-amber-400 hover:text-black transition-colors duration-200 rounded-lg  "
    onClick={handleClick}>
      {icon && icon}
      {text}
    </button>
  );
};

export default MenuOption;