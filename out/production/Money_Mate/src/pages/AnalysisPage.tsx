import { BarChart3, TrendingUp, PieChart } from "lucide-react";

export function AnalysisPage() {
  // Mock data
  const analysisData = {
    totalReturn: "+12.5%",
    monthlyReturn: "+2.3%",
    riskLevel: "중간",
    sharpeRatio: "1.35"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">분석</h1>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">누적 수익률</div>
            <div className="text-2xl font-bold text-green-600">{analysisData.totalReturn}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">월간 수익률</div>
            <div className="text-2xl font-bold text-blue-600">{analysisData.monthlyReturn}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">위험도</div>
            <div className="text-2xl font-bold text-gray-900">{analysisData.riskLevel}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">샤프 비율</div>
            <div className="text-2xl font-bold text-gray-900">{analysisData.sharpeRatio}</div>
          </div>
        </div>

        {/* 투자 분석 영역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">포트폴리오 성과 분석</h3>
          </div>

          {/* Placeholder for chart */}
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-16 flex flex-col items-center justify-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">수익률 차트</p>
            <p className="text-gray-500 text-sm">시간에 따른 포트폴리오 성과를 표시합니다</p>
          </div>
        </div>

        {/* 자산별 수익률 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">자산별 기여도 분석</h3>
          </div>

          {/* Placeholder for pie chart */}
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-16 flex flex-col items-center justify-center">
            <PieChart className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">자산 배분 차트</p>
            <p className="text-gray-500 text-sm">각 자산의 수익 기여도를 표시합니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
