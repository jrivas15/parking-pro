import { useQuery } from '@tanstack/react-query'
import { getActiveMovements, getLastExitMovements } from '@/dashboard/parking/services/movements.service'
import { getOpenSales } from '@/dashboard/tools/balance/services/sales.service'
import dayjs from 'dayjs'

const useHomeQuery = () => {
    const today = dayjs().format('YYYY-MM-DD')

    const activeMovementsQuery = useQuery({
        queryKey: ['movements'],
        queryFn: getActiveMovements,
        refetchInterval: 1000 * 30,
    })

    const lastExitsQuery = useQuery({
        queryKey: ['lastExitMovements'],
        queryFn: getLastExitMovements,
        refetchInterval: 1000 * 30,
    })

    const todaySalesQuery = useQuery({
        queryKey: ['todaySales', today],
        queryFn: () => getOpenSales({ dateFrom: today, dateTo: today }),
        refetchInterval: 1000 * 60,
    })

    return {
        activeMovementsQuery,
        lastExitsQuery,
        todaySalesQuery,
    }
}

export default useHomeQuery
