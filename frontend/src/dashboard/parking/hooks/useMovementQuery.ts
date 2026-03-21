import { useQuery } from '@tanstack/react-query'
import { getActiveMovements, getLastExitMovements, getPaymentValue } from '../services/movements.service'

interface UseMovementQueryProps {
  plate?: string
  tariff?: number
}


const useMovementQuery = ({plate, tariff}: UseMovementQueryProps) => {

    const movementQuery = useQuery({
        queryKey: ['movements'],
        refetchInterval: 1000 * 60, 
        queryFn: getActiveMovements
    })

    const movementPaymentQuery = useQuery({
        queryKey: ['paymentValue', plate, tariff ?? null],
        queryFn: () => getPaymentValue(plate, tariff ?? null),
        staleTime: 1000 * 30,
        enabled: !!plate
    })

    const lastExitMovementsQuery = useQuery({
        queryKey: ['lastExitMovements'],
        queryFn: getLastExitMovements,
        refetchInterval: 1000 * 5,
    })

  return {
    movementQuery,
    movementPaymentQuery,
    lastExitMovementsQuery
  }
}

export default useMovementQuery
