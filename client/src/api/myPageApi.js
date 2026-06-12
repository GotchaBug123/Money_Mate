import axiosInstance from "./axiosInstance.js";

export const getMyInfoApi = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
}

export const updateMyInfoApi = async (updateData) => {
    const response = await axiosInstance.put('/mypage/edit', updateData);
    return response.data;
}

export const getFinanceDiagnosisApi = async () => {
    const response = await axiosInstance.get('/financial-diagnosis/me');
    return response.data;
}

export const getFinancialProfileApi = async () => {
    const response = await axiosInstance.get('/financial-profile/me')
    return response.data;
}

export const getMyInvestmentApi = async () => {
    const response = await axiosInstance.get('/my-investment');
    return response.data;
}