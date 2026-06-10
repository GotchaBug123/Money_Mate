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
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
}

export const findIdApi = async (name, email) => {
    const response = await axiosInstance.post('/auth/find-id', {
        name: name,
        email: email
    });
    return response.data;
}

export const resetPasswordApi = async (loginId, email, newPassword, newPasswordConfirm) => {
    const response = await axiosInstance.post('/auth/reset-password', {
        loginId: loginId,
        email: email,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm
    });
    return response.data;
}

export const checkLoginIdApi = async (loginId) => {
   const response = await axiosInstance.get('/auth/check-login-id', {
       params: { loginId }
   });
   return response.data;
};