import axiosInstance from './axiosInstance';

export const getInvestmentInfoApi = async (market = 'ALL') => {
    const response = await axiosInstance.get('/investment-info', {
        params: {market}
    });
    return response.data;
};

export const getDividendTop6Api = async () => {
    const response = await axiosInstance.get('/dividend/top6');
    return response.data;
};

// 실시간 시장 지수 (코스피/코스닥/S&P500/달러환율) - sparkline 포함
export const getMarketIndexApi = async () => {
    const response = await axiosInstance.get('/market/index');
    return response.data;
};

// 주가 데이터 동기화 (최초 1회, 약 90초 소요)
export const syncStockDataApi = async () => {
    const response = await axiosInstance.get('/stock/sync', {timeout: 180000});
    return response.data;
};

// 배당 수익률 동기화 (syncStockDataApi 완료 후 실행, 약 90초 소요)
export const syncDividendDataApi = async () => {
    const response = await axiosInstance.get('/stock/sync-dividend', {timeout: 180000});
    return response.data;
};