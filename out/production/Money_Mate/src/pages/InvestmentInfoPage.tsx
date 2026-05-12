import { Lock, BarChart3, Coins, TrendingUp, Shield, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface InvestmentInfoPageProps {
  onNavigate: (page: Page) => void;
}

export function InvestmentInfoPage({ onNavigate }: InvestmentInfoPageProps) {
  const { isAuthenticated } = useAuth();
  const [activeMenu, setActiveMenu] = useState("투자 정보 안내");

  const menuContent: Record<string, { title: string; sections: { subtitle: string; content: string }[] }> = {
    "투자 정보 안내": {
      title: "투자 정보 안내",
      sections: [
        {
          subtitle: "투자 기본 개념",
          content: "투자는 자산을 증식시키기 위해 자금을 운용하는 활동입니다. 주식, 채권, 부동산, ETF 등 다양한 투자 상품이 있으며, 각각의 특성과 위험도가 다릅니다. 성공적인 투자를 위해서는 자신의 투자 목표와 위험 감수 능력을 명확히 파악하는 것이 중요합니다."
        },
        {
          subtitle: "ETF 소개",
          content: "ETF(상장지수펀드)는 특정 지수의 성과를 추종하는 펀드로, 주식처럼 거래소에서 실시간으로 매매할 수 있습니다. 소액으로도 분산 투자가 가능하며, 낮은 수수료와 높은 유동성이 장점입니다."
        },
        {
          subtitle: "리스크 설명",
          content: "모든 투자에는 리스크가 존재합니다. 시장 리스크, 신용 리스크, 유동성 리스크 등 다양한 위험 요소를 이해하고, 자신의 위험 감수 능력에 맞는 투자 전략을 수립해야 합니다. 과도한 레버리지나 한 종목 집중 투자는 피하는 것이 좋습니다."
        },
        {
          subtitle: "분산 투자 설명",
          content: "분산 투자는 여러 자산에 투자하여 위험을 분산시키는 전략입니다. '계란을 한 바구니에 담지 말라'는 격언처럼, 다양한 산업과 지역, 자산군에 투자하면 특정 자산의 손실을 다른 자산의 수익으로 상쇄할 수 있습니다."
        }
      ]
    },
    "ETF란?": {
      title: "ETF란?",
      sections: [
        {
          subtitle: "ETF 정의",
          content: "ETF(Exchange Traded Fund)는 특정 지수, 상품, 채권 또는 자산 바스켓을 추적하는 투자 펀드입니다. 일반 주식처럼 증권 거래소에서 거래되며, 하루 중 실시간으로 가격이 변동합니다."
        },
        {
          subtitle: "ETF 장점",
          content: "ETF의 주요 장점은 낮은 운용 수수료, 높은 유동성, 투명한 구성 종목, 소액 분산 투자 가능, 세금 효율성 등입니다. 개인 투자자도 기관 투자자 수준의 분산 투자를 할 수 있습니다."
        },
        {
          subtitle: "ETF와 주식 차이",
          content: "개별 주식은 한 기업에 투자하지만, ETF는 여러 종목에 분산 투자합니다. ETF는 한 번의 거래로 시장 전체 또는 특정 섹터에 투자할 수 있어 리스크가 분산되는 장점이 있습니다."
        },
        {
          subtitle: "ETF 투자 예시",
          content: "KODEX 200은 코스피 200 지수를 추종하며, 국내 대표 기업 200개에 분산 투자하는 효과가 있습니다. 테마형 ETF는 2차전지, 반도체, 바이오 등 특정 산업에 집중 투자할 수 있습니다."
        }
      ]
    },
    "절세방법": {
      title: "절세방법",
      sections: [
        {
          subtitle: "ISA 설명",
          content: "개인종합자산관리계좌(ISA)는 하나의 계좌에서 예금, 펀드, 주식 등을 통합 관리하며 세제 혜택을 받을 수 있는 상품입니다. 연 200만원(서민형 400만원)까지 수익에 대해 비과세 혜택이 있습니다."
        },
        {
          subtitle: "연금저축 설명",
          content: "연금저축은 노후 준비와 동시에 세액공제 혜택을 받을 수 있는 금융 상품입니다. 연 400만원까지 납입액의 최대 16.5%를 세액공제 받을 수 있어, 장기 투자와 절세 효과를 동시에 누릴 수 있습니다."
        },
        {
          subtitle: "절세 투자 전략",
          content: "장기 투자 시 절세 계좌를 활용하면 복리 효과가 극대화됩니다. ISA, 연금저축, IRP 등을 활용하여 투자 수익에 대한 세금을 최소화하고, 배당소득과 매매차익에 대한 세금 전략을 수립하세요."
        },
        {
          subtitle: "세금 유의사항",
          content: "금융소득이 연 2,000만원을 초과하면 종합과세 대상이 되어 높은 세율이 적용됩니다. 해외 주식 투자 시 250만원 이상의 양도차익에는 22%의 세금이 부과되므로, 연간 매매 계획을 세울 때 고려해야 합니다."
        }
      ]
    },
    "배당주 투자법": {
      title: "배당주 투자법",
      sections: [
        {
          subtitle: "배당주의 특징",
          content: "배당주는 정기적으로 배당금을 지급하는 기업의 주식입니다. 안정적인 현금 흐름을 보유한 성숙 기업들이 주로 배당을 실시하며, 주가 변동성이 상대적으로 낮고 장기 투자에 적합합니다."
        },
        {
          subtitle: "배당 수익률 설명",
          content: "배당수익률은 주가 대비 배당금의 비율입니다. 계산식은 (연간 배당금 ÷ 주가) × 100 입니다. 단, 높은 배당수익률이 항상 좋은 것은 아니며, 배당의 지속 가능성과 기업의 재무 건전성을 함께 확인해야 합니다."
        },
        {
          subtitle: "배당 투자 전략",
          content: "배당 귀족주(25년 이상 배당 증가)나 배당킹(50년 이상 배당)에 투자하면 안정적인 배당 수익을 기대할 수 있습니다. 배당금을 재투자하여 복리 효과를 누리는 것이 장기 자산 증식에 효과적입니다."
        },
        {
          subtitle: "장기 투자 예시",
          content: "국내 대표 배당주로는 통신, 금융, 유틸리티 섹터의 우량 기업들이 있습니다. 배당 ETF를 활용하면 한 번의 투자로 여러 배당주에 분산 투자할 수 있어 편리합니다."
        }
      ]
    },
    "금융 용어 사전": {
      title: "금융 용어 사전",
      sections: [
        {
          subtitle: "ETF (Exchange Traded Fund)",
          content: "상장지수펀드. 특정 지수의 수익률을 추종하도록 설계된 펀드로, 거래소에서 주식처럼 실시간 매매가 가능합니다."
        },
        {
          subtitle: "PER (Price Earning Ratio)",
          content: "주가수익비율. 주가를 주당순이익(EPS)으로 나눈 값으로, 주식이 고평가인지 저평가인지 판단하는 지표입니다. 낮을수록 저평가로 볼 수 있습니다."
        },
        {
          subtitle: "PBR (Price Book-value Ratio)",
          content: "주가순자산비율. 주가를 주당순자산(BPS)으로 나눈 값입니다. 1보다 낮으면 주가가 순자산보다 낮게 거래되고 있다는 의미입니다."
        },
        {
          subtitle: "CAGR (Compound Annual Growth Rate)",
          content: "연평균 성장률. 투자 기간 동안의 평균 수익률을 복리로 계산한 값으로, 장기 투자 성과를 평가할 때 사용됩니다."
        },
        {
          subtitle: "리밸런싱 (Rebalancing)",
          content: "포트폴리오의 자산 배분 비율을 원래 목표로 되돌리는 작업입니다. 주기적으로 리밸런싱하면 리스크를 관리하고 장기 수익을 개선할 수 있습니다."
        },
        {
          subtitle: "분산 투자 (Diversification)",
          content: "여러 자산에 투자하여 리스크를 분산시키는 투자 전략입니다. 한 자산의 손실을 다른 자산의 수익으로 상쇄할 수 있습니다."
        },
        {
          subtitle: "변동성 (Volatility)",
          content: "자산 가격의 변동 폭을 나타내는 지표입니다. 변동성이 높을수록 가격이 크게 움직이며, 리스크와 수익 가능성이 모두 큽니다."
        },
        {
          subtitle: "NASDAQ",
          content: "미국의 전자식 주식 거래소로, 주로 기술주가 상장되어 있습니다. 애플, 마이크로소프트, 아마존 등이 대표 종목입니다."
        },
        {
          subtitle: "KOSPI (Korea Composite Stock Price Index)",
          content: "한국종합주가지수. 한국 증권시장의 대표 지수로, 상장된 모든 종목의 시가총액을 기준으로 산출됩니다."
        }
      ]
    },
    "주린이 탈출 팁": {
      title: "주린이 탈출 팁",
      sections: [
        {
          subtitle: "초보 투자자 주의사항",
          content: "투자는 여유 자금으로만 하세요. 생활비나 비상금까지 투자하면 급하게 손실을 보고 팔아야 할 수 있습니다. 또한 소문이나 추천만 믿고 투자하지 말고, 직접 공부하고 이해한 후 투자하세요."
        },
        {
          subtitle: "장기 투자 팁",
          content: "단기 매매보다는 장기 투자가 초보자에게 유리합니다. 시장 타이밍을 맞추기는 전문가도 어렵습니다. 우량 기업이나 인덱스 ETF에 장기 투자하고, 정기적으로 적립식 투자하는 것을 추천합니다."
        },
        {
          subtitle: "감정 투자 방지",
          content: "시장이 폭락할 때 공포에 빠져 손절하거나, 폭등할 때 욕심에 물려 고점 매수하지 마세요. 미리 정한 원칙과 계획에 따라 투자하고, 감정적인 결정은 피하세요."
        },
        {
          subtitle: "포트폴리오 구성 기초",
          content: "나이와 투자 성향에 맞게 포트폴리오를 구성하세요. 젊을수록 주식 비중을 높이고, 나이가 들수록 채권 비중을 높이는 것이 일반적입니다. 국내외 자산을 적절히 배분하여 리스크를 분산하세요."
        }
      ]
    },
    "공지사항": {
      title: "공지사항",
      sections: [
        {
          subtitle: "서비스 점검 안내 (2026.05.15)",
          content: "시스템 업그레이드를 위해 5월 20일 새벽 2시부터 4시까지 서비스 점검이 진행됩니다. 점검 시간 동안 일시적으로 서비스 이용이 제한되오니 양해 부탁드립니다."
        },
        {
          subtitle: "신규 ETF 추가 (2026.05.10)",
          content: "글로벌 AI 테마 ETF 5종이 새롭게 추가되었습니다. 인공지능 관련 기업들에 분산 투자할 수 있는 상품으로, 포트폴리오 페이지에서 확인하실 수 있습니다."
        },
        {
          subtitle: "이벤트: 친구 초대 이벤트 (2026.05.01)",
          content: "친구를 초대하고 함께 투자하세요! 친구가 회원가입 후 첫 투자를 완료하면 추천인과 친구 모두에게 5만원 상당의 투자 지원금을 드립니다. 이벤트 기간은 5월 31일까지입니다."
        },
        {
          subtitle: "투자 세미나 안내 (2026.04.25)",
          content: "5월 25일 오후 7시, 온라인 투자 세미나가 개최됩니다. 주제는 '2026년 하반기 글로벌 시장 전망과 투자 전략'입니다. 무료 참여 가능하며, 마이페이지에서 사전 신청하실 수 있습니다."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">머니메이트 소개</h2>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveMenu("투자 정보 안내")}
                  className="w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: activeMenu === "투자 정보 안내" ? "#EBF5FF" : "transparent",
                    color: activeMenu === "투자 정보 안내" ? "#1D6AE5" : "#374151",
                  }}
                >
                  투자 정보 안내
                </button>

                <button
                  onClick={() => setActiveMenu("ETF란?")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: activeMenu === "ETF란?" ? "#EBF5FF" : "transparent",
                    color: activeMenu === "ETF란?" ? "#1D6AE5" : "#374151",
                    fontWeight: activeMenu === "ETF란?" ? 600 : 400,
                  }}
                >
                  ETF란?
                </button>

                <button
                  onClick={() => setActiveMenu("절세방법")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: activeMenu === "절세방법" ? "#EBF5FF" : "transparent",
                    color: activeMenu === "절세방법" ? "#1D6AE5" : "#374151",
                    fontWeight: activeMenu === "절세방법" ? 600 : 400,
                  }}
                >
                  절세방법
                </button>

                <button
                  onClick={() => setActiveMenu("배당주 투자법")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: activeMenu === "배당주 투자법" ? "#EBF5FF" : "transparent",
                    color: activeMenu === "배당주 투자법" ? "#1D6AE5" : "#374151",
                    fontWeight: activeMenu === "배당주 투자법" ? 600 : 400,
                  }}
                >
                  배당주 투자법
                </button>

                <button
                  onClick={() => setActiveMenu("금융 용어 사전")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: activeMenu === "금융 용어 사전" ? "#EBF5FF" : "transparent",
                    color: activeMenu === "금융 용어 사전" ? "#1D6AE5" : "#374151",
                    fontWeight: activeMenu === "금융 용어 사전" ? 600 : 400,
                  }}
                >
                  금융 용어 사전
                </button>

                <button
                  onClick={() => setActiveMenu("주린이 탈출 팁")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: activeMenu === "주린이 탈출 팁" ? "#EBF5FF" : "transparent",
                    color: activeMenu === "주린이 탈출 팁" ? "#1D6AE5" : "#374151",
                    fontWeight: activeMenu === "주린이 탈출 팁" ? 600 : 400,
                  }}
                >
                  주린이 탈출 팁
                </button>

                <button
                  onClick={() => setActiveMenu("공지사항")}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: activeMenu === "공지사항" ? "#EBF5FF" : "transparent",
                    color: activeMenu === "공지사항" ? "#1D6AE5" : "#374151",
                    fontWeight: activeMenu === "공지사항" ? 600 : 400,
                  }}
                >
                  공지사항
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {menuContent[activeMenu].title}
              </h1>

              <div className="space-y-8">
                {menuContent[activeMenu].sections.map((section, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {section.subtitle}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Banner for Non-logged Users */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2" style={{ borderColor: "#0052CC" }}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    더 많은 투자 인사이트가 기다립니다
                  </h3>
                  <p className="text-gray-600 mb-6">
                    로그인하고 전문가의 투자 가이드, 차트 분석, 포트폴리오 전략을 확인하세요.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => onNavigate("login")}
                      className="px-8 py-3 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: "#0052CC" }}
                    >
                      로그인하기
                    </button>
                    <button
                      onClick={() => onNavigate("signup-step1")}
                      className="px-8 py-3 rounded-lg font-semibold border-2 bg-white hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: "#0052CC",
                        color: "#0052CC",
                      }}
                    >
                      무료 회원가입
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
