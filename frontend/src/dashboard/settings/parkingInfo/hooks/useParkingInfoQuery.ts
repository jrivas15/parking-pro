import { useQuery } from "@tanstack/react-query"
import { getParkingInfo } from "../services/parkingInfo.service"

const useParkingInfoQuery = () => {
  const parkingInfoQuery = useQuery({
    queryKey: ['parkingInfo'],
    queryFn: getParkingInfo,
    staleTime: 1000 * 60 * 60 * 8, // 8 hours
  })

  return {
    parkingInfoQuery
  }
}

export default useParkingInfoQuery
