import axios from "axios";

const apiService = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

export default apiService;