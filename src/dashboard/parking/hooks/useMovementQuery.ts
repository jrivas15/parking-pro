import { useQuery } from '@tanstack/react-query'
import { getActiveMovements, getPaymentValue } from '../services/movements.service'

interface UseMovementQueryProps {
   plate?: string
}


const useMovementQuery = ({plate}: UseMovementQueryProps) => {

    const movementQuery = useQuery({
        queryKey: ['movements'],
        refetchInterval: 1000 * 60, 
        queryFn: getActiveMovements
    })

    const movementPaymentQuery = useQuery({
        queryKey: ['paymentValue', plate],
        queryFn: () => getPaymentValue(plate, null),
        staleTime: 1000 * 30,
        enabled: !!plate
    })

  return {
    movementQuery,
    movementPaymentQuery
  }
}

export default useMovementQuery
