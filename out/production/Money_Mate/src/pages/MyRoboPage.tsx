import { TrendingUp, Target, BarChart3, PieChart } from "lucide-react";

interface SurveyAnswers {
  objective?: string;
  timeHorizon?: string;
  knowledge?: string;
  riskReward?: string;
  marketReaction?: string;
  financialSituation?: string;
}

interface MyRoboPageProps {
  onNavigate?: (page: string) => void;
  surveyAnswers?: SurveyAnswers | null;
  onStartSurvey?: () => void;
}

// 투자 성향 계산 함수
function calculateInvestmentStyle(answers: SurveyAnswers): string {
  let score = 0;
  let count = 0;

  // objective 점수
  if (answers.objective) {
    const objectiveScores: Record<string, number> = {
      preservation: 1,
      retirement: 2,
      goal: 3,
      growth: 5,
    };
    score += objectiveScores[answers.objective] || 3;
    count++;
  }

  // timeHorizon 점수
  if (answers.timeHorizon) {
    const timeScores: Record<string, number> = {
      short: 1,
      "medium-short": 2,
      medium: 3,
      "medium-long": 4,
      long: 5,
    };
    score += timeScores[answers.timeHorizon] || 3;
    count++;
  }

  // knowledge 점수
  if (answers.knowledge) {
    const knowledgeScores: Record<string, number> = {
      beginner: 1,
      intermediate: 3,
      advanced: 4,
      expert: 5,
    };
    score += knowledgeScores[answers.knowledge] || 3;
    count++;
  }

  // riskReward 점수 (가장 중요)
  if (answers.riskReward) {
    const riskScores: Record<string, number> = {
      conservative: 1,
      "moderate-conservative": 2,
      moderate: 3,
      "moderate-aggressive": 4,
      aggressive: 5,
    };
    const riskScore = riskScores[answers.riskReward] || 3;
    score += riskScore * 2; // 가중치 2배
    count += 2;
  }

  // marketReaction 점수
  if (answers.marketReaction) {
    const reactionScores: Record<string, number> = {
      "panic-sell": 1,
      "partial-sell": 2,
      hold: 3,
      "buy-dip": 5,
    };
    score += reactionScores[answers.marketReaction] || 3;
    count++;
  }

  // financialSituation 점수
  if (answers.financialSituation) {
    const financialScores: Record<string, number> = {
      tight: 1,
      sufficient: 2,
      comfortable: 4,
      abundant: 5,
    };
    score += financialScores[answers.financialSituation] || 3;
    count++;
  }

  const average = count > 0 ? score / count : 3;

  // 평균 점수로 투자 성향 결정
  if (average <= 1.5) return "안정형";
  if (average <= 2.5) return "안정추구형";
  if (average <= 3.5) return "위험중립형";
  if (average <= 4.5) return "적극투자형";
  return "공격투자형";
}

export function MyRoboPage({ onNavigate, surveyAnswers, onStartSurvey }: MyRoboPageProps) {
  // 설문 결과가 있으면 계산, 없으면 기본값
  const investmentStyle = surveyAnswers ? calculateInvestmentStyle(surveyAnswers) : "안정형";

  // Mock data
  const roboInfo = {
    investmentStyle,
    operationMode: "자동 리밸런싱",
    assetAllocation: [
      { category: "국내 주식", percentage: 35 },
      { category: "해외 주식", percentage: 25 },
      { category: "채권", percentage: 30 },
      { category: "현금", percentage: 10 }
    ],
    goalAchievement: 78,
    llmAnalysis: "현재 포트폴리오는 안정적인 구성을 유지하고 있습니다. 채권 비중이 적절하여 시장 변동성에 대한 방어력이 확보되어 있으며, 주식 비중은 장기적인 성장 가능성을 고려한 균형잡힌 수준입니다. 목표 달성 확률 78%는 양호한 수준이며, 현재의 투자 전략을 유지하면서 정기적인 리밸런싱을 통해 안정적인 수익을 기대할 수 있습니다."
  };

  // Analysis data
  const analysisData = {
    totalReturn: "+12.5%",
    monthlyReturn: "+2.3%",
    riskLevel: "중간",
    sharpeRatio: "1.35"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">로보어드바이저</h1>

        {/* 투자 성향 및 운용 모드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">투자 성향</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-4">{roboInfo.investmentStyle}</div>
            <button
              onClick={() => onStartSurvey?.()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              투자 성향 재진단
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">운용 모드</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-4">{roboInfo.operationMode}</div>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              전략 리스트 보기
            </button>
          </div>
        </div>

        {/* 자산 배분 현황 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">자산 배분 현황</h3>
          <div className="space-y-4">
            {roboInfo.assetAllocation.map((asset, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-medium">{asset.category}</span>
                  <span className="text-gray-900 font-bold">{asset.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${asset.percentage}%`,
                      backgroundColor: index === 0 ? "#3B82F6" : index === 1 ? "#10B981" : index === 2 ? "#F59E0B" : "#6B7280"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ETF 목표 달성 확률 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">ETF 목표 달성 확률</h3>
          <div className="flex items-end gap-4 mb-4">
            <div className="text-5xl font-bold text-blue-600">{roboInfo.goalAchievement}%</div>
            <div className="text-gray-600 mb-2">달성 가능</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
              style={{ width: `${roboInfo.goalAchievement}%` }}
            />
          </div>
        </div>

        {/* LLM 해설 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">AI 포트폴리오 분석</h3>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-gray-800 leading-relaxed">{roboInfo.llmAnalysis}</p>
          </div>
        </div>

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
