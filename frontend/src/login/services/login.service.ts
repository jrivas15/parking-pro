import apiService from "services/api.service";

interface LoginData {
    username: string;
    password: string;
}

interface LoginResponse {
    message: string;
    token: string;
    user: {
        id: number;
        username: string;
        fullName: string;
        role: string;
    };
}


export const login = async (data: LoginData):Promise<LoginResponse | null> => {
    try {
    const response = await apiService.post('/users/login/', data);
    localStorage.setItem('authToken', response.data.token);
    return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        return
    }
}