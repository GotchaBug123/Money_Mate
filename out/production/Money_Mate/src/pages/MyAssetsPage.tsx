import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { generateUserAssets } from "../utils/userDataGenerator";
import { useMemo } from "react";

export function MyAssetsPage() {
  const { currentUserEmail } = useAuth();

  // 사용자 이메일 기반으로 일관된 자산 데이터 생성
  const assets = useMemo(() => {
    if (!currentUserEmail) {
      // 로그인하지 않은 경우 기본 데이터
      return [
        { name: "주식", value: 15000000, change: 5.2, color: "#1D6AE5" },
        { name: "채권", value: 8000000, change: 2.1, color: "#00C896" },
        { name: "펀드", value: 5000000, change: -1.3, color: "#F59E0B" },
        { name: "예금", value: 3000000, change: 0.5, color: "#8B5CF6" },
      ];
    }
    return generateUserAssets(currentUserEmail);
  }, [currentUserEmail]);

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MY 자산</h1>
          <p className="text-gray-600">당신의 투자 포트폴리오를 한눈에 확인하세요</p>
        </div>

        {/* Total Assets Card */}
        <Card className="mb-8" style={{ borderColor: "#1D6AE5", borderWidth: "2px" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6" style={{ color: "#1D6AE5" }} />
              총 자산
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2" style={{ color: "#1D6AE5" }}>
              {totalAssets.toLocaleString()}원
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">+3.8%</span>
              <span className="text-gray-500">이번 달</span>
            </div>
          </CardContent>
        </Card>

        {/* Assets Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {assets.map((asset) => (
            <Card key={asset.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: asset.color }}>
                  {asset.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {asset.value.toLocaleString()}원
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    asset.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {asset.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-semibold">
                    {asset.change >= 0 ? "+" : ""}
                    {asset.change}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" style={{ color: "#1D6AE5" }} />
                자산 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">{asset.name}</span>
                      <span className="font-semibold">
                        {((asset.value / totalAssets) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${(asset.value / totalAssets) * 100}%`,
                          backgroundColor: asset.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: "#00C896" }} />
                최근 수익률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-gray-700">이번 주</span>
                  <span className="font-semibold text-green-600">+2.1%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-gray-700">이번 달</span>
                  <span className="font-semibold text-green-600">+3.8%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-gray-700">올해</span>
                  <span className="font-semibold text-green-600">+12.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
