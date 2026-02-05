import { FC, ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string;
  trendValue?: string | number;
  trendColor?: string;
  additionalInfo?: string;
  icon?: ReactNode;
}

const InfoCard: FC<InfoCardProps> = ({
  title,
  value,
  trendValue,
  trendColor = "text-green-400",
  additionalInfo,
  icon,
}) => {
  return (
    <Card>
      <CardContent className=" ">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex space-x-3 items-end">
          <span className="text-5xl">{value}</span>
          {trendValue ? (
            <div className="flex space-x-1 items-center ">
              <TrendingUp size={15} className={trendColor}/>
              <span className={trendColor}>{trendValue ?? ""}</span>
            </div>
          ) : (
            0
          )}
        </div>
        {additionalInfo && <p className="text-sm text-muted-foreground">{additionalInfo}</p>}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
