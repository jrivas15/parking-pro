import axios from "axios";

const apiService = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL,
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default apiService;