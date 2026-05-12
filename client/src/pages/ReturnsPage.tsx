import { TrendingUp, Calendar } from "lucide-react";

export function ReturnsPage() {
  // Mock data
  const returnsData = {
    total: {
      amount: 755000,
      rate: 5.32
    },
    daily: { amount: 15000, rate: 0.10 },
    weekly: { amount: 85000, rate: 0.60 },
    monthly: { amount: 325000, rate: 2.30 },
    yearly: { amount: 755000, rate: 5.32 },
    history: [
      { period: "2026년 4월", amount: 325000, rate: 2.30 },
      { period: "2026년 3월", amount: 285000, rate: 2.05 },
      { period: "2026년 2월", amount: 145000, rate: 1.05 },
      { period: "2026년 1월", amount: -50000, rate: -0.36 },
      { period: "2025년 12월", amount: 95000, rate: 0.69 },
      { period: "2025년 11월", amount: -45000, rate: -0.33 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">수익률</h1>

        {/* 총 수익률 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-xl font-bold">총 수익률</h3>
          </div>
          <div className="text-5xl font-bold mb-2">
            +{returnsData.total.rate}%
          </div>
          <div className="text-xl text-green-100">
            +{returnsData.total.amount.toLocaleString('ko-KR')}원
          </div>
        </div>

        {/* 기간별 수익률 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">일간</div>
            <div className={`text-2xl font-bold mb-1 ${returnsData.daily.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.daily.rate >= 0 ? "+" : ""}{returnsData.daily.rate}%
            </div>
            <div className={`text-sm ${returnsData.daily.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.daily.amount >= 0 ? "+" : ""}{returnsData.daily.amount.toLocaleString('ko-KR')}원
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">주간</div>
            <div className={`text-2xl font-bold mb-1 ${returnsData.weekly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.weekly.rate >= 0 ? "+" : ""}{returnsData.weekly.rate}%
            </div>
            <div className={`text-sm ${returnsData.weekly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.weekly.amount >= 0 ? "+" : ""}{returnsData.weekly.amount.toLocaleString('ko-KR')}원
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">월간</div>
            <div className={`text-2xl font-bold mb-1 ${returnsData.monthly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.monthly.rate >= 0 ? "+" : ""}{returnsData.monthly.rate}%
            </div>
            <div className={`text-sm ${returnsData.monthly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.monthly.amount >= 0 ? "+" : ""}{returnsData.monthly.amount.toLocaleString('ko-KR')}원
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">연간</div>
            <div className={`text-2xl font-bold mb-1 ${returnsData.yearly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.yearly.rate >= 0 ? "+" : ""}{returnsData.yearly.rate}%
            </div>
            <div className={`text-sm ${returnsData.yearly.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {returnsData.yearly.amount >= 0 ? "+" : ""}{returnsData.yearly.amount.toLocaleString('ko-KR')}원
            </div>
          </div>
        </div>

        {/* 월별 수익률 내역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">월별 수익률 내역</h3>
          </div>
          <div className="space-y-3">
            {returnsData.history.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">{item.period}</div>
                <div className="flex items-center gap-6">
                  <div className={`text-lg font-bold ${item.rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.rate >= 0 ? "+" : ""}{item.rate}%
                  </div>
                  <div className={`text-sm font-medium min-w-[120px] text-right ${item.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.amount >= 0 ? "+" : ""}{item.amount.toLocaleString('ko-KR')}원
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
