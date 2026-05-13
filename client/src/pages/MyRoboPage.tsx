import { useMemo, useState } from "react";
import {
  Edit3,
  Lock,
  Lightbulb,
  TrendingUp,
  Wallet,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { RoboSimulationPage } from "./RoboSimulationPage";

interface SurveyAnswers {
  objective?: string;
  timeHorizon?: string;
  knowledge?: string;
  riskReward?: string;
  marketReaction?: string;
  financialSituation?: string;
}

interface MyRoboPageProps {
  surveyAnswers?: SurveyAnswers | null;
}

function calculateInvestmentStyle(answers: SurveyAnswers): string {
  let score = 0;
  let count = 0;

  if (answers.objective) {
    const scores: Record<string, number> = {
      preservation: 1,
      retirement: 2,
      goal: 3,
      growth: 5,
    };

    score += scores[answers.objective] || 3;
    count++;
  }

  if (answers.timeHorizon) {
    const scores: Record<string, number> = {
      short: 1,
      "medium-short": 2,
      medium: 3,
      "medium-long": 4,
      long: 5,
    };

    score += scores[answers.timeHorizon] || 3;
    count++;
  }

  if (answers.knowledge) {
    const scores: Record<string, number> = {
      beginner: 1,
      intermediate: 3,
      advanced: 4,
      expert: 5,
    };

    score += scores[answers.knowledge] || 3;
    count++;
  }

  if (answers.riskReward) {
    const scores: Record<string, number> = {
      conservative: 1,
      "moderate-conservative": 2,
      moderate: 3,
      "moderate-aggressive": 4,
      aggressive: 5,
    };

    score += (scores[answers.riskReward] || 3) * 2;
    count += 2;
  }

  if (answers.marketReaction) {
    const scores: Record<string, number> = {
      "panic-sell": 1,
      "partial-sell": 2,
      hold: 3,
      "buy-dip": 5,
    };

    score += scores[answers.marketReaction] || 3;
    count++;
  }

  if (answers.financialSituation) {
    const scores: Record<string, number> = {
      tight: 1,
      sufficient: 2,
      comfortable: 4,
      abundant: 5,
    };

    score += scores[answers.financialSituation] || 3;
    count++;
  }

  const average = count > 0 ? score / count : 3;

  if (average <= 1.5) return "안정형";
  if (average <= 2.5) return "안정추구형";
  if (average <= 3.5) return "위험중립형";
  if (average <= 4.5) return "적극투자형";

  return "공격투자형";
}

export function MyRoboPage({ surveyAnswers }: MyRoboPageProps) {
  const investmentStyle = surveyAnswers
    ? calculateInvestmentStyle(surveyAnswers)
    : "위험중립형";

  const [showSimulation, setShowSimulation] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState(420);
  const [fixedExpense, setFixedExpense] = useState(120);
  const [variableExpense, setVariableExpense] = useState(80);

  const [currentEmergencyFund, setCurrentEmergencyFund] = useState(300);
  const [targetEmergencyFund, setTargetEmergencyFund] = useState(600);

  const [totalDebt, setTotalDebt] = useState(150);
  const [monthlyDebtPayment, setMonthlyDebtPayment] = useState(30);

  const report = useMemo(() => {
    const totalExpense = fixedExpense + variableExpense + monthlyDebtPayment;
    const baseInvestable = monthlyIncome - totalExpense;

    const spendingRatio =
      monthlyIncome > 0 ? Math.round((totalExpense / monthlyIncome) * 100) : 0;

    const emergencyChargeRate =
      targetEmergencyFund > 0
        ? Math.min(
            100,
            Math.round((currentEmergencyFund / targetEmergencyFund) * 100)
          )
        : 100;

    const emergencyShortage = Math.max(
      0,
      targetEmergencyFund - currentEmergencyFund
    );

    const monthlyEmergencySave =
      emergencyChargeRate < 100 ? Math.ceil(emergencyShortage / 3) : 0;

    const finalInvestable = Math.max(
      0,
      baseInvestable - monthlyEmergencySave
    );

    const debtRatio =
      monthlyIncome > 0
        ? Math.round((monthlyDebtPayment / monthlyIncome) * 100)
        : 0;

    const score = Math.max(
      0,
      Math.min(
        100,
        100 -
          Math.max(0, spendingRatio - 45) -
          Math.max(0, debtRatio - 10) * 2 -
          (emergencyChargeRate < 100 ? 10 : 0)
      )
    );

    const savedMoneyPerMonth = finalInvestable > 0 ? finalInvestable : 1;

    const monthsToGoal = Math.max(
      1,
      Math.ceil(emergencyShortage / savedMoneyPerMonth)
    );

    return {
      totalExpense,
      baseInvestable,
      spendingRatio,
      emergencyChargeRate,
      emergencyShortage,
      monthlyEmergencySave,
      finalInvestable,
      debtRatio,
      score,
      monthsToGoal,
    };
  }, [
    monthlyIncome,
    fixedExpense,
    variableExpense,
    currentEmergencyFund,
    targetEmergencyFund,
    monthlyDebtPayment,
  ]);

  if (showSimulation) {
    return (
      <RoboSimulationPage
        investableAmount={report.finalInvestable}
        emergencyRate={report.emergencyChargeRate}
        emergencyShortage={report.emergencyShortage}
        monthlyEmergencySave={report.monthlyEmergencySave}
        monthsToGoal={report.monthsToGoal}
        spendingRatio={report.spendingRatio}
        debtRatio={report.debtRatio}
        investmentStyle={investmentStyle}
        onBack={() => setShowSimulation(false)}
      />
    );
  }

  const moneyInputClass =
    "w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 pr-16 text-lg font-bold outline-none";

  const renderMoneyInput = (
    value: number,
    setter: (value: number) => void,
    focusColor: string
  ) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
          setter(onlyNumber === "" ? 0 : Number(onlyNumber));
        }}
        className={`${moneyInputClass} ${focusColor}`}
      />

      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
        만원
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">로보어드바이저</h1>

          <p className="text-gray-600 mt-2">
            사용자의 재무 상태를 기반으로 투자 가능 금액과 ETF 추천을
            안내합니다.
          </p>
        </div>

        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <TrendingUp className="w-4 h-4" />
                재무 컨디션 리포트
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                사용자의 현재 재무 상태를 분석합니다
              </h2>

              <p className="text-gray-600 leading-relaxed">
                입력된 수입, 지출, 비상금, 부채 데이터를 기반으로 투자 가능
                금액과 재무 건전성을 계산합니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 min-w-full lg:min-w-[520px]">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center">
                <div className="text-sm text-gray-500 mb-2">재무 점수</div>
                <div className="text-3xl font-bold text-blue-600">
                  {report.score}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center">
                <div className="text-sm text-gray-500 mb-2">소비 비율</div>
                <div className="text-3xl font-bold text-purple-600">
                  {report.spendingRatio}%
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center">
                <div className="text-sm text-gray-500 mb-2">
                  비상금 충전율
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {report.emergencyChargeRate}%
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  수입 및 지출
                </h3>
              </div>

              <Edit3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-5">
              <label className="block">
                <div className="text-sm text-gray-500 mb-2">월 수입</div>
                {renderMoneyInput(
                  monthlyIncome,
                  setMonthlyIncome,
                  "focus:border-blue-500"
                )}
              </label>

              <label className="block">
                <div className="text-sm text-gray-500 mb-2">고정 지출</div>
                {renderMoneyInput(
                  fixedExpense,
                  setFixedExpense,
                  "focus:border-blue-500"
                )}
              </label>

              <label className="block">
                <div className="text-sm text-gray-500 mb-2">변동 지출</div>
                {renderMoneyInput(
                  variableExpense,
                  setVariableExpense,
                  "focus:border-blue-500"
                )}
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">비상금</h3>
              </div>

              <Edit3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-5">
              <label className="block">
                <div className="text-sm text-gray-500 mb-2">현재 비상금</div>
                {renderMoneyInput(
                  currentEmergencyFund,
                  setCurrentEmergencyFund,
                  "focus:border-green-500"
                )}
              </label>

              <label className="block">
                <div className="text-sm text-gray-500 mb-2">목표 비상금</div>
                {renderMoneyInput(
                  targetEmergencyFund,
                  setTargetEmergencyFund,
                  "focus:border-green-500"
                )}
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">부채</h3>
              </div>

              <Lock className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-5">
              <label className="block">
                <div className="text-sm text-gray-500 mb-2">총 부채</div>
                {renderMoneyInput(
                  totalDebt,
                  setTotalDebt,
                  "focus:border-orange-500"
                )}
              </label>

              <label className="block">
                <div className="text-sm text-gray-500 mb-2">월 상환액</div>
                {renderMoneyInput(
                  monthlyDebtPayment,
                  setMonthlyDebtPayment,
                  "focus:border-orange-500"
                )}
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center shrink-0">
                <Lightbulb className="w-7 h-7 text-yellow-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  행동 변화 및 시뮬레이션 연결
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  현재 입력값 기준으로 목표 달성까지 약{" "}
                  <span className="font-bold text-blue-600">
                    {report.monthsToGoal}개월
                  </span>
                  이 필요합니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSimulation(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-colors whitespace-nowrap"
            >
              행동 변화 시뮬레이션 및 ETF 추천 받기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}