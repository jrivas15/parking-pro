import apiService from "services/api.service";
import { parkingInfoSchema, ParkingInfoFormType } from "../schemas/parkingInfo.schema";


export const getParkingInfo = async ():Promise<ParkingInfoFormType> => {
    const response = await apiService.get('/parking-info');
    return parkingInfoSchema.parse(response.data[0]);
}

export const updateParkingInfo = async (data: ParkingInfoFormType) => {
    const response = await apiService.put(`/parking-info/${data.id}/`, data);
    return response.data;
}
