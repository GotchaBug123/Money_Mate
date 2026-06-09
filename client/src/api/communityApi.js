import axiosInstance from "./axiosInstance.js";

export const getCommunityMainApi = async () => {
    const response = await axiosInstance.get('/community/main');
    return response.data;
};

export const getCommunityThemesApi = async () => {
    const response = await axiosInstance.get('/community/themes');
    return response.data;
};

export const getCommunityPostsApi = async (params) => {
    const response = await axiosInstance.get('/community/posts', {params});
    return response.data;
};

export const createCommunityPostApi = async (data) => {
    const response = await axiosInstance.post('/community/posts', data);
    return response.data;
};

export const updateCommunityPostApi = async (postId, data) => {
    const response = await axiosInstance.put(`/community/posts/${postId}`, data);
    return response.data;
};

export const deleteCommunityPostApi = async (postId) => {
    const response = await axiosInstance.delete(`/community/posts/${postId}`);
    return response.data;
};

export const likeCommunityPostApi = async (postId) => {
    const response = await axiosInstance.post(`/community/posts/${postId}/like`);
    return response.data;
};

export const unlikeCommunityPostApi = async (postId) => {
    const response = await axiosInstance.delete(`/community/posts/${postId}/like`);
    return response.data;
};

export const getCommunityCommentsApi = async (postId) => {
    const response = await axiosInstance.get(`/community/posts/${postId}/comments`);
    return response.data;
};

export const createCommunityCommentApi = async (postId, content) => {
    const response = await axiosInstance.post(`/community/posts/${postId}/comments`, {content});
    return response.data;
};

export const getMyPostsApi = async () => {
    const response = await axiosInstance.get('/community/my-posts');
    return response.data;
};
