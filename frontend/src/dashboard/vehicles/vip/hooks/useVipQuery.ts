import { useQuery } from "@tanstack/react-query";
import { getVips } from "../services/vip.service";

const useVipQuery = () => {
  const query = useQuery({
    queryKey: ["vips"],
    queryFn: getVips,
  });

  return { vips: query.data, isLoading: query.isLoading };
};

export default useVipQuery;
