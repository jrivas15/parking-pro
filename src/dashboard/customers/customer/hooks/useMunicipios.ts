

import { getMunicipios } from "../services/municipios.service"
import { useQuery } from '@tanstack/react-query'


const useMunicipios = () => {
  const municipioQuery = useQuery({
    queryKey: ['municipios'],
    queryFn: getMunicipios,
    staleTime: Infinity,
  })
  
    return {
    municipios : municipioQuery.data,
  }
}

export default useMunicipios
