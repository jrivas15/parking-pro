import { useQuery } from "@tanstack/react-query"
import { getOpenSales, SalesFilters } from "../services/sales.service"

const useSalesQuery = (filters: SalesFilters) => {
    const openSalesQuery = useQuery({
      queryKey: ['sales', 'open', filters],
      queryFn: () => getOpenSales(filters),
      enabled: !!filters.userID,
    })

    return {
      openSalesQuery
  }
}

export default useSalesQuery
