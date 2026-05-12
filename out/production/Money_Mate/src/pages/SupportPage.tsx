import { useState } from "react";
import { Phone, Mail, MessageCircle, HelpCircle, FileText, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "MoneyMate는 어떤 서비스인가요?",
      answer:
        "MoneyMate는 AI 기반 개인 자산 관리 플랫폼으로, 투자 포트폴리오 관리, 재무 계획, 시장 분석 등을 제공합니다.",
    },
    {
      question: "수수료는 어떻게 되나요?",
      answer:
        "기본 서비스는 무료이며, 프리미엄 기능은 월 9,900원부터 시작합니다. 자세한 요금제는 포트폴리오 페이지에서 확인하실 수 있습니다.",
    },
    {
      question: "데이터 보안은 어떻게 관리되나요?",
      answer:
        "금융권 수준의 암호화 기술과 다단계 인증을 통해 고객님의 소중한 자산 정보를 안전하게 보호합니다.",
    },
    {
      question: "투자 상담은 어떻게 받을 수 있나요?",
      answer:
        "앱 내 채팅 상담, 이메일, 전화 등 다양한 채널로 전문 상담사와 연결하실 수 있습니다.",
    },
    {
      question: "계좌 연동은 어떻게 하나요?",
      answer:
        "설정 메뉴에서 금융기관 선택 후 공인인증서 또는 간편인증으로 계좌를 연동할 수 있습니다.",
    },
    {
      question: "자동 투자 기능이 있나요?",
      answer:
        "네, AI 로보어드바이저가 고객님의 투자 성향에 맞춰 자동으로 포트폴리오를 관리합니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        

        {/* Contact Channels */}
        

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
            <HelpCircle className="h-7 w-7" style={{ color: "#1D6AE5" }} />
            자주 묻는 질문
          </h2>

          {/* FAQ Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="질문을 검색하세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-base rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.filter((faq) =>
              faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg" style={{ color: "#1D6AE5" }}>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: "#00C896" }} />
                도움말 센터
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                서비스 이용 가이드, 튜토리얼 영상, 사용 팁 등 다양한 자료를
                확인하세요.
              </p>
              <Button variant="outline" className="w-full">
                도움말 보기
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: "#00C896" }} />
                운영 시간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>고객센터:</strong> 평일 09:00 - 18:00
                </p>
                <p>
                  <strong>긴급 문의:</strong> 24시간 (이메일)
                </p>
                <p>
                  <strong>휴무:</strong> 주말 및 공휴일
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
