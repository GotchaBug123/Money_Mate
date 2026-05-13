import { Separator } from "./ui/separator";
import { Phone, Mail, MapPin, X } from "lucide-react";
import { useState } from "react";

type Page =
  | "home"
  | "login"
  | "dashboard"
  | "my-assets"
  | "portfolio"
  | "investment-info"
  | "support"
  | "account-management"
  | "settings"
  | "my-robo"
  | "analysis"
  | "asset-summary"
  | "asset-allocation"
  | "holdings"
  | "returns"
  | "favorites"
  | "notifications"
  | "notification-settings"
  | "signup-step1"
  | "signup-step2"
  | "find-id"
  | "find-password"
  | "inquiry-list"
  | "customer-inquiry"
  | "customer-inquiry-form"
  | "inquiry-confirmation";

type FinancialInfoType =
  | "terms"
  | "privacy"
  | "investment"
  | "electronic"
  | "glossary"
  | null;

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

export function Footer({
  onNavigate = () => {},
}: FooterProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoType, setInfoType] = useState<FinancialInfoType>(null);

  const handleClick = (page: Page) => {
    onNavigate(page);
  };

  const handleShowInfo = (type: FinancialInfoType) => {
    setInfoType(type);
    setShowInfoModal(true);
  };

  const getInfoTitle = () => {
    switch (infoType) {
      case "terms":
        return "이용약관";
      case "privacy":
        return "개인정보처리방침";
      case "investment":
        return "투자유의사항";
      case "electronic":
        return "전자금융거래약관";
      case "glossary":
        return "금융용어사전";
      default:
        return "";
    }
  };

  const getInfoContent = () => {
    switch (infoType) {
      case "terms":
        return (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              MoneyMate는 사용자의 금융 데이터를 기반으로 자산 분석 및 투자 관련 정보를 제공하는 서비스입니다.
            </p>
            <p>
              본 서비스는 투자자문이 아닌 정보 제공 목적이며, 최종 투자 결정의 책임은 사용자 본인에게 있습니다.
            </p>
            <p>
              회사는 서비스의 안정적인 제공을 위해 필요한 범위 내에서 데이터를 처리하며, 관련 법령과 개인정보처리방침을 준수합니다.
            </p>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              수집된 금융 정보는 성명, 계좌번호 등 직접 식별 가능한 정보가 제거된 비식별화 처리를 거쳐 분석에만 활용됩니다.
            </p>
            <p>
              사용자의 지출 내역은 자산 분석 및 시뮬레이션 외 용도로 활용되지 않습니다.
            </p>
            <p>
              개인정보는 회원 탈퇴 또는 수집 목적 달성 시 관련 법령에 따라 안전하게 파기됩니다.
            </p>
          </div>
        );

      case "investment":
        return (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p className="font-bold text-red-600">
              투자에는 원금 손실 위험이 있습니다.
            </p>
            <p>
              MoneyMate의 ETF 추천 및 시뮬레이션은 과거 데이터 기반 분석이며 미래 수익을 보장하지 않습니다.
            </p>
            <p>
              추천 근거는 최근 3년 평균 ROE, 부채비율, 시장 데이터 등을 기반으로 하며 참고용 정보입니다.
            </p>
            <p>
              투자 책임은 사용자 본인에게 있습니다.
            </p>
          </div>
        );

      case "electronic":
        return (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              전자금융거래 이용 시 사용자는 본인의 접근매체를 안전하게 관리해야 합니다.
            </p>
            <p>
              시스템 장애, 통신 오류 등으로 거래 처리에 지연이 발생할 수 있으며, 회사는 장애 발생 시 복구 조치를 진행합니다.
            </p>
            <p>
              전자금융거래 기록은 관련 법령에 따라 일정 기간 보관될 수 있습니다.
            </p>
          </div>
        );

      case "glossary":
        return (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              <span className="font-bold text-blue-600">ETF</span>: 특정 지수나 자산군을 추종하는 상장지수펀드입니다.
            </p>
            <p>
              <span className="font-bold text-blue-600">로보어드바이저</span>: 알고리즘을 기반으로 투자 성향과 목표에 맞는 포트폴리오 정보를 제공하는 서비스입니다.
            </p>
            <p>
              <span className="font-bold text-blue-600">리밸런싱</span>: 포트폴리오의 자산 비중을 목표 비율에 맞게 다시 조정하는 작업입니다.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <footer className="bg-gray-900 text-white pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl mb-4">
                <span className="text-white">
                  MoneyMate
                </span>

                <span className="text-blue-400 ml-2">
                  머니메이트
                </span>
              </div>

              <p className="text-gray-300 mb-6 max-w-md">
                AI 기반 로보어드바이저 투자 플랫폼.
                스마트한 자산관리와 포트폴리오 분석을 통해
                최적의 투자 솔루션을 제공합니다.
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-3" />
                  <span>1588-0000</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3" />
                  <span>support@moneymate.kr</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span>충남 천안시 동남구 안서동 115</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg mb-4">
                서비스
              </h3>

              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    type="button"
                    onClick={() => handleClick("my-robo")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    로보어드바이저
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleClick("portfolio")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    포트폴리오
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleClick("dashboard")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    대시보드
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleClick("investment-info")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    투자정보
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleClick("support")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    고객센터
                  </button>
                </li>
              </ul>
            </div>

            {/* Financial Info */}
            <div>
              <h3 className="text-lg mb-4">
                금융정보
              </h3>

              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    type="button"
                    onClick={() => handleShowInfo("terms")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    이용약관
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleShowInfo("privacy")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    개인정보처리방침
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleShowInfo("investment")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    투자유의사항
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleShowInfo("electronic")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    전자금융거래약관
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => handleShowInfo("glossary")}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: "inherit",
                      color: "inherit",
                      textAlign: "left",
                    }}
                  >
                    금융용어사전
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2026 MoneyMate. All rights reserved.
            </p>
          </div>
        </div>

        {/* Financial Info Modal */}
        {showInfoModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "#000",
            }}
            onClick={() => setShowInfoModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
              style={{ color: "#000" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between p-6 border-b"
                style={{ color: "#000" }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "#111" }}
                >
                  {getInfoTitle()}
                </h2>

                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div
                className="p-6 overflow-y-auto max-h-[60vh]"
                style={{ color: "#000" }}
              >
                {getInfoContent()}
              </div>

              <div className="flex justify-end p-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </footer>

      {/* Fixed Investment Notice */}
      <div className="fixed bottom-0 left-0 w-full z-[999] bg-[#111827] border-t border-[#374151] px-4 py-3 text-center shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-[11px] md:text-[12px] text-gray-300 leading-relaxed font-medium">
          <span>
            MoneyMate는 정보 제공 서비스이며, 투자 손실에 대한 책임을 지지 않습니다.
          </span>

          <span className="hidden md:block text-gray-500">
            |
          </span>

          <span className="text-blue-300">
            Source: Yahoo Finance
          </span>

          <span className="hidden md:block text-gray-500">
            |
          </span>

          <span className="text-red-300">
            투자 책임은 본인에게 있습니다.
          </span>
        </div>
      </div>
    </>
  );
}