// 시장 데이터 API 서비스
// 실제 환경에서는 백엔드 API URL을 환경변수로 관리
import type { MarketSummary } from '../types/market';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * 모의 시장 데이터 생성 함수
 * 실제 환경에서는 백엔드 API 호출로 대체
 */
function generateMockMarketData(): MarketSummary {
  const generateRandomChange = (base: number, variance: number) => {
    const change = (Math.random() - 0.5) * variance;
    return {
      value: base + change,
      change: change,
      percent: (change / base) * 100
    };
  };

  const generateChartData = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 40) + 40);
  };

  // KOSPI 데이터
  const kospi = generateRandomChange(2645, 50);

  // USD/KRW 데이터
  const usdKrw = generateRandomChange(1328, 20);

  // NASDAQ 데이터
  const nasdaq = generateRandomChange(18475, 200);

  return {
    indices: [
      {
        name: 'KOSPI',
        code: 'KOSPI',
        currentPrice: Number(kospi.value.toFixed(2)),
        changeAmount: Number(kospi.change.toFixed(2)),
        changePercent: Number(kospi.percent.toFixed(1)),
        trend: kospi.change >= 0 ? 'up' : 'down',
        chartData: generateChartData(10)
      },
      {
        name: 'NASDAQ',
        code: 'NASDAQ',
        currentPrice: Number(nasdaq.value.toFixed(2)),
        changeAmount: Number(nasdaq.change.toFixed(2)),
        changePercent: Number(nasdaq.percent.toFixed(1)),
        trend: nasdaq.change >= 0 ? 'up' : 'down',
        chartData: generateChartData(10)
      }
    ],
    exchanges: [
      {
        name: 'USD/KRW',
        code: 'USDKRW',
        rate: Number(usdKrw.value.toFixed(2)),
        changeAmount: Number(usdKrw.change.toFixed(2)),
        changePercent: Number(usdKrw.percent.toFixed(1)),
        trend: usdKrw.change >= 0 ? 'up' : 'down',
        chartData: generateChartData(10)
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * 시장 요약 데이터 조회
 *
 * 실제 구현시:
 * - 백엔드 /api/market/summary 엔드포인트 호출
 * - 한국투자증권 API에서 받은 데이터를 반환
 */
export async function fetchMarketSummary(): Promise<MarketSummary> {
  try {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`${API_BASE_URL}/market/summary`);
    // if (!response.ok) throw new Error('Failed to fetch market data');
    // return await response.json();

    // 모의 데이터 반환 (개발용)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockMarketData());
      }, 500); // 네트워크 지연 시뮬레이션
    });
  } catch (error) {
    console.error('Market data fetch error:', error);
    throw error;
  }
}

/**
 * 지수 데이터 조회
 */
export async function fetchIndices() {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/market/index`);
    // return await response.json();

    const summary = await fetchMarketSummary();
    return summary.indices;
  } catch (error) {
    console.error('Indices fetch error:', error);
    throw error;
  }
}

/**
 * 환율 데이터 조회
 */
export async function fetchExchangeRates() {
  try {
    // TODO: 실제 API 호출
    // const response = await fetch(`${API_BASE_URL}/market/exchange`);
    // return await response.json();

    const summary = await fetchMarketSummary();
    return summary.exchanges;
  } catch (error) {
    console.error('Exchange rates fetch error:', error);
    throw error;
  }
}
