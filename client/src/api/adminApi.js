import axiosInstance from './axiosInstance.js';

// ── 대시보드 ───────────────────────────────────────────
export const getAdminDashboardApi = async () =>
    axiosInstance.get('/admin/dashboard').then(r => r.data);

// ── 회원 관리 ──────────────────────────────────────────
export const getAdminMembersApi = async () =>
    axiosInstance.get('/admin/members').then(r => r.data);

export const updateAdminMemberApi = async (memberId, data) =>
    axiosInstance.put(`/admin/members/${memberId}`, data).then(r => r.data);

export const deleteAdminMemberApi = async (memberId) =>
    axiosInstance.delete(`/admin/members/${memberId}`).then(r => r.data);

// ── 투자 관리 ──────────────────────────────────────────
export const getAdminInvestmentSummaryApi = async () =>
    axiosInstance.get('/admin/investment-info/summary').then(r => r.data);

export const getAdminInvestmentMembersApi = async (params) =>
    axiosInstance.get('/admin/investment-info/members', {params}).then(r => r.data);

export const getAdminAgeGroupStatsApi = async () =>
    axiosInstance.get('/admin/investment-info/stats/age-group').then(r => r.data);

// ── 커뮤니티 관리 ──────────────────────────────────────
export const getAdminPostsApi = async (params) =>
    axiosInstance.get('/admin/community/posts', {params}).then(r => r.data);


export const deleteAdminPostApi = async (postId) =>
    axiosInstance.delete(`/admin/community/posts/${postId}`).then(r => r.data);

// ── 고객 문의 관리 ─────────────────────────────────────
export const getAdminInquiriesApi = async () =>
    axiosInstance.get('/admin/inquiries').then(r => r.data);

export const answerAdminInquiryApi = async (inquiryId, answer) =>
    axiosInstance.post(`/admin/inquiries/${inquiryId}/answer`, {answer}).then(r => r.data);

export const deleteAdminInquiryApi = async (inquiryId) =>
    axiosInstance.delete(`/admin/inquiries/${inquiryId}`).then(r => r.data);
