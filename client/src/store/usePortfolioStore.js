import {create} from 'zustand';
import {persist} from 'zustand/middleware';

// 기존 잘못된 데이터 정리 (한 번만 실행)
const stored = localStorage.getItem('portfolio-storage');
if (stored) {
    try {
        const parsed = JSON.parse(stored);
        const autoList = parsed?.state?.autoList ?? [];
        const hasInvalidData = autoList.some(p => Number(p.goalAmount) > 100000);
        if (hasInvalidData) {
            localStorage.removeItem('portfolio-storage');
        }
    } catch (e) {}
}

export const usePortfolioStore = create(
    persist(
        (set, get) => ({
            cart: [],
            autoList: [],
            directList: [],

            saveAutoPortfolio: (portfolio) => set((state) => ({
                autoList: [
                    {
                        ...portfolio,
                        id: Date.now(),
                        createdAt: new Date().toISOString().slice(0, 10),
                        goalAmount: Number(portfolio.goalAmount),
                        investAmount: Number(portfolio.investAmount),
                        avgReturnRate: Number(portfolio.avgReturnRate),
                        achievementRate: Number(portfolio.achievementRate),
                    },
                    ...state.autoList,
                ],
            })),

            saveDirectPortfolio: (portfolio) => set((state) => ({
                directList: [
                    {
                        ...portfolio,
                        id: Date.now(),
                        createdAt: new Date().toISOString().slice(0, 10),
                        goalAmount: Number(portfolio.goalAmount),
                        investAmount: Number(portfolio.investAmount),
                    },
                    ...state.directList,
                ],
            })),

            deleteAutoPortfolio: (id) => set((state) => ({
                autoList: state.autoList.filter(p => p.id !== id),
            })),

            deleteDirectPortfolio: (id) => set((state) => ({
                directList: state.directList.filter(p => p.id !== id),
            })),

            addStock: (stock) => set((state) => {
                if (state.cart.find(s => s.ticker === stock.ticker)) return state;
                return {cart: [...state.cart, {...stock, weight: 0}]};
            }),

            removeStock: (ticker) => set((state) => ({
                cart: state.cart.filter(s => s.ticker !== ticker)
            })),

            setWeight: (ticker, weight) => set((state) => ({
                cart: state.cart.map(s =>
                    s.ticker === ticker ? {...s, weight: Number(weight)} : s
                )
            })),

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

            clearCart: () => set({cart: []}),

            getTotalWeight: () => get().cart.reduce((sum, item) => sum + item.weight, 0),
        }),
        {
            name: 'portfolio-storage',
        }
    )
);