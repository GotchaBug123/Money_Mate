import { TrendingUp, TrendingDown } from "lucide-react";

export function HoldingsPage() {
  // Mock data
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
    },
    {
      name: "네이버",
      code: "035420",
      quantity: 20,
      avgPrice: 182000,
      currentPrice: 189000,
      totalValue: 3780000,
      profit: 140000,
      profitRate: 3.85,
      trend: "up"
    }
  ];

  const totalValue = holdings.reduce((sum, item) => sum + item.totalValue, 0);
  const totalProfit = holdings.reduce((sum, item) => sum + item.profit, 0);
  const totalProfitRate = (totalProfit / (totalValue - totalProfit)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">보유 종목</h1>

        {/* 요약 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">총 평가금액</div>
            <div className="text-2xl font-bold text-gray-900">
              {totalValue.toLocaleString('ko-KR')}원
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">총 평가손익</div>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalProfit >= 0 ? "+" : ""}{totalProfit.toLocaleString('ko-KR')}원
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">총 수익률</div>
            <div className={`text-2xl font-bold ${totalProfitRate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalProfitRate >= 0 ? "+" : ""}{totalProfitRate.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* 보유 종목 리스트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">종목 상세</h3>
          <div className="space-y-4">
            {holdings.map((stock, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{stock.name}</h4>
                    <p className="text-sm text-gray-600">{stock.code}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {stock.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-xl font-bold text-gray-900">
                        {stock.currentPrice.toLocaleString('ko-KR')}원
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${stock.profitRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stock.profitRate >= 0 ? "+" : ""}{stock.profitRate}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">보유수량</div>
                    <div className="font-medium text-gray-900">{stock.quantity}주</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">평균단가</div>
                    <div className="font-medium text-gray-900">{stock.avgPrice.toLocaleString('ko-KR')}원</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">평가금액</div>
                    <div className="font-medium text-gray-900">{stock.totalValue.toLocaleString('ko-KR')}원</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">평가손익</div>
                    <div className={`font-medium ${stock.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stock.profit >= 0 ? "+" : ""}{stock.profit.toLocaleString('ko-KR')}원
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">수익률</div>
                    <div className={`font-medium ${stock.profitRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stock.profitRate >= 0 ? "+" : ""}{stock.profitRate}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
