import apiService from "services/api.service";
import { Movement, MovementLike, PaymentData } from "../types/movements.type";



export const getActiveMovements = async ():Promise<Movement[]> => {
    const response = await apiService.get("/movements/active_plates/");
    return response.data;
}

export const getPaymentValue = async (plate: string, tariffID: number | null): Promise<PaymentData> => {
    const response = await apiService.get(`/movements/calc_payment_value/?plate=${plate}&tariffID=${tariffID}`);
    return response.data;
}

export const newMovement = async (data: MovementLike) => {
    const response = await apiService.post("/movements/new_movement/", data);
    return response.data;

}

export const getLastExitMovements = async (): Promise<Movement[]> => {
    const response = await apiService.get("/movements/last_exit_movements/");
    return response.data;
}

export const updatePlate = async ({ plate, newPlate }: { plate: string; newPlate: string }): Promise<Movement> => {
    const response = await apiService.patch(`/movements/update_plate/`, { plate, newPlate });
    return response.data;
}