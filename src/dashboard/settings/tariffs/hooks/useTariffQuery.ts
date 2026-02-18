import {
    useQuery
} from '@tanstack/react-query'
import { getTariffs } from '../services/tariff.service'


const useTariffQuery = () => {
    const { data } = useQuery({
        queryKey: ['tariffs'],
        queryFn: getTariffs,
        staleTime: 1000 * 60 * 60, // 1 hora
    })

    return {
        data
    }
}

export default useTariffQuery
