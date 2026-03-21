
const SummaryCard = ({
  label,
  value,
  sub,
  subIcon,
  subColor = "text-muted-foreground",
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  subIcon?: React.ReactNode;
  subColor?: string;
  highlight?: boolean;
}) => (
  <div
    className={`flex flex-col gap-1 p-4 rounded-xl border flex-1 min-w-0 ${
      highlight
        ? "bg-primary border-primary text-black"
        : "bg-card border-border"
    }`}
  >
    <span
      className={`text-xs font-semibold tracking-widest uppercase ${highlight ? "text-black/70" : "text-muted-foreground"}`}
    >
      {label}
    </span>
    <span
      className={`text-2xl font-bold leading-tight ${highlight ? "text-black" : ""}`}
    >
      {value}
    </span>
    {sub && (
      <span
        className={`text-xs flex items-center gap-1 ${highlight ? "text-black/60" : subColor}`}
      >
        {subIcon}
        {sub}
      </span>
    )}
  </div>
);

export default SummaryCard;