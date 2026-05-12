import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "김민준",
    location: "서울 강남구",
    rating: 5,
    text: "투자 초보였는데 머니메이트 로보어드바이저 덕분에 안정적으로 자산을 늘리고 있어요. AI가 자동으로 포트폴리오를 조정해주니 신경 쓸 게 없어서 너무 편합니다!"
  },
  {
    name: "이서연",
    location: "경기 성남시",
    rating: 5,
    text: "여러 계좌에 흩어져 있던 자산을 한눈에 볼 수 있어서 정말 좋아요. 수익률 분석 기능도 훌륭하고, 투자 정보도 실시간으로 받아볼 수 있어서 만족스럽습니다."
  },
  {
    name: "박준호",
    location: "부산 해운대구",
    rating: 5,
    text: "3년째 머니메이트를 사용 중인데, 처음 가입했을 때보다 자산이 40% 이상 증가했어요. 위험도에 맞춰 자동으로 리밸런싱 해주는 기능이 정말 유용합니다!"
  },
  {
    name: "최지우",
    location: "서울 송파구",
    rating: 5,
    text: "바쁜 직장인이라 투자에 시간을 많이 못 쓰는데, 머니메이트가 알아서 관리해주니 걱정이 없어요. 고객센터 응대도 친절하고 세금 최적화 기능도 훌륭합니다!"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            고객 후기
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            머니메이트를 이용하는 고객들의 진솔한 후기를 확인해보세요. 실제 사용자들이 경험한 자산 관리의 변화를 소개합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="text-primary">{testimonial.name.charAt(0) + "**"}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}