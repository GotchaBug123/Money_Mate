import { TrendingUp, Shield, Target, BarChart3, ChevronRight } from "lucide-react";

interface OnboardingPageProps {
  onNavigate: (page: string) => void;
}

export function OnboardingPage({ onNavigate }: OnboardingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            당신만의 투자 여정을 시작하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            MoneyMate 로보어드바이저는 AI 기반 맞춤형 포트폴리오로<br />
            초보 투자자부터 전문가까지 누구나 쉽게 투자할 수 있습니다
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#EFF6FF" }}
            >
              <Target className="w-7 h-7" style={{ color: "#3B82F6" }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              AI 기반 투자 성향 분석
            </h3>
            <p className="text-gray-600 mb-4">
              6가지 질문으로 당신의 투자 성향을 정확하게 분석하고,
              최적의 자산 배분 전략을 제시합니다.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>30초 투자 성향 진단</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>5가지 투자 유형 분류</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>맞춤형 ETF 추천</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#ECFDF5" }}
            >
              <BarChart3 className="w-7 h-7" style={{ color: "#10B981" }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              자동 리밸런싱 포트폴리오
            </h3>
            <p className="text-gray-600 mb-4">
              시장 변동에 따라 자동으로 포트폴리오를 조정하여
              최적의 수익률을 유지합니다.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span>실시간 자산 모니터링</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span>자동 리밸런싱 알림</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span>세금 최적화 전략</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <TrendingUp className="w-7 h-7" style={{ color: "#F59E0B" }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              목표 달성 시뮬레이션
            </h3>
            <p className="text-gray-600 mb-4">
              주택 구매, 은퇴 자금 등 구체적인 재무 목표를
              설정하고 달성 가능성을 시뮬레이션합니다.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <span>목표 금액 설정</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <span>달성 시나리오 분석</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <span>월 투자금 추천</span>
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#F3E8FF" }}
            >
              <Shield className="w-7 h-7" style={{ color: "#8B5CF6" }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              안전한 자산 관리
            </h3>
            <p className="text-gray-600 mb-4">
              금융위원회 인가를 받은 안전한 투자 플랫폼으로
              고객의 자산을 철저히 보호합니다.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span>금융위원회 인가 서비스</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span>투자자 예치금 보호</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span>실시간 투명한 운용</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-10 shadow-xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            회원가입 후 30초만에 나만의 투자 성향을 분석하고<br />
            최적의 포트폴리오를 받아보세요
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate("survey")}
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: "#3B82F6" }}
            >
              <span>투자 성향 분석 시작</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate("signup-step1")}
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#10B981",
                color: "white",
              }}
            >
              <span>회원가입하기</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => onNavigate("login")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
            <div className="text-gray-600">누적 가입자</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">₩1.2조</div>
            <div className="text-gray-600">운용 자산</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5.0</div>
            <div className="text-gray-600">고객 만족도</div>
          </div>
        </div>
      </div>
    </div>
  );
}
