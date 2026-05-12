import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export function AssetSummaryPage() {
  // Mock data
  const assetSummary = {
    totalAssets: 15750000,
    totalInvestment: 15000000,
    totalProfit: 750000,
    profitRate: 5.0,
    breakdown: [
      { category: "국내 주식", amount: 5500000, profit: 275000, profitRate: 5.0, trend: "up" },
      { category: "해외 주식", amount: 4000000, profit: 320000, profitRate: 8.0, trend: "up" },
      { category: "채권", amount: 4500000, profit: 135000, profitRate: 3.0, trend: "up" },
      { category: "현금성 자산", amount: 1750000, profit: 20000, profitRate: 1.14, trend: "up" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">자산 요약</h1>

        {/* 총 자산 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-8 h-8" />
            <h3 className="text-xl font-bold">총 자산</h3>
          </div>
          <div className="text-4xl font-bold mb-2">
            {assetSummary.totalAssets.toLocaleString('ko-KR')}원
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <TrendingUp className="w-5 h-5" />
            <span className="text-lg font-medium">
              +{assetSummary.totalProfit.toLocaleString('ko-KR')}원 ({assetSummary.profitRate}%)
            </span>
          </div>
        </div>

        {/* 투자 원금 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">투자 원금</div>
            <div className="text-2xl font-bold text-gray-900">
              {assetSummary.totalInvestment.toLocaleString('ko-KR')}원
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">평가 수익</div>
            <div className="text-2xl font-bold text-green-600">
              +{assetSummary.totalProfit.toLocaleString('ko-KR')}원
            </div>
          </div>
        </div>

        {/* 자산 상세 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">자산 분류별 상세</h3>
          <div className="space-y-4">
            {assetSummary.breakdown.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{item.category}</h4>
                  <div className="flex items-center gap-2">
                    {item.trend === "up" ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-bold ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {item.profitRate >= 0 ? "+" : ""}{item.profitRate}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">평가금액</div>
                    <div className="text-lg font-bold text-gray-900">
                      {item.amount.toLocaleString('ko-KR')}원
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">평가손익</div>
                    <div className={`text-lg font-bold ${item.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.profit >= 0 ? "+" : ""}{item.profit.toLocaleString('ko-KR')}원
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">수익률</div>
                    <div className={`text-lg font-bold ${item.profitRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.profitRate >= 0 ? "+" : ""}{item.profitRate}%
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
