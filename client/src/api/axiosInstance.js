import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 5000,
    withCredentials: true,
});

// (선택 사항) 요청이나 응답을 가로채서 토큰을 넣거나 에러를 공통 처리할 수도 있습니다.
axiosInstance.interceptors.request.use((config) => {
    // 예: const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosInstance;