import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Phone, Mail, MessageCircle, HelpCircle, FileText, Clock } from "lucide-react";

export function Support() {
  const faqs = [
    {
      question: "MoneyMate는 어떤 서비스인가요?",
      answer: "MoneyMate는 AI 기반 개인 자산 관리 플랫폼으로, 투자 포트폴리오 관리, 재무 계획, 시장 분석 등을 제공합니다."
    },
    {
      question: "수수료는 어떻게 되나요?",
      answer: "기본 서비스는 무료이며, 프리미엄 기능은 월 9,900원부터 시작합니다. 자세한 요금제는 포트폴리오 페이지에서 확인하실 수 있습니다."
    },
    {
      question: "데이터 보안은 어떻게 관리되나요?",
      answer: "금융권 수준의 암호화 기술과 다단계 인증을 통해 고객님의 소중한 자산 정보를 안전하게 보호합니다."
    },
    {
      question: "투자 상담은 어떻게 받을 수 있나요?",
      answer: "앱 내 채팅 상담, 이메일, 전화 등 다양한 채널로 전문 상담사와 연결하실 수 있습니다."
    }
  ];

  return (
    <section id="support" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            고객센터
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            궁금하신 점이 있으시면 언제든지 문의해 주세요. 전문 상담팀이 도와드리겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Channels */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" style={{ color: "#1D6AE5" }} />
                전화 상담
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 font-semibold">1588-0000</p>
              <p className="text-sm text-gray-500 mt-1">평일 09:00 - 18:00</p>
              <Button
                className="mt-4 w-full"
                style={{ backgroundColor: "#1D6AE5" }}
              >
                전화 걸기
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" style={{ color: "#00C896" }} />
                채팅 상담
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">실시간 1:1 채팅</p>
              <p className="text-sm text-gray-500 mt-1">평균 응답 시간: 3분</p>
              <Button
                className="mt-4 w-full"
                style={{ backgroundColor: "#00C896" }}
              >
                채팅 시작
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" style={{ color: "#1D6AE5" }} />
                이메일 문의
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">support@moneymate.com</p>
              <p className="text-sm text-gray-500 mt-1">24시간 이내 답변</p>
              <Button
                className="mt-4 w-full"
                style={{ backgroundColor: "#1D6AE5" }}
              >
                이메일 보내기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 mr-2" style={{ color: "#1D6AE5" }} />
              자주 묻는 질문
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" style={{ color: "#00C896" }} />
                도움말 센터
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                서비스 이용 가이드, 튜토리얼 영상, 사용 팁 등 다양한 자료를 확인하세요.
              </p>
              <Button variant="outline" className="w-full">
                도움말 보기
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" style={{ color: "#00C896" }} />
                운영 시간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-600">
                <p><strong>고객센터:</strong> 평일 09:00 - 18:00</p>
                <p><strong>긴급 문의:</strong> 24시간 (이메일)</p>
                <p><strong>휴무:</strong> 주말 및 공휴일</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
