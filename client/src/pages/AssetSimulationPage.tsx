import { useMemo, useState } from "react";
import {
  Save,
  PlayCircle,
  ArrowLeft,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface AssetSimulationPageProps {
  onBack?: () => void;
}

export function AssetSimulationPage({ onBack }: AssetSimulationPageProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(195);
  const [saved, setSaved] = useState(false);
  const [started, setStarted] = useState(false);

  const extraInvestment = useMemo(() => {
    return Math.max(0, monthlyInvestment - 180);
  }, [monthlyInvestment]);

  const shortenedMonths = useMemo(() => {
    return Math.max(1, Math.round(extraInvestment * 0.53));
  }, [extraInvestment]);

  const achievementRate = 70;

  const cloudPoints = useMemo(() => {
    return Array.from({ length: 36 }, (_, index) => {
      const x = 20 + index * 14;
      const y = 90 + Math.sin(index * 0.8) * 28 + (index % 5) * 5;

      return { x, y };
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-200 px-5 py-3 rounded-2xl font-semibold text-gray-700 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            뒤로 가기
          </button>
        </div>

        <section className="bg-white border border-gray-200 rounded-[32px] shadow-sm p-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                MoneyMate ETF 가이드
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                자산 시뮬레이션 리포트
              </p>
            </div>

            <div className="flex items-center gap-4 text-3xl">
              <span>🔔</span>
              <span>👤</span>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="w-7 h-7 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                (1) 목표 달성 현황
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
              <p className="text-2xl font-bold text-gray-800 mb-7 leading-relaxed">
                “사용자님, [결혼자금] 목표까지 이만큼 달려왔어요! 🏃”
              </p>

              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-gray-700">현재 달성률</span>
                  <span className="font-bold text-blue-600">{achievementRate}%</span>
                </div>

                <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${achievementRate}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-4 text-gray-700 text-xl">
                <li>• 목표 금액: <span className="font-bold text-gray-900 ml-2">5,000만 원</span></li>
                <li>• 남은 금액: <span className="font-bold text-blue-600 ml-2">1,500만 원</span> <span className="text-gray-500 ml-2">(현재 70% 달성!)</span></li>
                <li>• 달성 확률: <span className="font-bold text-green-600 ml-2">68%</span> <span className="text-gray-500 ml-2">(위험중립형 성향 반영)</span></li>
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="w-7 h-7 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                (2) 미래 자산 시뮬레이션
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
              <div className="h-[320px] bg-white border border-gray-200 rounded-3xl overflow-hidden mb-6 shadow-sm">
                <svg width="100%" height="100%" viewBox="0 0 560 230">
                  <line x1="45" y1="190" x2="525" y2="190" stroke="#CBD5E1" />
                  <line x1="45" y1="30" x2="45" y2="190" stroke="#CBD5E1" />

                  {cloudPoints.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x + 45}
                      cy={point.y}
                      r="5"
                      fill="#3B82F6"
                      opacity="0.35"
                    />
                  ))}

                  <path
                    d="M45 165 C130 145, 210 135, 300 105 C395 75, 460 65, 525 45"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <text x="55" y="28" fontSize="13" fill="#64748B">
                    몬테카를로 확률 구름
                  </text>
                </svg>
              </div>

              <p className="text-center text-lg text-gray-600 leading-relaxed">
                *시장 변동성과 ETF 수익률을 기반으로 생성된 미래 자산 시뮬레이션입니다.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-7 h-7 text-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-900">
                (3) 기간 단축 마법사
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-5">
                <p className="text-2xl font-bold text-gray-800">
                  현재 월 <span className="text-blue-600 mx-2">{monthlyInvestment}만 원</span> 투자 중
                </p>
                <p className="text-gray-500">(지출/부채 제외)</p>
              </div>

              <input
                type="range"
                min="100"
                max="300"
                step="5"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-sm text-gray-400 mt-3 mb-8">
                <span>100만</span>
                <span>200만</span>
                <span>300만</span>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6">
                <p className="text-gray-800 text-2xl leading-relaxed font-medium">
                  💡 매달 <span className="font-bold text-blue-600 mx-2">{extraInvestment}만 원</span>
                  을 더 ETF에 투자하면, 목표 달성 기간이
                  <span className="font-bold text-purple-600 mx-2">{shortenedMonths}개월</span>
                  이나 단축돼요!
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="w-7 h-7 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                (4) 기간별 맞춤 ETF 레시피
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold mb-6">
                No Stocks! ETF Only
              </div>

              <p className="text-2xl font-bold text-gray-800 mb-7">
                사용자님의 목표 기간 <span className="text-blue-600 mx-2">5년</span> 에 딱 맞는 구성:
              </p>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="text-lg font-bold text-blue-600 mb-3">주식 ETF (70%)</div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• S&P500 ETF</li>
                    <li>• KOSPI200 ETF</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="text-lg font-bold text-purple-600 mb-3">성장 ETF (20%)</div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 나스닥100 ETF</li>
                    <li>• 반도체 ETF</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="text-lg font-bold text-green-600 mb-3">채권 ETF (10%)</div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 국고채 ETF</li>
                    <li>• 미국채 ETF</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {saved && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 font-semibold">
              ✅ 이 플랜이 저장되었습니다.
            </div>
          )}

          {started && (
            <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-4 font-semibold">
              ✅ ETF 투자 시작 화면으로 이동할 준비가 완료되었습니다.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-5">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-3xl py-5 font-bold text-lg transition-all duration-200"
            >
              <Save className="w-5 h-5 text-purple-600" />
              이 플랜 저장
            </button>

            <button
              type="button"
              onClick={() => setStarted(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl py-5 font-bold text-lg transition-all duration-200 shadow-lg"
            >
              <PlayCircle className="w-5 h-5" />
              ETF 투자 시작
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}