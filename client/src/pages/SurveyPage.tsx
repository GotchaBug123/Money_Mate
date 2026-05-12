import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SurveyAnswers {
  objective?: string;
  timeHorizon?: string;
  knowledge?: string;
  riskReward?: string;
  marketReaction?: string;
  financialSituation?: string;
}

interface SurveyPageProps {
  onComplete: (answers: SurveyAnswers) => void;
  onBack: () => void;
}

const questions = [
  {
    id: "objective",
    title: "투자 목적이 무엇인가요?",
    subtitle: "가장 중요한 목표를 선택해주세요",
    options: [
      { value: "preservation", label: "원금 보존", description: "안전하게 자산을 지키고 싶어요" },
      { value: "retirement", label: "은퇴 준비", description: "노후를 위한 장기 투자" },
      { value: "goal", label: "목표 달성", description: "주택 구매, 교육비 등 특정 목표" },
      { value: "growth", label: "공격적 성장", description: "높은 수익을 추구합니다" },
    ],
  },
  {
    id: "timeHorizon",
    title: "투자 기간은 얼마나 되나요?",
    subtitle: "투자금을 인출하지 않고 유지할 수 있는 기간",
    options: [
      { value: "short", label: "1년 이하", description: "단기 투자" },
      { value: "medium-short", label: "1-3년", description: "중단기 투자" },
      { value: "medium", label: "3-5년", description: "중기 투자" },
      { value: "medium-long", label: "5-10년", description: "중장기 투자" },
      { value: "long", label: "10년 이상", description: "장기 투자" },
    ],
  },
  {
    id: "knowledge",
    title: "투자 경험은 어느 정도인가요?",
    subtitle: "주식, 펀드, ETF 등 금융상품 투자 경험",
    options: [
      { value: "beginner", label: "초보자", description: "투자 경험이 거의 없어요" },
      { value: "intermediate", label: "중급자", description: "1-3년 정도 투자 경험이 있어요" },
      { value: "advanced", label: "상급자", description: "3년 이상 꾸준히 투자해왔어요" },
      { value: "expert", label: "전문가", description: "금융 전문가이거나 다양한 투자 경험 보유" },
    ],
  },
  {
    id: "riskReward",
    title: "원하시는 수익률과 감수 가능한 리스크는?",
    subtitle: "높은 수익은 높은 변동성을 동반합니다",
    options: [
      { value: "conservative", label: "2-3% (안정형)", description: "원금 손실을 최소화" },
      { value: "moderate-conservative", label: "4-6% (안정추구형)", description: "낮은 변동성 선호" },
      { value: "moderate", label: "7-9% (위험중립형)", description: "적절한 균형 추구" },
      { value: "moderate-aggressive", label: "10-12% (적극투자형)", description: "변동성 감수 가능" },
      { value: "aggressive", label: "15% 이상 (공격투자형)", description: "높은 변동성 수용" },
    ],
  },
  {
    id: "marketReaction",
    title: "시장이 급락할 때 어떻게 행동하시나요?",
    subtitle: "투자 포트폴리오가 20% 하락했을 때",
    options: [
      { value: "panic-sell", label: "공황 매도", description: "즉시 전량 매도합니다" },
      { value: "partial-sell", label: "일부 매도", description: "손실을 줄이기 위해 일부 매도" },
      { value: "hold", label: "보유 유지", description: "그대로 보유하며 회복을 기다림" },
      { value: "buy-dip", label: "추가 매수", description: "저점 기회로 보고 추가 매수" },
    ],
  },
  {
    id: "financialSituation",
    title: "현재 재무 상황은 어떠신가요?",
    subtitle: "투자금 외의 비상금 및 여유자금 보유 현황",
    options: [
      { value: "tight", label: "여유 없음", description: "비상금이 부족한 상황" },
      { value: "sufficient", label: "충분함", description: "6개월 이상 생활비 확보" },
      { value: "comfortable", label: "여유로움", description: "1년 이상 생활비 + 여유자금" },
      { value: "abundant", label: "풍부함", description: "충분한 자산과 안정적 수입" },
    ],
  },
];

export function SurveyPage({ onComplete, onBack }: SurveyPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelectOption = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after selection
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              질문 {currentStep + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Question Title */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
            <p className="text-gray-600">{currentQuestion.subtitle}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id as keyof SurveyAnswers] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className="w-full text-left p-5 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md"
                  style={{
                    borderColor: isSelected ? "#3B82F6" : "#E5E7EB",
                    backgroundColor: isSelected ? "#EFF6FF" : "white",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Radio Button */}
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? "#3B82F6" : "#D1D5DB",
                        backgroundColor: isSelected ? "#3B82F6" : "white",
                      }}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>

                    {/* Label & Description */}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>이전</span>
          </button>

          {answers[currentQuestion.id as keyof SurveyAnswers] && (
            <button
              onClick={() => {
                if (currentStep < questions.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  onComplete(answers);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === questions.length - 1 ? "결과 보기" : "다음"}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
