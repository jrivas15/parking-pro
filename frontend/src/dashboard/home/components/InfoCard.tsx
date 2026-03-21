import { FC, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  value: string;
  trendValue?: string | number;
  trendColor?: string;
  additionalInfo?: string;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
}

const InfoCard: FC<InfoCardProps> = ({
  title,
  value,
  trendValue,
  trendColor = "text-green-500",
  additionalInfo,
  icon,
  iconBg = "bg-muted",
  iconColor = "text-muted-foreground",
}) => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground truncate">
              {title}
            </span>
            <span className="text-3xl font-bold leading-tight tracking-tight truncate">
              {value}
            </span>
          </div>
          {icon && (
            <div className={cn("shrink-0 rounded-xl p-2.5 mt-0.5", iconBg, iconColor)}>
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          {additionalInfo && (
            <p className="text-xs text-muted-foreground">{additionalInfo}</p>
          )}
          {trendValue && (
            <div className={cn("flex items-center gap-1 text-xs font-medium ml-auto", trendColor)}>
              <TrendingUp size={12} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
