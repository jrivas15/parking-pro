import apiService from "services/api.service";

interface LoginData {
    username: string;
    password: string;
}

export const login = async (data: LoginData) => {
    try {
    const response = await apiService.post('/users/login/', data);
    return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        return
    }
}