import {create} from 'zustand';

export const usePortfolioStore = create((set, get) => ({
    cart: [], // 담긴 주식 목록 { ticker, name, weight, ... }

    // 종목 추가
    addStock: (stock) => set((state) => {
        if (state.cart.find(s => s.ticker === stock.ticker)) return state;
        return {cart: [...state.cart, {...stock, weight: 0}]};
    }),

    // 종목 삭제
    removeStock: (ticker) => set((state) => ({
        cart: state.cart.filter(s => s.ticker !== ticker)
    })),

    // 비중 조절
    setWeight: (ticker, weight) => set((state) => ({
        cart: state.cart.map(s =>
            s.ticker === ticker ? {...s, weight: Number(weight)} : s
        )
    })),

    // 전체 비중 균등 분배
    distributeEqually: () => set((state) => {
        if (state.cart.length === 0) return state;
        const eq = Math.floor(100 / state.cart.length);
        const rem = 100 - (eq * state.cart.length);
        return {
            cart: state.cart.map((s, i) => ({
                ...s,
                weight: i === 0 ? eq + rem : eq
            }))
        };
    }),

    // 장바구니 초기화
    clearCart: () => set({cart: []}),

    // 총 비중 계산 (유틸 함수처럼 사용 가능)
    getTotalWeight: () => get().cart.reduce((sum, item) => sum + item.weight, 0),
}));