import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../services/vehicles.service";

const useVehiclesQuery = () => {
  const { data: listVehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  return { listVehicles, isLoading };
};

export default useVehiclesQuery;
