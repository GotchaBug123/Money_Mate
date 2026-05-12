// 시장 데이터 타입 정의

export interface MarketIndex {
  name: string;
  code: string;
  currentPrice: number;
  changeAmount: number;
  changePercent: number;
  trend: 'up' | 'down';
  chartData: number[];
}

export interface ExchangeRate {
  name: string;
  code: string;
  rate: number;
  changeAmount: number;
  changePercent: number;
  trend: 'up' | 'down';
  chartData: number[];
}

export interface MarketSummary {
  indices: MarketIndex[];
  exchanges: ExchangeRate[];
  lastUpdated: string;
}
