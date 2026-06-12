import axiosInstance from "./axiosInstance.js";

export const saveFinancialProfile = async (profileData) => {
    const response = await axiosInstance.post('/financial-profile/me', profileData);
    return response.data;
};

export const getFinancialDiagnosis = async () => {
    const response = await axiosInstance.get('/financial-diagnosis/me');
    return response.data;
};
