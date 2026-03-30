import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../services/customer.service";

const useCustomersQuery = () => {
  const { data: listCustomers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return { listCustomers, isLoading };
};

export default useCustomersQuery;
