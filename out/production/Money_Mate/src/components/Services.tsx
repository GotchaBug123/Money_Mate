import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  TrendingUp, 
  Target, 
  Briefcase, 
  Settings, 
  CheckCircle, 
  Zap,
  GraduationCap,
  Clock
} from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "초보 투자자",
    description: "투자가 처음이신가요? 머니메이트가 기초부터 차근차근 안내해드립니다.",
    features: [
      "재무 용어 설명 및 기초 교육",
      "리스크 성향 분석",
      "소액 투자로 시작하는 포트폴리오",
      "실시간 투자 가이드"
    ]
  },
  {
    icon: Briefcase,
    title: "사회초년생",
    description: "첫 월급부터 체계적으로 관리하며 목표를 달성하세요.",
    features: [
      "월급 기반 자동 저축 설정",
      "목표 달성 시뮬레이션",
      "지출 패턴 분석",
      "맞춤형 재무 계획"
    ]
  },
  {
    icon: Clock,
    title: "바쁜 직장인",
    description: "시간이 없어도 괜찮습니다. AI가 자동으로 포트폴리오를 관리합니다.",
    features: [
      "자동 리밸런싱",
      "24/7 시장 모니터링",
      "알림 기반 의사결정 지원",
      "간편한 원클릭 투자"
    ]
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4 font-bold">
            전 세대를 아우르는<br />
            <span style={{ color: "#1D6AE5" }}>머니메이트만의 특징</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            당신의 재무 목표와 라이프스타일에 맞춘 맞춤형 로보어드바이저 서비스
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow border-2"
              style={{ 
                borderColor: "#E0F2FE",
                background: "white"
              }}
            >
              <CardHeader>
                <div 
                  className="h-16 w-16 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#E0F2FE" }}
                >
                  <service.icon 
                    className="h-8 w-8" 
                    style={{ color: "#1D6AE5" }}
                  />
                </div>
                <CardTitle className="text-xl" style={{ color: "#1D6AE5" }}>
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                      <CheckCircle 
                        className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" 
                        style={{ color: "#00C896" }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    border: "1px solid #1D6AE5",
                    color: "#1D6AE5",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "500",
                    background: "white",
                    cursor: "pointer",
                    width: "100%",
                    marginTop: "24px"
                  }}
                >
                  자세히 보기
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}