import axiosInstance from './axiosInstance';

export const getCustomerCenterMain = async () => {
    const response = await axiosInstance.get('/customer-center');
    return response.data;
};

export const getMyInquiryList = async () => {
    const response = await axiosInstance.get('/customer-center/inquiries/me');
    return response.data;
};

export const getFaqList = async () => {
    const response = await axiosInstance.get('/customer-center/faqs');
    return response.data;
};

export const getInquiryCategories = async () => {
    const response = await axiosInstance.get('/customer-center/categories');
    return response.data;
};

export const createInquiry = async (data) => {
    const response = await axiosInstance.post('/customer-center/inquiries', data);
    return response.data;
};