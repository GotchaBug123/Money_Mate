import { TrendingUp, TrendingDown, Star, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useStocks, StockData } from "../context/StockContext";

export function InvestmentPage() {
  const { stocks, favorites, toggleFavorite, isFavorite, getStock } = useStocks();
  const [showStockList, setShowStockList] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);

  // Mock data - 보유 종목
  const holdings = [
    {
      name: "삼성전자",
      code: "005930",
      quantity: 50,
      avgPrice: 71000,
      currentPrice: 73500,
      totalValue: 3675000,
      profit: 125000,
      profitRate: 3.52,
      trend: "up"
    },
    {
      name: "TIGER 미국S&P500",
      code: "360750",
      quantity: 100,
      avgPrice: 15200,
      currentPrice: 16100,
      totalValue: 1610000,
      profit: 90000,
      profitRate: 5.92,
      trend: "up"
    },
    {
      name: "카카오",
      code: "035720",
      quantity: 30,
      avgPrice: 52000,
      currentPrice: 48500,
      totalValue: 1455000,
      profit: -105000,
      profitRate: -6.73,
      trend: "down"
    },
    {
      name: "KODEX 200",
      code: "069500",
      quantity: 150,
      avgPrice: 38500,
      currentPrice: 39200,
      totalValue: 5880000,
      profit: 105000,
      profitRate: 1.82,
      trend: "up"
    }
  ];

  const totalValue = holdings.reduce((sum, item) => sum + item.totalValue, 0);
  const totalProfit = holdings.reduce((sum, item) => sum + item.profit, 0);
  const totalProfitRate = (totalProfit / (totalValue - totalProfit)) * 100;

  // Mock data - 수익률
  const returnsData = {
    daily: { amount: 15000, rate: 0.10 },
    weekly: { amount: 85000, rate: 0.60 },
    monthly: { amount: 325000, rate: 2.30 },
    yearly: { amount: 755000, rate: 5.32 }
  };

  // 즐겨찾기 목록
  const favoriteStocks = useMemo(() => {
    return Array.from(favorites).map(id => getStock(id)).filter((s): s is StockData => s !== undefined);
  }, [favorites, getStock]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">투자</h1>

        {/* 총 수익률 카드 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-lg font-bold">총 수익률</h3>
              </div>
              <div className="text-4xl font-bold mb-1">
                +{totalProfitRate.toFixed(2)}%
              </div>
              <div className="text-lg text-green-100">
                +{totalProfit.toLocaleString('ko-KR')}원
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100 mb-1">총 평가금액</div>
              <div className="text-2xl font-bold">{totalValue.toLocaleString('ko-KR')}원</div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 - 2열 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 보유 종목 (2칸) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">보유 종목</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">종목명</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600">수량</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600">평균단가</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600">현재가</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600">평가손익</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-600">수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((stock, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-semibold text-gray-900 text-sm">{stock.name}</div>
                        <div className="text-xs text-gray-500">{stock.code}</div>
                      </td>
                      <td className="text-right py-3 px-2 text-sm text-gray-900">{stock.quantity}주</td>
                      <td className="text-right py-3 px-2 text-sm text-gray-900">{stock.avgPrice.toLocaleString()}원</td>
                      <td className="text-right py-3 px-2">
                        <div className="text-sm font-semibold text-gray-900">{stock.currentPrice.toLocaleString()}원</div>
                      </td>
                      <td className="text-right py-3 px-2">
                        <div className={`text-sm font-semibold ${stock.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {stock.profit >= 0 ? "+" : ""}{stock.profit.toLocaleString()}원
                        </div>
                      </td>
                      <td className="text-right py-3 px-2">
                        <div className="flex items-center justify-end gap-1">
                          {stock.profitRate >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-semibold ${stock.profitRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {stock.profitRate >= 0 ? "+" : ""}{stock.profitRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 오른쪽: 즐겨찾기 & 기간별 수익률 (1칸) */}
          <div className="space-y-6">
            {/* 즐겨찾기 종목 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  즐겨찾기
                </h3>
                <button
                  onClick={() => setShowStockList(true)}
                  className="w-6 h-6 border-2 border-blue-600 text-blue-600 rounded flex items-center justify-center hover:bg-blue-50 transition-colors"
                  title="종목 추가"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {favoriteStocks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">즐겨찾기한 종목이 없습니다</p>
                  </div>
                ) : (
                  favoriteStocks.slice(0, 5).map((stock) => (
                    <div
                      key={stock.id}
                      className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedStock(stock)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-xs truncate">
                          {stock.name}
                        </div>
                        <div className="text-xs text-gray-500">{stock.code}</div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-xs font-semibold text-gray-900">
                          {stock.currentPrice.toLocaleString()}원
                        </div>
                        <div
                          className={`text-xs font-medium ${
                            stock.changePercent >= 0 ? "text-red-600" : "text-blue-600"
                          }`}
                        >
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent}%
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(stock.id);
                        }}
                        className="ml-2 p-1 hover:bg-gray-100 rounded"
                      >
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 기간별 수익률 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">기간별 수익률</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">일간</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${returnsData.daily.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.daily.rate >= 0 ? "+" : ""}{returnsData.daily.rate}%
                    </div>
                    <div className={`text-xs ${returnsData.daily.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.daily.amount >= 0 ? "+" : ""}{returnsData.daily.amount.toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">주간</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${returnsData.weekly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.weekly.rate >= 0 ? "+" : ""}{returnsData.weekly.rate}%
                    </div>
                    <div className={`text-xs ${returnsData.weekly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.weekly.amount >= 0 ? "+" : ""}{returnsData.weekly.amount.toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">월간</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${returnsData.monthly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.monthly.rate >= 0 ? "+" : ""}{returnsData.monthly.rate}%
                    </div>
                    <div className={`text-xs ${returnsData.monthly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.monthly.amount >= 0 ? "+" : ""}{returnsData.monthly.amount.toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">연간</span>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${returnsData.yearly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.yearly.rate >= 0 ? "+" : ""}{returnsData.yearly.rate}%
                    </div>
                    <div className={`text-xs ${returnsData.yearly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {returnsData.yearly.amount >= 0 ? "+" : ""}{returnsData.yearly.amount.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
