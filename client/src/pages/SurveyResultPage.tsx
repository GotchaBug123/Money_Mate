import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Shield, Activity, Target, Rocket } from "lucide-react";

interface SurveyAnswers {
  objective?: string;
  timeHorizon?: string;
  knowledge?: string;
  riskReward?: string;
  marketReaction?: string;
  financialSituation?: string;
}

interface SurveyResultPageProps {
  answers: SurveyAnswers;
  onNavigate: (page: string) => void;
}

interface InvestmentProfile {
  type: "aggressive" | "active" | "neutral" | "stable-pursuit" | "stable";
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  allocation: { name: string; value: number; color: string }[];
  etfs: { name: string; ticker: string; allocation: number; description: string }[];
}

const profileTypes: Record<string, InvestmentProfile> = {
  aggressive: {
    type: "aggressive",
    label: "공격투자형",
    description: "높은 수익을 위해 높은 위험을 감수하는 투자자",
    icon: <Rocket className="w-8 h-8" />,
    color: "#EF4444",
    allocation: [
      { name: "주식", value: 85, color: "#3B82F6" },
      { name: "채권", value: 10, color: "#10B981" },
      { name: "현금", value: 5, color: "#F59E0B" },
    ],
    etfs: [
      { name: "S&P 500 ETF", ticker: "VOO", allocation: 40, description: "미국 대표 500개 기업" },
      { name: "나스닥 100 ETF", ticker: "QQQ", allocation: 30, description: "기술주 중심 성장 ETF" },
      { name: "신흥시장 ETF", ticker: "VWO", allocation: 15, description: "고성장 신흥국 투자" },
    ],
  },
  active: {
    type: "active",
    label: "적극투자형",
    description: "적절한 위험을 감수하며 성장을 추구하는 투자자",
    icon: <TrendingUp className="w-8 h-8" />,
    color: "#F97316",
    allocation: [
      { name: "주식", value: 70, color: "#3B82F6" },
      { name: "채권", value: 20, color: "#10B981" },
      { name: "현금", value: 10, color: "#F59E0B" },
    ],
    etfs: [
      { name: "S&P 500 ETF", ticker: "VOO", allocation: 35, description: "미국 대표 500개 기업" },
      { name: "배당 성장 ETF", ticker: "SCHD", allocation: 25, description: "안정적 배당 + 성장" },
      { name: "채권 ETF", ticker: "AGG", allocation: 20, description: "미국 종합 채권" },
    ],
  },
  neutral: {
    type: "neutral",
    label: "위험중립형",
    description: "균형잡힌 포트폴리오를 선호하는 투자자",
    icon: <Activity className="w-8 h-8" />,
    color: "#8B5CF6",
    allocation: [
      { name: "주식", value: 50, color: "#3B82F6" },
      { name: "채권", value: 35, color: "#10B981" },
      { name: "현금", value: 15, color: "#F59E0B" },
    ],
    etfs: [
      { name: "S&P 500 ETF", ticker: "VOO", allocation: 30, description: "미국 대표 500개 기업" },
      { name: "채권 ETF", ticker: "AGG", allocation: 30, description: "미국 종합 채권" },
      { name: "배당 ETF", ticker: "VYM", allocation: 20, description: "고배당 우량주" },
    ],
  },
  "stable-pursuit": {
    type: "stable-pursuit",
    label: "안정추구형",
    description: "안정성을 중시하되 적절한 수익을 추구하는 투자자",
    icon: <Target className="w-8 h-8" />,
    color: "#06B6D4",
    allocation: [
      { name: "주식", value: 30, color: "#3B82F6" },
      { name: "채권", value: 55, color: "#10B981" },
      { name: "현금", value: 15, color: "#F59E0B" },
    ],
    etfs: [
      { name: "배당 ETF", ticker: "VYM", allocation: 25, description: "고배당 우량주" },
      { name: "채권 ETF", ticker: "AGG", allocation: 40, description: "미국 종합 채권" },
      { name: "단기 채권 ETF", ticker: "SHV", allocation: 15, description: "단기 국채" },
    ],
  },
  stable: {
    type: "stable",
    label: "안정형",
    description: "원금 보존을 최우선으로 하는 보수적 투자자",
    icon: <Shield className="w-8 h-8" />,
    color: "#10B981",
    allocation: [
      { name: "주식", value: 15, color: "#3B82F6" },
      { name: "채권", value: 70, color: "#10B981" },
      { name: "현금", value: 15, color: "#F59E0B" },
    ],
    etfs: [
      { name: "채권 ETF", ticker: "AGG", allocation: 50, description: "미국 종합 채권" },
      { name: "단기 채권 ETF", ticker: "SHV", allocation: 20, description: "단기 국채" },
      { name: "배당 ETF", ticker: "VYM", allocation: 15, description: "고배당 우량주" },
    ],
  },
};

function calculateProfile(answers: SurveyAnswers): InvestmentProfile {
  let score = 0;

  // Objective scoring
  const objectiveScores: Record<string, number> = {
    preservation: 1,
    retirement: 2,
    goal: 3,
    growth: 5,
  };
  score += objectiveScores[answers.objective || "goal"] || 3;

  // Time horizon scoring
  const timeScores: Record<string, number> = {
    short: 1,
    "medium-short": 2,
    medium: 3,
    "medium-long": 4,
    long: 5,
  };
  score += timeScores[answers.timeHorizon || "medium"] || 3;

  // Knowledge scoring
  const knowledgeScores: Record<string, number> = {
    beginner: 1,
    intermediate: 3,
    advanced: 4,
    expert: 5,
  };
  score += knowledgeScores[answers.knowledge || "intermediate"] || 3;

  // Risk-reward scoring
  const riskScores: Record<string, number> = {
    conservative: 1,
    "moderate-conservative": 2,
    moderate: 3,
    "moderate-aggressive": 4,
    aggressive: 5,
  };
  score += riskScores[answers.riskReward || "moderate"] || 3;

  // Market reaction scoring
  const reactionScores: Record<string, number> = {
    "panic-sell": 1,
    "partial-sell": 2,
    hold: 3,
    "buy-dip": 5,
  };
  score += reactionScores[answers.marketReaction || "hold"] || 3;

  // Financial situation scoring
  const financialScores: Record<string, number> = {
    tight: 1,
    sufficient: 3,
    comfortable: 4,
    abundant: 5,
  };
  score += financialScores[answers.financialSituation || "sufficient"] || 3;

  // Calculate average score (6-30 range, normalize to 1-5)
  const avgScore = score / 6;

  // Map to profile type
  if (avgScore >= 4.5) return profileTypes.aggressive;
  if (avgScore >= 3.5) return profileTypes.active;
  if (avgScore >= 2.5) return profileTypes.neutral;
  if (avgScore >= 1.5) return profileTypes["stable-pursuit"];
  return profileTypes.stable;
}

export function SurveyResultPage({ answers, onNavigate }: SurveyResultPageProps) {
  const profile = calculateProfile(answers);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: profile.color + "20", color: profile.color }}>
            {profile.icon}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            당신의 투자 성향: <span style={{ color: profile.color }}>{profile.label}</span>
          </h1>
          <p className="text-lg text-gray-600">{profile.description}</p>
        </div>

        {/* Profile Scale */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">투자 성향 분류</h2>
          <div className="flex items-center justify-between gap-2 mb-4">
            {Object.values(profileTypes).map((type) => (
              <div
                key={type.type}
                className="flex-1 text-center p-4 rounded-xl transition-all"
                style={{
                  backgroundColor: type.type === profile.type ? type.color + "20" : "#F3F4F6",
                  borderWidth: type.type === profile.type ? "3px" : "1px",
                  borderColor: type.type === profile.type ? type.color : "#E5E7EB",
                  borderStyle: "solid",
                }}
              >
                <div className="flex justify-center mb-2" style={{ color: type.type === profile.type ? type.color : "#9CA3AF" }}>
                  {type.icon}
                </div>
                <div
                  className="font-semibold text-sm"
                  style={{ color: type.type === profile.type ? type.color : "#6B7280" }}
                >
                  {type.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>← 안정적</span>
            <span>공격적 →</span>
          </div>
        </div>

        {/* Asset Allocation & ETF Recommendations */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Asset Allocation Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">추천 자산 배분</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={profile.allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {profile.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {profile.allocation.map((asset) => (
                <div key={asset.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: asset.color }}></div>
                    <span className="font-medium text-gray-700">{asset.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ETF Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">추천 ETF 포트폴리오</h2>
            <div className="space-y-4">
              {profile.etfs.map((etf) => (
                <div key={etf.ticker} className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{etf.name}</div>
                      <div className="text-sm text-gray-500">{etf.ticker}</div>
                    </div>
                    <div className="text-xl font-bold" style={{ color: profile.color }}>
                      {etf.allocation}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{etf.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate("home")}
            className="px-8 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => onNavigate("signup-step1")}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: profile.color }}
          >
            지금 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
