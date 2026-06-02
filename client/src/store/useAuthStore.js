import {create} from 'zustand';
import {persist} from 'zustand/middleware';

// persist 미들웨어를 사용하면 새로고침해도 로그인 상태가 유지됩니다!
export const useAuthStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null, // 예: { id: 'bestevan01', name: '김수형', role: 'user', tier: 'Gold' }

            // 로그인 액션
            login: (userData) => set({
                isLoggedIn: true,
                user: userData
            }),

            // 로그아웃 액션
            logout: () => set({
                isLoggedIn: false,
                user: null
            }),

            // 유저 정보 업데이트 (마이페이지 등에서 사용)
            updateUser: (newData) => set((state) => ({
                user: {...state.user, ...newData}
            })),
        }),
        {
            name: 'auth-storage', // localStorage에 저장될 키 이름
        }
    )
);