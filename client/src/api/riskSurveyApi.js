import axiosInstance from "./axiosInstance.js";

export const submitRiskSurveyApi = async (surveyData) => {
    const response = await axiosInstance.post('/risk-survey', surveyData);
    return response.data;
};

export const saveRiskProfileApi = async (totalScore) => {
    const response = await axiosInstance.post('/risk-profile', {totalScore});
    return response.data;
};

export const getLatestRiskSurveyApi = async () => {
    const response = await axiosInstance.get('/risk-survey/latest');
    return response.data;
};
