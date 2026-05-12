import { Card, CardContent } from "./ui/card";
import { Users, TrendingUp, Shield, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  const stats = [
    { icon: Users, number: "50,000+", label: "가입 고객" },
    { icon: TrendingUp, number: "5조원+", label: "운용 자산" },
    { icon: Shield, number: "98.5%", label: "고객 만족도" },
    { icon: Clock, number: "24/7", label: "실시간 모니터링" }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-6">
              머니메이트 소개
            </h2>
            <p className="text-lg text-gray-600 mb-6">머니메이트는 2026년 설립된 대한민국 대표 로보어드바이저 플랫폼입니다. AI 기반 자산 관리 시스템을 통해 개인 투자자들에게 전문가 수준의 포트폴리오 관리 서비스를 제공하고 있습니다. 복잡한 투자를 쉽고 똑똑하게 만드는 것이 저희의 미션입니다.</p>
            <p className="text-lg text-gray-600 mb-6">
              저희는 빅데이터 분석과 머신러닝 알고리즘을 활용하여 각 고객의 투자 성향, 목표 수익률, 리스크 허용도에 최적화된 맞춤형 포트폴리오를 구성합니다. 시장 변동성에 따라 자동으로 리밸런싱을 수행하며, 세금 최적화 전략을 통해 실질 수익률을 극대화합니다.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              금융위원회 인가를 받은 투자일임업자로서, 엄격한 보안 체계와 투명한 운용 원칙을 바탕으로 고객 자산을 안전하게 관리합니다. 24시간 실시간 모니터링 시스템을 통해 언제 어디서나 내 자산 현황을 확인하고, AI 기반 투자 인사이트를 받아보실 수 있습니다.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-4">
                  <CardContent className="p-0">
                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl text-primary mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="AI 기반 자산 관리 대시보드"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}