import axiosInstance from "./axiosInstance.js";

export const loginApi = async (loginId, password) => {
    const response = await axiosInstance.post('/auth/login', {
        loginId: loginId,
        password: password
    });
    return response.data;
};

export const signupApi = async (userData) => {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
}

export const logoutApi = async () => {
    const response = await axiosInstance.get('/auth/logout');
    return response.data;
}

export const findIdApi = async (name, email) => {
    const response = await axiosInstance.post('/auth/find-id', {
        name: name,
        email: email
    });
    return response.data;
}