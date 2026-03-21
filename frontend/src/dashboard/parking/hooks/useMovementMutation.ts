import { useMutation, useQueryClient } from "@tanstack/react-query"
import { newMovement } from "../services/movements.service"
import { sileo } from "sileo"

const useMovementMutation = () => {
    const queryClient = useQueryClient()
    const newMovementMutation = useMutation({
        mutationFn: newMovement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['movements'] })
            sileo.success({title:"Ingreso", description:"Movimiento registrado correctamente."})
        },
        onError: (error: any) => {
            console.log(error)
            if (error?.response?.status !== 409) {
                sileo.error({title:"Ingreso", description:"Error al registrar movimiento."})
            }

        }
    })
  
    return { newMovementMutation }
}

export default useMovementMutation
