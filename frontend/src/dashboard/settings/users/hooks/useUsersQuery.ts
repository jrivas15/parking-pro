import { useQuery } from "@tanstack/react-query"
import { getProfile, getUserById, getUsers } from "../services/users.service"

const useUsers = () => {
    
    const {data:listUsers} = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime: 1000 * 60 * 60 *8, // 8 horas
    })

    const { data:profile } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: 1000 * 60 * 60 *8, // 8 horas
    })
  
    return {
        listUsers,
        profile
    }
}

export default useUsers
