import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPayments } from "../services/subscription.service";

const useSubscriptionPaymentsQuery = (subscriptionId: number | null) => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["subscriptionPayments", subscriptionId],
    queryFn: () => getSubscriptionPayments(subscriptionId!),
    enabled: subscriptionId !== null,
  });

  return { payments, isLoading };
};

export default useSubscriptionPaymentsQuery;
