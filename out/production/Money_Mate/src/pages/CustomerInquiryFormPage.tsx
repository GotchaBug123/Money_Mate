import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type InquiryType = "investment" | "returns" | "account" | "bug";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface CustomerInquiryFormPageProps {
  onNavigate: (page: Page) => void;
}

export function CustomerInquiryFormPage({ onNavigate }: CustomerInquiryFormPageProps) {
  const { isAuthenticated, currentUserEmail } = useAuth();
  const [selectedType, setSelectedType] = useState<InquiryType>("investment");
  const [email, setEmail] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [relatedItem, setRelatedItem] = useState("");
  const [title, setTitle] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");

  // 로그인한 사용자의 이메일 자동 입력
  useEffect(() => {
    if (isAuthenticated && currentUserEmail) {
      setEmail(currentUserEmail);
      setEmailConsent(true);
    }
  }, [isAuthenticated, currentUserEmail]);

  const inquiryTypes = [
    { id: "investment" as InquiryType, label: "투자/ETF 문의" },
    { id: "returns" as InquiryType, label: "수익률/분석 문의" },
    { id: "account" as InquiryType, label: "계정/로그인 문제" },
    { id: "bug" as InquiryType, label: "오류/버그 신고" }
  ];

  const handleSubmit = () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!inquiryContent.trim()) {
      alert("문의 내용을 입력해주세요.");
      return;
    }
    if (!emailConsent) {
      alert("이메일 수신 동의를 해주세요.");
      return;
    }

    // 문의 데이터 저장
    const existingInquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
    const newInquiry = {
      id: Date.now(),
      type: inquiryTypes.find(t => t.id === selectedType)?.label || "일반문의",
      title: title,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.'),
      status: "대기" as const,
      email,
      content: inquiryContent,
      relatedItem,
      userEmail: isAuthenticated && currentUserEmail ? currentUserEmail : email
    };

    localStorage.setItem("inquiries", JSON.stringify([newInquiry, ...existingInquiries]));

    console.log("문의 등록:", { selectedType, email, emailConsent, relatedItem, title, inquiryContent });
    onNavigate("inquiry-confirmation");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Sidebar Container */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">

            {/* Section 1: Inquiry Type */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ color: "#1E293B", fontWeight: "700" }}>[문의 유형 선택]</h3>
              <div className="space-y-3">
                {inquiryTypes.map((type) => (
                  <label key={type.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="inquiryType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={() => setSelectedType(type.id)}
                      className="w-4 h-4"
                      style={{ accentColor: "#3B82F6" }}
                    />
                    <span style={{ color: "#1E293B" }}>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mb-8" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Section 2: Email */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ color: "#1E293B", fontWeight: "700" }}>[이메일 입력] (필수)</h3>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: isAuthenticated ? "#F9FAFB" : "#FFFFFF" }}
                disabled={isAuthenticated}
              />
              {!isAuthenticated && (
                <p className="mt-2 text-sm" style={{ color: "#F59E0B" }}>
                  ⚠️ 비회원 문의는 이메일로 답변이 전송됩니다.
                </p>
              )}
              {isAuthenticated && (
                <p className="mt-2 text-sm" style={{ color: "#10B981" }}>
                  ✓ 회원 문의는 사이트 내 문의내역에서 확인 가능합니다.
                </p>
              )}
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailConsent}
                  onChange={(e) => setEmailConsent(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: "#3B82F6" }}
                  disabled={isAuthenticated}
                />
                <span style={{ color: "#64748B", fontSize: "14px" }}>이메일 수신 동의 ✓</span>
              </label>
            </div>

            {/* Divider */}
            <div className="mb-8" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Section 3: Related Items */}
            <div>
              <h3 className="mb-4" style={{ color: "#1E293B", fontWeight: "700" }}>[관련 항목 선택] (선택)</h3>
              <input
                type="text"
                value={relatedItem}
                onChange={(e) => setRelatedItem(e.target.value)}
                placeholder="ETF / 종목 검색 선택"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>
          </div>

          {/* Right Main Container */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">

            {/* Section 4: Title */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ color: "#1E293B", fontWeight: "700" }}>[제목] (필수)</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="문의 제목을 입력해주세요"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>

            {/* Divider */}
            <div className="mb-8" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Section 5: Description */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ color: "#1E293B", fontWeight: "700" }}>[문의 내용]</h3>
              <textarea
                value={inquiryContent}
                onChange={(e) => setInquiryContent(e.target.value)}
                placeholder="내용 입력 영역"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "#FFFFFF", minHeight: "200px", resize: "vertical" }}
              />
            </div>

            {/* Divider */}
            <div className="mb-8" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Section 6: File Attachment */}
            <div className="mb-8">
              <h3 className="mb-4" style={{ color: "#1E293B", fontWeight: "700" }}>[파일 첨부] (선택)</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12" style={{ color: "#94A3B8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p style={{ color: "#64748B" }}>파일을 드래그하거나 클릭하여 업로드</p>
                  <p style={{ color: "#94A3B8", fontSize: "12px" }}>PNG, JPG, PDF (최대 10MB)</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-8" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Action Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-lg transition-all"
              style={{
                backgroundColor: emailConsent ? "#3B82F6" : "#94A3B8",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "16px",
                cursor: emailConsent ? "pointer" : "not-allowed",
                opacity: emailConsent ? 1 : 0.6
              }}
            >문의 등록</button>
          </div>

        </div>
      </div>

      {/* Support Channels Section */}
      <div style={{ backgroundColor: "#F0F4F8" }} className="py-16">
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
