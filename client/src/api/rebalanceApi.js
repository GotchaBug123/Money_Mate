import axiosInstance from "./axiosInstance.js";

export const searchAssetsApi = async (keyword, signal) => {
    const response = await axiosInstance.get('/market/assets/search', {
        params: {keyword},
        signal,
    });
    return response.data;
}

export const analyzeRebalanceApi = async (requestData) => {
    const response = await axiosInstance.post('/portfolio/rebalance/analyze', requestData);
    return response.data;
}