import React, {useState} from 'react';

export const LOGO_MAP = {
    // 국내
    '005930': 'samsung.com',
    '000660': 'skhynix.com',
    '005380': 'hyundai.com',
    '000270': 'kia.com',
    '005490': 'posco.com',
    '066570': 'lg.com',
    '035720': 'kakao.com',
    '035420': 'naver.com',
    '068270': 'celltrion.com',
    '017670': 'sktelecom.com',
    '030200': 'kt.com',
    '034020': 'doosan.com',
    '259960': 'krafton.com',
    '323410': 'kakaobank.com',
    '036570': 'ncsoft.com',
    '373220': 'lgensol.com',
    '360750': 'tigeretf.com',
    // 해외 대형주
    'NVDA': 'nvidia.com', 'AAPL': 'apple.com', 'MSFT': 'microsoft.com',
    'GOOGL': 'google.com', 'GOOG': 'google.com', 'AMZN': 'amazon.com',
    'META': 'meta.com', 'TSLA': 'tesla.com', 'TSM': 'tsmc.com',
    'MU': 'micron.com', 'AMD': 'amd.com', 'INTC': 'intel.com',
    'AVGO': 'broadcom.com', 'QCOM': 'qualcomm.com', 'ASML': 'asml.com',
    'JPM': 'jpmorganchase.com', 'BAC': 'bankofamerica.com',
    'V': 'visa.com', 'MA': 'mastercard.com', 'WMT': 'walmart.com',
    'JNJ': 'jnj.com', 'PFE': 'pfizer.com',
    'XOM': 'exxonmobil.com', 'CVX': 'chevron.com', 'NKE': 'nike.com',
    'DIS': 'disney.com', 'NFLX': 'netflix.com', 'SBUX': 'starbucks.com',
    'COST': 'costco.com', 'HD': 'homedepot.com',
    'PLTR': 'palantir.com', 'SPOT': 'spotify.com',
    'COIN': 'coinbase.com', 'RIVN': 'rivian.com',
    // ETF
    'SPY': 'ssga.com', 'QQQ': 'invesco.com', 'VOO': 'vanguard.com',
    'VTI': 'vanguard.com', 'SCHD': 'schwab.com', 'TLT': 'ishares.com',
    '069500': 'kodex.com',
};

const BADGE_COLORS = ['#E8F0FE', '#EDFAF4', '#FFF0EE', '#FAEEDA', '#F0F4FF', '#FEF0F8', '#EEF8FF', '#F5F0FF'];
const BADGE_TEXT   = ['#1B5ED9', '#1A7A45', '#C0392B', '#B47D0C', '#2E5CD9', '#C03980', '#0C7CD9', '#7B3FA0'];

export const getBadge = (ticker) => {
    if (!ticker) return {bg: BADGE_COLORS[0], color: BADGE_TEXT[0]};
    const idx = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % BADGE_COLORS.length;
    return {bg: BADGE_COLORS[idx], color: BADGE_TEXT[idx]};
};

const StockLogo = ({ticker, name, size = 36}) => {
    const [failed, setFailed] = useState(false);
    const domain = LOGO_MAP[ticker];
    const badge = getBadge(ticker);

    if (!domain || failed) {
        return (
            <div style={{
                width: size, height: size,
                background: badge.bg, color: badge.color,
                fontSize: size * 0.35, fontWeight: 700,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                {name ? name.charAt(0) : '?'}
            </div>
        );
    }

    return (
        <img
            style={{width: size, height: size, borderRadius: '50%', objectFit: 'contain', flexShrink: 0}}
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt={name}
            onError={() => setFailed(true)}
        />
    );
};

export default StockLogo;
