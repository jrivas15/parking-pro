import { useNavigate } from "react-router-dom";

interface MenuOptionProps {
  route: string;
  text: string;
  icon?: React.ReactNode;
}

const MenuOption = ({ route, text, icon }: MenuOptionProps) => {
  const nav = useNavigate();
  
  return (
    <button 
    className="size-30 flex flex-col justify-center items-center bg-neutral-800 text-white hover:bg-amber-400 hover:text-black transition-colors duration-200 rounded-lg  "
    onClick={() => nav(route)}>
      {icon && icon}
      {text}
    </button>
  );
};

export default MenuOption;