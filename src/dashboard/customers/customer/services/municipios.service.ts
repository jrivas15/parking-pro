import apiService from "services/api.service";
import { MunicipioData } from "../types/municipios.type";


export const getMunicipios = async (): Promise<MunicipioData[]> => {
    const response = await apiService.get("/municipios/");
    return response.data;
}



