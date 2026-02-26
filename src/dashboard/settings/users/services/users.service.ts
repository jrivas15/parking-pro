import apiService from "services/api.service";
import { UserFormData } from "../schemas/user.schema";
import { User } from "../types/user.type";

export const getUsers = async ():Promise<User[]> => {
    const response = await apiService.get("/users/");
    return response.data;
}

export const newUser = async (userData: UserFormData): Promise<User> => {
    const response = await apiService.post("/users/", userData);
    return response.data;
}
export const updateUser = async (userId: number, userData: UserFormData) => {
    const response = await apiService.put(`/users/${userId}/`, userData);
    return response.data;
}

export const deleteUser = async (userId: number) => {
    const response = await apiService.delete(`/users/${userId}/`);
    return response.data;
}

export const getUserById = async (userId: string) => {
    const response = await apiService.get(`/users/${userId}/`);
    return response.data;
}

export const getProfile = async ():Promise<User> => {
    const response = await apiService.get("/users/me/");
    return response.data;
}

export const logout = async (): Promise<boolean> => {
    try {
        await apiService.get("/users/logout/");
        return true;
    } catch (error) {
        console.error("Logout failed", error);
        return false;
    }
} 