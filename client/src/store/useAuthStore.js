import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,

            // 로그인 모달 상태 (localStorage에 저장하지 않음 — partialize로 제외)
            loginModalOpen: false,
            loginRedirectTo: '/',

            login: (userData) => set({isLoggedIn: true, user: userData}),
            logout: () => set({isLoggedIn: false, user: null}),
            updateUser: (newData) => set((state) => ({user: {...state.user, ...newData}})),

            openLoginModal: (redirectTo = '/') => set({loginModalOpen: true, loginRedirectTo: redirectTo}),
            closeLoginModal: () => set({loginModalOpen: false, loginRedirectTo: '/'}),
        }),
        {
            name: 'auth-storage',
            // 모달 관련 상태는 새로고침 후에도 열려있으면 안 되므로 제외
            partialize: (state) => ({isLoggedIn: state.isLoggedIn, user: state.user}),
        }
    )
);