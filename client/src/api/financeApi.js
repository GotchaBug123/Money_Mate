import axiosInstance from './axiosInstance';

export const analyzePortfolio = async (data) => {
    const response = await axiosInstance.post('/portfolio/rebalance/analyze', data);
    return response.data;
};