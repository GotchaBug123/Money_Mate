import axiosInstance from "./axiosInstance.js";

export const getMarketIndexApi = async () => {
    const response = await axiosInstance.get('/market/index');
    return response.data;
}