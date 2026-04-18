import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../services/customer.service";

const useCustomersQuery = (enabled = true) => {
  const { data: listCustomers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled,
  });

  return { listCustomers, isLoading };
};

export default useCustomersQuery;
