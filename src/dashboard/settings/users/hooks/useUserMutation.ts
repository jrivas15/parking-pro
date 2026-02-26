import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sileo } from "sileo";
import { deleteUser, newUser, updateUser } from "../services/users.service";
import { UserFormData } from "../schemas/user.schema";

const useUserMutation = () => {
    const queryClient = useQueryClient();
    const newUserMutation = useMutation({
        mutationFn: newUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            sileo.success({title: "Usuarios", description: "Usuario creado exitosamente"});
        },
        onError: (error) => {
            sileo.error({title: "Usuarios", description: "Error al crear el usuario"});
        },
        
    })

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UserFormData }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            sileo.success({title: "Usuarios", description: "Usuario actualizado exitosamente"});
        }
    })

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            sileo.success({title: "Usuarios", description: "Usuario eliminado exitosamente"});
        }
    })

  return {
    newUserMutation,
    updateUserMutation,
    deleteUserMutation,
  }
}

export default useUserMutation
