import axiosInstance from "./axiosInstance.js";

export const getHoldingListApi = async () => {
    const response = await axiosInstance.get('/holding');
    return response.data;
};

export const addHoldingApi = async (holdingData) => {
    const response = await axiosInstance.post('/holding', holdingData);
    return response.data;
};

export const removeHoldingApi = async (holdingId) => {
    const response = await axiosInstance.delete(`/holding/${holdingId}`);
    return response.data;
};

export const getWatchlistApi = async () => {
    const response = await axiosInstance.get('/watchlist');
    return response.data;
};
