import { useMemo, useState } from "react";
import {
  Lightbulb,
  AlertTriangle,
  ShieldCheck,
  Settings,
  WalletCards,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface SimulationPageProps {
  investableAmount?: number;
  emergencyRate?: number;

  monthlyEmergencySave?: number;
  monthsToGoal?: number;

  spendingRatio?: number;
  debtRatio?: number;

  investmentStyle?: string;

  onBack?: () => void;
}

export function RoboSimulationPage({
  investableAmount = 175,
  emergencyRate = 85,

  monthlyEmergencySave = 20,
  monthsToGoal = 4,

  spendingRatio = 40,
  debtRatio = 10,

  investmentStyle = "위험중립형",

  onBack,
}: SimulationPageProps) {

  /* =========================
     실시간 시뮬레이션 상태
  ========================= */

  const [currentInvestable, setCurrentInvestable] =
    useState(investableAmount);

  const [currentEmergencyRate, setCurrentEmergencyRate] =
    useState(emergencyRate);

  const [simulationMessage, setSimulationMessage] =
    useState("");

  /* =========================
     행동 변화 시뮬레이션
  ========================= */

  const [savingType, setSavingType] = useState<
    "daily" | "weekly3" | "weekly1"
  >("daily");

  /* =========================
     비상금 긴급 인출
  ========================= */

  const [showWithdrawModal, setShowWithdrawModal] =
    useState(false);

  const [withdrawAmount, setWithdrawAmount] =
    useState("");

  /* =========================
     상환 우선순위 설정
  ========================= */

  const [showPriorityModal, setShowPriorityModal] =
    useState(false);

  const [priority, setPriority] =
    useState("자동 추천");

  /* =========================
     업데이트 상태
  ========================= */

  const [updated, setUpdated] =
    useState(false);

  /* =========================
     행동 변화 계산
  ========================= */

  const behaviorData = useMemo(() => {

    switch (savingType) {

      case "daily":
        return {
          extraMoney: Math.round(
            currentInvestable * 0.08
          ),

          fasterMonth: Math.max(
            1,
            monthsToGoal - 4
          ),
        };

      case "weekly3":
        return {
          extraMoney: Math.round(
            currentInvestable * 0.05
          ),

          fasterMonth: Math.max(
            1,
            monthsToGoal - 2
          ),
        };

      case "weekly1":
        return {
          extraMoney: Math.round(
            currentInvestable * 0.02
          ),

          fasterMonth: Math.max(
            1,
            monthsToGoal - 1
          ),
        };

      default:
        return {
          extraMoney: 15,
          fasterMonth: 4,
        };
    }

  }, [
    savingType,
    currentInvestable,
    monthsToGoal,
  ]);

  /* =========================
     ETF 비율 계산
  ========================= */

  const portfolio = useMemo(() => {

    if (investmentStyle === "안정형") {
      return {
        stock: 20,
        bond: 80,
      };
    }

    if (investmentStyle === "안정추구형") {
      return {
        stock: 40,
        bond: 60,
      };
    }

    if (investmentStyle === "위험중립형") {
      return {
        stock: 60,
        bond: 40,
      };
    }

    if (investmentStyle === "적극투자형") {
      return {
        stock: 80,
        bond: 20,
      };
    }

    return {
      stock: 90,
      bond: 10,
    };

  }, [investmentStyle]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-5xl mx-auto px-4">

        {/* 뒤로가기 */}
        <div className="mb-6">

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 transition-colors px-5 py-3 rounded-2xl font-semibold text-gray-700"
          >

            <ArrowLeft className="w-5 h-5" />

            뒤로 가기

          </button>

        </div>

        {/* 메시지 */}
        {simulationMessage && (

          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-5 text-lg font-semibold">

            ✅ {simulationMessage}

          </div>
        )}

        {/* 메인 카드 */}
        <section className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">

          {/* =========================
              (1) 행동 변화 시뮬레이션
          ========================= */}

          <div className="mb-10">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">

                <Lightbulb className="w-5 h-5 text-yellow-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  (1) 행동 변화 시뮬레이션
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  소비 습관 변화가 목표 달성에 미치는 영향을 분석합니다.
                </p>

              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">

              <div className="text-lg font-semibold text-gray-900 mb-6">
                ☕ “커피 한 잔(5천 원)을 아껴서 ETF에 투자한다면?”
              </div>

              <div className="flex flex-wrap gap-6 mb-8">

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    checked={savingType === "daily"}
                    onChange={() => setSavingType("daily")}
                  />

                  <span className="font-medium text-gray-700">
                    매일 아끼기
                  </span>

                </label>

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    checked={savingType === "weekly3"}
                    onChange={() => setSavingType("weekly3")}
                  />

                  <span className="font-medium text-gray-700">
                    주 3회 아끼기
                  </span>

                </label>

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    checked={savingType === "weekly1"}
                    onChange={() => setSavingType("weekly1")}
                  />

                  <span className="font-medium text-gray-700">
                    주 1회 아끼기
                  </span>

                </label>

              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">

                    <Lightbulb className="w-5 h-5 text-yellow-600" />

                  </div>

                  <div>

                    <div className="text-sm text-blue-600 font-semibold mb-2">
                      분석 결과
                    </div>

                    <p className="text-lg leading-relaxed text-gray-700">

                      매달{" "}

                      <span className="font-bold text-blue-600">
                        {behaviorData.extraMoney}만 원
                      </span>

                      을 더 투자하게 되어 목표 달성이{" "}

                      <span className="font-bold text-purple-600">
                        {behaviorData.fasterMonth}개월
                      </span>

                      더 빨라집니다.

                    </p>

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* =========================
              (2) 비상금 자동 연동
          ========================= */}

          <div className="mb-10">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">

                <ShieldCheck className="w-5 h-5 text-green-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  (2) 비상금 충전 & 투자금 자동 연동
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  비상금 부족 상태에 따라 투자금이 자동 조정됩니다.
                </p>

              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">

              {/* 프로그레스 */}
              <div className="mb-8">

                <div className="flex justify-between mb-3">

                  <span className="font-semibold text-gray-700">
                    비상금 충전율
                  </span>

                  <span className="font-bold text-green-600">
                    {currentEmergencyRate}%
                  </span>

                </div>

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${currentEmergencyRate}%`,
                    }}
                  />

                </div>
              </div>

              {/* 경고 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">

                    <AlertTriangle className="w-5 h-5 text-yellow-600" />

                  </div>

                  <div>

                    <div className="font-semibold text-yellow-700 mb-2">
                      지난달 비상금 {monthlyEmergencySave}만 원 사용 감지
                    </div>

                    <p className="text-gray-700 leading-relaxed">

                      이번 달 투자금에서{" "}

                      <span className="font-bold text-orange-600">
                        {monthlyEmergencySave}만 원
                      </span>

                      이 자동 차감되어 비상금 계좌로 우선 이동됩니다.

                    </p>

                    <div className="text-sm text-gray-500 mt-2">
                      (재무 안정성 확보 목적)
                    </div>

                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex flex-wrap gap-4">

                {/* 비상금 긴급 인출 */}
                <button
                  type="button"
                  onClick={() =>
                    setShowWithdrawModal(true)
                  }
                  className="flex items-center gap-3 px-8 py-5 rounded-3xl border border-gray-300 bg-white hover:bg-gray-100 transition-colors font-bold text-2xl text-gray-800 shadow-sm"
                >

                  <WalletCards className="w-8 h-8 text-green-600" />

                  비상금 긴급 인출

                </button>

                {/* 상환 우선순위 설정 */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPriorityModal(true)
                  }
                  className="flex items-center gap-3 px-8 py-5 rounded-3xl border border-gray-300 bg-white hover:bg-gray-100 transition-colors font-bold text-2xl text-gray-800 shadow-sm"
                >

                  <Settings className="w-8 h-8 text-purple-600" />

                  상환 우선순위 설정

                </button>

              </div>

            </div>
          </div>

          {/* =========================
              (3) ETF 추천
          ========================= */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

                <TrendingUp className="w-5 h-5 text-blue-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  (3) 이번 달 추천 ETF 레시피
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  현재 재무 상태와 투자 성향 기반 추천입니다.
                </p>

              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">

              {/* 투자 가능 금액 */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">

                <div className="text-sm text-blue-600 mb-2 font-semibold">
                  현재 분석된 투자 가능 금액
                </div>

                <div className="text-4xl font-bold text-blue-600">
                  {currentInvestable}만 원
                </div>

              </div>

              {/* 투자 성향 */}
              <div className="mb-6">

                <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  투자 성향: {investmentStyle}
                </div>

              </div>

              <div className="space-y-5">

                {/* 주식 ETF */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-4">

                    <div>

                      <div className="text-lg font-bold text-gray-900">
                        주식 ETF
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        장기 성장 중심 포트폴리오
                      </div>

                    </div>

                    <div className="text-3xl font-bold text-blue-600">
                      {portfolio.stock}%
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold">
                      S&P500
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold">
                      나스닥100
                    </div>

                  </div>

                </div>

                {/* 채권 ETF */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-4">

                    <div>

                      <div className="text-lg font-bold text-gray-900">
                        채권 ETF
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        안정성 방어 자산
                      </div>

                    </div>

                    <div className="text-3xl font-bold text-green-600">
                      {portfolio.bond}%
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <div className="px-4 py-2 rounded-xl bg-green-50 text-green-700 font-semibold">
                      미국채 10년물
                    </div>

                  </div>

                </div>

              </div>

              {/* 업데이트 버튼 */}
              <div className="mt-8">

                <button
                  type="button"
                  onClick={() => {

                    setUpdated(true);

                    setCurrentInvestable((prev) =>
                      prev + behaviorData.extraMoney
                    );

                    setSimulationMessage(
                      `행동 변화 시뮬레이션 반영 완료 (+${behaviorData.extraMoney}만 원)`
                    );
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-3xl py-8 text-4xl font-bold shadow-lg"
                >
                  이번 분석 결과로 시뮬레이션 업데이트
                </button>

                {updated && (

                  <div className="mt-5 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-5 text-lg font-semibold">

                    ✅ 최신 투자 분석 결과로 시뮬레이션이 업데이트되었습니다.

                  </div>
                )}

              </div>

            </div>
          </div>

        </section>
      </div>

      {/* =========================
          비상금 긴급 인출 모달
      ========================= */}

      {showWithdrawModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              비상금 긴급 인출
            </h3>

            <div className="mb-5">

              <label className="block text-sm font-semibold text-gray-600 mb-2">
                인출 금액
              </label>

              <input
                type="text"
                value={withdrawAmount}
                onChange={(e) =>
                  setWithdrawAmount(
                    e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    )
                  )
                }
                placeholder="예: 50"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-xl font-bold outline-none focus:border-green-500"
              />

              <div className="text-sm text-gray-400 mt-2">
                단위: 만원
              </div>

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowWithdrawModal(false)
                }
                className="flex-1 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors font-bold text-gray-700"
              >
                취소
              </button>

              <button
                type="button"
                onClick={() => {

                  const amount =
                    Number(withdrawAmount);

                  if (!amount || amount <= 0) {
                    return;
                  }

                  setCurrentInvestable((prev) =>
                    Math.max(0, prev - amount)
                  );

                  setCurrentEmergencyRate((prev) =>
                    Math.min(100, prev + 5)
                  );

                  setSimulationMessage(
                    `비상금 ${amount}만 원 인출 반영 완료`
                  );

                  setShowWithdrawModal(false);

                  setWithdrawAmount("");
                }}
                className="flex-1 py-4 rounded-2xl bg-green-600 hover:bg-green-700 transition-colors font-bold text-white"
              >
                인출 실행
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          상환 우선순위 모달
      ========================= */}

      {showPriorityModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              상환 우선순위 설정
            </h3>

            <div className="space-y-4 mb-6">

              {[
                "고금리 대출 우선",
                "소액 부채 우선",
                "자동 추천",
              ].map((item) => (

                <label
                  key={item}
                  className="flex items-center gap-3 cursor-pointer border border-gray-200 rounded-2xl p-4 hover:bg-gray-50"
                >

                  <input
                    type="radio"
                    checked={priority === item}
                    onChange={() =>
                      setPriority(item)
                    }
                  />

                  <span className="font-semibold text-gray-700">
                    {item}
                  </span>

                </label>
              ))}

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowPriorityModal(false)
                }
                className="flex-1 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors font-bold text-gray-700"
              >
                취소
              </button>

              <button
                type="button"
                onClick={() => {

                  if (priority === "고금리 대출 우선") {

                    setCurrentInvestable((prev) =>
                      Math.max(0, prev - 20)
                    );

                    setSimulationMessage(
                      "고금리 부채 우선 상환 전략 적용"
                    );
                  }

                  if (priority === "소액 부채 우선") {

                    setCurrentInvestable((prev) =>
                      Math.max(0, prev - 10)
                    );

                    setSimulationMessage(
                      "소액 부채 정리 전략 적용"
                    );
                  }

                  if (priority === "자동 추천") {

                    setCurrentInvestable((prev) =>
                      prev + 15
                    );

                    setSimulationMessage(
                      "AI 자동 추천 전략 적용"
                    );
                  }

                  setShowPriorityModal(false);
                }}
                className="flex-1 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 transition-colors font-bold text-white"
              >
                저장
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}