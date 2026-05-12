import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type InquiryTab = "create" | "mylist";
type SubMenu = "inquiry-history" | "faq" | "contact" | "notices";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation" | "inquiry-detail";

interface Inquiry {
  id: number;
  type: string;
  title: string;
  date: string;
  status: "대기" | "완료";
  userEmail: string;
}

interface InquiryListPageProps {
  onNavigate: (page: Page) => void;
  onViewDetail?: (id: number) => void;
}

export function InquiryListPage({ onNavigate, onViewDetail }: InquiryListPageProps) {
  const { isAuthenticated, currentUserEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<InquiryTab>("create");
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>("inquiry-history");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // localStorage에서 현재 사용자의 문의 내역만 불러오기
  useEffect(() => {
    if (!isAuthenticated || !currentUserEmail) {
      setInquiries([]);
      return;
    }

    const savedInquiries = localStorage.getItem("inquiries");
    if (savedInquiries) {
      const parsed = JSON.parse(savedInquiries);
      // 현재 로그인한 사용자의 문의만 필터링
      const userInquiries = parsed.filter((inquiry: Inquiry) => inquiry.userEmail === currentUserEmail);
      setInquiries(userInquiries);
    }
  }, [isAuthenticated, currentUserEmail]);

  const totalCount = inquiries.length;
  const waitingCount = inquiries.filter(i => i.status === "대기").length;
  const completedCount = inquiries.filter(i => i.status === "완료").length;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Main Content Area */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${activeTab === "mylist" && !isAuthenticated ? "filter blur-sm" : ""}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

          {/* Tabs */}
          <div className="flex items-center gap-8 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("create")}
              className="pb-3 px-2 transition-colors"
              style={{
                color: activeTab === "create" ? "#1E293B" : "#64748B",
                fontWeight: activeTab === "create" ? "700" : "400",
                borderBottom: activeTab === "create" ? "3px solid #3B82F6" : "none"
              }}
            >
              [문의하기]
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab("mylist")}
                className="pb-3 px-2 transition-colors"
                style={{
                  color: activeTab === "mylist" ? "#1E293B" : "#64748B",
                  fontWeight: activeTab === "mylist" ? "700" : "400",
                  borderBottom: activeTab === "mylist" ? "3px solid #3B82F6" : "none"
                }}
              >
                [나의 문의내역]
              </button>
            )}
          </div>

          {activeTab === "mylist" && !isAuthenticated && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">로그인이 필요한 서비스입니다.</p>
              <button
                onClick={() => onNavigate("login")}
                className="px-6 py-3 rounded-lg transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  fontWeight: "600"
                }}
              >
                로그인하기
              </button>
            </div>
          )}

          {activeTab === "mylist" && isAuthenticated && (
            <>
              {/* Summary Dashboard */}
              <div className="mb-8 flex items-center gap-4">
                <span style={{ color: "#1E293B", fontWeight: "600" }}>나의 문의 현황:</span>
                <div className="flex items-center gap-3">
                  <div
                    className="px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: "#F1F5F9", color: "#1E293B", fontWeight: "600" }}
                  >
                    전체 {totalCount}
                  </div>
                  <div
                    className="px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: "600" }}
                  >
                    답변대기 {waitingCount}
                  </div>
                  <div
                    className="px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: "#DBEAFE", color: "#1E40AF", fontWeight: "600" }}
                  >
                    답변완료 {completedCount}
                  </div>
                </div>
              </div>

              {/* Inquiry Data Table */}
              <div className="overflow-x-auto">
                {inquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">문의 내역이 없습니다.</p>
                    <button
                      onClick={() => onNavigate("customer-inquiry-form")}
                      className="px-6 py-3 rounded-lg transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: "#3B82F6",
                        color: "#FFFFFF",
                        fontWeight: "600"
                      }}
                    >
                      첫 문의 작성하기
                    </button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "2px solid #E2E8F0" }}>
                        <th className="text-left py-4 px-4" style={{ color: "#64748B", fontWeight: "600" }}>번호</th>
                        <th className="text-left py-4 px-4" style={{ color: "#64748B", fontWeight: "600" }}>유형</th>
                        <th className="text-left py-4 px-4" style={{ color: "#64748B", fontWeight: "600" }}>제목</th>
                        <th className="text-left py-4 px-4" style={{ color: "#64748B", fontWeight: "600" }}>날짜</th>
                        <th className="text-left py-4 px-4" style={{ color: "#64748B", fontWeight: "600" }}>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td className="py-4 px-4" style={{ color: "#1E293B" }}>{inquiry.id}</td>
                          <td className="py-4 px-4" style={{ color: "#64748B" }}>{inquiry.type}</td>
                          <td className="py-4 px-4" style={{ color: "#1E293B", fontWeight: "500" }}>
                            <button
                              onClick={() => onViewDetail?.(inquiry.id)}
                              className="hover:text-blue-600 transition-colors text-left"
                            >
                              {inquiry.title}
                            </button>
                          </td>
                          <td className="py-4 px-4" style={{ color: "#64748B" }}>{inquiry.date}</td>
                          <td className="py-4 px-4">
                            <span
                              className="px-3 py-1 rounded-full text-sm"
                              style={{
                                backgroundColor: inquiry.status === "대기" ? "#F1F5F9" : "#DBEAFE",
                                color: inquiry.status === "대기" ? "#64748B" : "#1E40AF",
                                fontWeight: "600"
                              }}
                            >
                              {inquiry.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination & Action Button */}
              {inquiries.length > 0 && (
                <div className="flex items-center justify-between mt-8">
                  {/* Pagination */}
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 hover:bg-gray-100 rounded" style={{ color: "#64748B" }}>
                        &lt;
                      </button>
                      <button
                        className="px-3 py-1 rounded"
                        style={{ backgroundColor: "#3B82F6", color: "#FFFFFF", fontWeight: "600" }}
                      >
                        1
                      </button>
                      <button className="px-3 py-1 hover:bg-gray-100 rounded" style={{ color: "#64748B" }}>
                        &gt;
                      </button>
                    </div>
                  </div>

                  {/* Create New Inquiry Button */}
                  <button
                    onClick={() => onNavigate("customer-inquiry-form")}
                    className="px-6 py-3 rounded-lg transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                      fontWeight: "600"
                    }}
                  >
                    새 문의 작성
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "create" && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">문의하실 내용을 작성해주세요.</p>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mb-6">
                  비회원 문의는 이메일로 답변이 전송됩니다.
                </p>
              )}
              <button
                onClick={() => onNavigate("customer-inquiry-form")}
                className="px-6 py-3 rounded-lg transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  fontWeight: "600"
                }}
              >
                문의 작성하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Required Overlay */}
      {activeTab === "mylist" && !isAuthenticated && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md mx-4 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#DBEAFE" }}>
                <svg className="w-10 h-10" style={{ color: "#3B82F6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#1E293B" }}>
                로그인이 필요합니다
              </h3>
              <p className="text-gray-600 mb-2">
                문의 내역은 회원 전용 서비스입니다.
              </p>
              <p className="text-sm text-gray-500">
                로그인 후 나의 문의 내역을 확인하실 수 있습니다.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate("login")}
                className="w-full py-4 rounded-lg transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: "16px"
                }}
              >
                로그인하기
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className="w-full py-4 rounded-lg transition-colors hover:bg-gray-100"
                style={{
                  backgroundColor: "#F1F5F9",
                  color: "#475569",
                  fontWeight: "600",
                  fontSize: "16px"
                }}
              >
                문의하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Channels Section */}
      <div style={{ backgroundColor: "#F0F4F8" }} className={`py-16 ${activeTab === "mylist" && !isAuthenticated ? "filter blur-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ color: "#1E293B", fontWeight: "700", fontSize: "32px" }}>
              고객센터
            </h2>
            <p className="mb-8" style={{ color: "#64748B", fontSize: "16px" }}>
              궁금하신 점이 있으시면 언제든지 문의해 주세요. 전문 상담팀이 도와드리겠습니다.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="무엇을 도와드릴까요?"
                  className="w-full px-6 py-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "#FFFFFF" }}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6" style={{ color: "#64748B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Three-Column Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Phone Support */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <span style={{ fontSize: "24px" }}>📞</span>
                <h3 style={{ color: "#1E293B", fontWeight: "600", fontSize: "18px" }}>전화 상담</h3>
              </div>
              <div className="mb-6">
                <p style={{ color: "#1E293B", fontWeight: "700", fontSize: "20px" }}>1588-0000</p>
                <p style={{ color: "#64748B", fontSize: "14px" }}>평일 09:00 - 18:00</p>
              </div>
              <button
                className="w-full py-3 rounded-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  fontWeight: "600"
                }}
              >
                전화 걸기
              </button>
            </div>

            {/* Card 2: Chat Support */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <span style={{ fontSize: "24px" }}>💬</span>
                <h3 style={{ color: "#1E293B", fontWeight: "600", fontSize: "18px" }}>채팅 상담</h3>
              </div>
              <div className="mb-6">
                <p style={{ color: "#1E293B", fontWeight: "700", fontSize: "20px" }}>실시간 1:1 채팅</p>
                <p style={{ color: "#64748B", fontSize: "14px" }}>평균 응답 시간: 3분</p>
              </div>
              <button
                className="w-full py-3 rounded-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#10B981",
                  color: "#FFFFFF",
                  fontWeight: "600"
                }}
              >
                채팅 시작
              </button>
            </div>

            {/* Card 3: Email Support */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <span style={{ fontSize: "24px" }}>✉️</span>
                <h3 style={{ color: "#1E293B", fontWeight: "600", fontSize: "18px" }}>이메일 문의</h3>
              </div>
              <div className="mb-6">
                <p style={{ color: "#1E293B", fontWeight: "700", fontSize: "16px" }}>support@moneymate.com</p>
                <p style={{ color: "#64748B", fontSize: "14px" }}>24시간 이내 답변</p>
              </div>
              <button
                className="w-full py-3 rounded-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  fontWeight: "600"
                }}
              >
                이메일 보내기
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
