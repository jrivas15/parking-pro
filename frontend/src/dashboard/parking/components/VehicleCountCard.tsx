import { Car, Bike, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VehicleCountCardProps {
  count: number;
  type: "Carros" | "Motos";
  icon?: LucideIcon;
}

const VehicleCountCard = ({ count, type, icon: Icon }: VehicleCountCardProps) => {
  const iconSize = 30;

  const getIcon = () => {
    if (Icon) return <Icon size={iconSize} />;
    
    switch (type) {
      case "Carros":
        return <Car size={iconSize} />;
      case "Motos":
        return <Bike size={iconSize} />;
      default:
        return <Car size={iconSize} />;
    }
  };

  const getLabel = () => {
    return type.toUpperCase();
  };

  return (
    <Card className="bg-background border-zinc-800 p-2 flex flex-col items-center justify-center gap-2 min-w-35">
      <div className="text-yellow-500">
        {getIcon()}
      </div>
      <div className="text-3xl font-bold text-white">
        {count}
      </div>
      <div className="text-zinc-400 text-sm font-medium tracking-wider">
        {getLabel()}
      </div>
    </Card>
  );
};

export default VehicleCountCard;
