import { Bike, Car, Motorbike } from 'lucide-react';

const VehicleIcon = ({ type }: { type: string }) => {
  const typeIcon = () => {
        switch (type) {
          case "C":
            return <Car className="size-5" />;
          case "M":
            return <Motorbike className="size-5" />;
          case "B":
            return <Bike className="size-5" />;
          default:
            return <span className="text-muted-foreground">{type}</span>;
        }
      };

      return (
        <div className="flex items-center justify-center ">{typeIcon()}</div>
      );
}

export default VehicleIcon
