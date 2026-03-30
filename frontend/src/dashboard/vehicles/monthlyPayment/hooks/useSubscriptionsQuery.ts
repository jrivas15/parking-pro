import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "../services/subscription.service";
import dayjs from "dayjs";

const useSubscriptionsQuery = () => {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const today = dayjs();
  const total = subscriptions?.length ?? 0;
  const active = subscriptions?.filter((s) => s.state === "active").length ?? 0;
  const expiringSoon = subscriptions?.filter((s) =>
    s.state === "active" && s.endDate &&
    dayjs(s.endDate).diff(today, "day") <= 7 && dayjs(s.endDate).diff(today, "day") >= 0
  ).length ?? 0;
  const expired = subscriptions?.filter((s) => s.state === "expired").length ?? 0;

  return { subscriptions, isLoading, stats: { total, active, expiringSoon, expired } };
};

export default useSubscriptionsQuery;
