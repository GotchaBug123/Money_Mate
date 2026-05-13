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

  const [
    showInfoModal,
    setShowInfoModal,
  ] = useState(false);

  const [
    infoType,
    setInfoType,
  ] = useState<FinancialInfoType>(null);

  const handleClick = (
    page: Page
  ) => {

    onNavigate(page);
  };

  const handleShowInfo = (
    type: FinancialInfoType
  ) => {

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

      default:
        return null;
    }
  };

  return (

    <footer className="bg-gray-900 text-white">

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

                <span>
                  1588-0000
                </span>

              </div>

              <div className="flex items-center text-gray-300">

                <Mail className="h-4 w-4 mr-3" />

                <span>
                  support@moneymate.kr
                </span>

              </div>

              <div className="flex items-center text-gray-300">

                <MapPin className="h-4 w-4 mr-3" />

                <span>
                  충남 천안시 동남구 안서동 115
                </span>

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
                  onClick={() =>
                    handleClick("my-robo")
                  }
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
                  onClick={() =>
                    handleClick("portfolio")
                  }
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
                  onClick={() =>
                    handleClick("dashboard")
                  }
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
                  onClick={() =>
                    handleClick("investment-info")
                  }
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
                  onClick={() =>
                    handleClick("support")
                  }
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
                  onClick={() =>
                    handleShowInfo("terms")
                  }
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
                  onClick={() =>
                    handleShowInfo("privacy")
                  }
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
                  onClick={() =>
                    handleShowInfo("investment")
                  }
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
                  onClick={() =>
                    handleShowInfo("electronic")
                  }
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
                  onClick={() =>
                    handleShowInfo("glossary")
                  }
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

            © 2026 MoneyMate.
            All rights reserved.

          </p>

        </div>

      </div>

      {/* Financial Info Modal */}

      {showInfoModal && (

        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor:
              "rgba(255, 255, 255, 0.95)",
            color: "#000",
          }}
          onClick={() =>
            setShowInfoModal(false)
          }
        >

          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
            style={{ color: "#000" }}
            onClick={(e) =>
              e.stopPropagation()
            }
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
                onClick={() =>
                  setShowInfoModal(false)
                }
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
                onClick={() =>
                  setShowInfoModal(false)
                }
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >

                닫기

              </button>

            </div>

          </div>

        </div>
      )}

    </footer>
  );
}