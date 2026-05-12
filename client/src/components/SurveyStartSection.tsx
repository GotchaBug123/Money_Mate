import { TrendingUp } from "lucide-react";

interface SurveyStartSectionProps {
  onStartSurvey: () => void;
}

export function SurveyStartSection({ onStartSurvey }: SurveyStartSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-2xl p-12 shadow-xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="text-center text-white">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="rounded-full p-4"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <TrendingUp className="w-12 h-12" />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4" style={{ fontSize: "36px", fontWeight: "700" }}>
              나의 투자 성향 찾기
            </h2>

            {/* Subtitle */}
            <p className="mb-8 text-lg" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              30초만에 완성되는 AI 기반 ETF 포트폴리오 진단
            </p>

            {/* Features */}
            <div className="flex justify-center gap-8 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span className="text-sm">6가지 질문</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span className="text-sm">즉시 결과 확인</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span className="text-sm">맞춤 ETF 추천</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onStartSurvey}
              className="px-10 py-4 rounded-xl font-semibold text-lg transition-transform hover:scale-105 shadow-lg"
              style={{
                backgroundColor: "white",
                color: "#667eea",
              }}
            >
              무료로 진단 시작하기
            </button>

            <p className="mt-4 text-sm" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              로그인 없이 바로 시작 가능합니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
