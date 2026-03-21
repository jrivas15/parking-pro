import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ParkingInfoFormType } from "../schemas/parkingInfo.schema"
import { updateParkingInfo } from "../services/parkingInfo.service"
import { sileo } from "sileo";

const useParkingInfoMutation = () => {
    const queryClient = useQueryClient();
    
    const parkingInfoMutation = useMutation({
        mutationFn: (data: ParkingInfoFormType) => updateParkingInfo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parkingInfo'] });
            sileo.success({title: "Actualización", description: "Información del parqueadero actualizada exitosamente"});
        },
        onError: (error) => {
            sileo.error({title: "Actualización", description: "Error al actualizar la información del parqueadero"});
            // console.error(error);
        }

    })
  
    return {
        parkingInfoMutation
  }
}

export default useParkingInfoMutation
