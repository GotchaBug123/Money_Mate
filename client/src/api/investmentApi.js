import axiosInstance from './axiosInstance';

export const getInvestmentInfoApi = async (market = 'ALL') => {
    const response = await axiosInstance.get('/investment-info', {
        params: {market}
    });
    return response.data;
};

export const getDividendTop6Api = async () => {
    const response = await axiosInstance.get('/dividend/top6');
    return response.data;
};