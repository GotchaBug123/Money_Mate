// 사용자 이메일 기반으로 일관된 랜덤 데이터 생성

// 문자열을 숫자 시드로 변환
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// 시드 기반 랜덤 생성기
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  integer(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

// 사용자별 자산 데이터 생성
export function generateUserAssets(email: string) {
  const seed = stringToSeed(email);
  const rng = new SeededRandom(seed);

  const stockValue = rng.integer(10000000, 30000000);
  const bondValue = rng.integer(5000000, 15000000);
  const fundValue = rng.integer(3000000, 10000000);
  const depositValue = rng.integer(2000000, 8000000);

  const stockChange = rng.range(-10, 15);
  const bondChange = rng.range(-3, 5);
  const fundChange = rng.range(-8, 12);
  const depositChange = rng.range(0, 3);

  return [
    { name: "주식", value: stockValue, change: stockChange, color: "#1D6AE5" },
    { name: "채권", value: bondValue, change: bondChange, color: "#00C896" },
    { name: "펀드", value: fundValue, change: fundChange, color: "#F59E0B" },
    { name: "예금", value: depositValue, change: depositChange, color: "#8B5CF6" },
  ];
}

// 사용자별 보유 종목 데이터 생성
export function generateUserHoldings(email: string) {
  const seed = stringToSeed(email);
  const rng = new SeededRandom(seed);

  const stocks = [
    "삼성전자", "SK하이닉스", "NAVER", "카카오", "LG에너지솔루션",
    "현대차", "기아", "삼성바이오로직스", "셀트리온", "POSCO홀딩스"
  ];

  const numHoldings = rng.integer(3, 7);
  const selectedStocks = [];
  const usedIndices = new Set<number>();

  while (selectedStocks.length < numHoldings) {
    const idx = rng.integer(0, stocks.length - 1);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      const quantity = rng.integer(10, 100);
      const avgPrice = rng.integer(30000, 200000);
      const currentPrice = avgPrice + rng.integer(-50000, 50000);
      const profitLoss = ((currentPrice - avgPrice) / avgPrice) * 100;

      selectedStocks.push({
        name: stocks[idx],
        quantity,
        avgPrice,
        currentPrice,
        totalValue: currentPrice * quantity,
        profitLoss: Number(profitLoss.toFixed(2))
      });
    }
  }

  return selectedStocks;
}

// 사용자별 투자성향 생성
export function generateUserInvestmentProfile(email: string) {
  const seed = stringToSeed(email);
  const rng = new SeededRandom(seed);

  const profiles = [
    { type: "안정형", description: "위험을 최소화하고 안정적인 수익 추구", stocks: 20, bonds: 50, funds: 20, cash: 10 },
    { type: "안정추구형", description: "낮은 위험과 적정 수익의 균형", stocks: 30, bonds: 40, funds: 20, cash: 10 },
    { type: "위험중립형", description: "적정 위험을 감수하며 수익 추구", stocks: 45, bonds: 30, funds: 20, cash: 5 },
    { type: "적극투자형", description: "높은 수익을 위해 위험 감수", stocks: 60, bonds: 20, funds: 15, cash: 5 },
    { type: "공격투자형", description: "높은 위험을 감수하며 최대 수익 추구", stocks: 75, bonds: 10, funds: 10, cash: 5 }
  ];

  const profileIndex = rng.integer(0, profiles.length - 1);
  return profiles[profileIndex];
}

// 사용자별 관심종목 생성
export function generateUserFavoriteStock(email: string) {
  const seed = stringToSeed(email);
  const rng = new SeededRandom(seed);

  const stocks = [
    { name: "삼성전자", basePrice: 70000 },
    { name: "SK하이닉스", basePrice: 130000 },
    { name: "NAVER", basePrice: 180000 },
    { name: "카카오", basePrice: 45000 },
    { name: "LG에너지솔루션", basePrice: 420000 },
    { name: "현대차", basePrice: 210000 },
    { name: "기아", basePrice: 95000 },
    { name: "삼성바이오로직스", basePrice: 860000 },
  ];

  const idx = rng.integer(0, stocks.length - 1);
  const stock = stocks[idx];
  const currentPrice = stock.basePrice + rng.integer(-20000, 30000);
  const yesterdayPrice = currentPrice - rng.integer(-10000, 10000);
  const change = currentPrice - yesterdayPrice;
  const changePercent = ((change / yesterdayPrice) * 100).toFixed(1);

  return {
    name: stock.name,
    currentPrice,
    change,
    changePercent: Number(changePercent),
    yesterdayPrice
  };
}

// 사용자별 관심 종목 리스트 생성
export function generateUserWatchlist(email: string) {
  const seed = stringToSeed(email);
  const rng = new SeededRandom(seed);

  // 투자 성향별 종목 그룹
  const stockGroups = {
    tech: [
      { name: "삼성전자", basePrice: 70000, sector: "반도체" },
      { name: "SK하이닉스", basePrice: 130000, sector: "반도체" },
      { name: "NAVER", basePrice: 180000, sector: "IT" },
      { name: "카카오", basePrice: 45000, sector: "IT" },
    ],
    dividend: [
      { name: "KB금융", basePrice: 65000, sector: "금융" },
      { name: "신한지주", basePrice: 42000, sector: "금융" },
      { name: "KODEX 200", basePrice: 38000, sector: "ETF" },
      { name: "삼성우", basePrice: 58000, sector: "우선주" },
    ],
    bio: [
      { name: "삼성바이오로직스", basePrice: 860000, sector: "바이오" },
      { name: "셀트리온", basePrice: 180000, sector: "바이오" },
      { name: "SK바이오팜", basePrice: 95000, sector: "제약" },
      { name: "유한양행", basePrice: 72000, sector: "제약" },
    ],
    growth: [
      { name: "LG에너지솔루션", basePrice: 420000, sector: "배터리" },
      { name: "현대차", basePrice: 210000, sector: "자동차" },
      { name: "기아", basePrice: 95000, sector: "자동차" },
      { name: "포스코홀딩스", basePrice: 380000, sector: "철강" },
    ]
  };

  // 사용자별 투자 성향 결정 (시드 기반)
  const profileType = rng.integer(0, 3);
  let selectedGroup;

  if (profileType === 0) {
    selectedGroup = stockGroups.tech; // 반도체/IT 중심
  } else if (profileType === 1) {
    selectedGroup = stockGroups.dividend; // 배당/금융 중심
  } else if (profileType === 2) {
    selectedGroup = stockGroups.bio; // 바이오/헬스케어 중심
  } else {
    selectedGroup = stockGroups.growth; // 성장주 중심
  }

  // 2~4개의 관심 종목 선택
  const numStocks = rng.integer(2, 4);
  const watchlist = [];

  for (let i = 0; i < numStocks; i++) {
    const stock = selectedGroup[i];
    const currentPrice = stock.basePrice + rng.integer(-stock.basePrice * 0.15, stock.basePrice * 0.15);
    const yesterdayPrice = currentPrice - rng.integer(-currentPrice * 0.05, currentPrice * 0.05);
    const change = currentPrice - yesterdayPrice;
    const changePercent = ((change / yesterdayPrice) * 100).toFixed(1);

    watchlist.push({
      name: stock.name,
      sector: stock.sector,
      currentPrice: Math.round(currentPrice),
      change: Math.round(change),
      changePercent: Number(changePercent),
      yesterdayPrice: Math.round(yesterdayPrice)
    });
  }

  return watchlist;
}
