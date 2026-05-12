import { useState, useEffect } from "react";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation" | "inquiry-detail";

interface Attachment {
  name: string;
  size: string;
  url?: string;
}

interface InquiryDetail {
  id: number;
  type: string;
  title: string;
  date: string;
  status: "대기" | "완료";
  content: string;
  userEmail: string;
  attachments?: Attachment[];
  adminResponse?: {
    date: string;
    content: string;
  };
}

interface InquiryDetailPageProps {
  onNavigate: (page: Page) => void;
  inquiryId?: number;
}

export function InquiryDetailPage({ onNavigate, inquiryId }: InquiryDetailPageProps) {
  const { isAuthenticated, currentUserEmail } = useAuth();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !currentUserEmail) {
      setAccessDenied(true);
      return;
    }

    // localStorage에서 문의 데이터 불러오기
    const savedInquiries = localStorage.getItem("inquiries");
    if (savedInquiries) {
      const inquiries: InquiryDetail[] = JSON.parse(savedInquiries);
      const currentInquiry = inquiries.find(inq => inq.id === inquiryId);

      // 본인의 문의인지 확인
      if (currentInquiry && currentInquiry.userEmail === currentUserEmail) {
        setInquiry(currentInquiry);
        setAccessDenied(false);
      } else {
        setAccessDenied(true);
      }
    } else {
      setAccessDenied(true);
    }
  }, [inquiryId, isAuthenticated, currentUserEmail]);

  if (accessDenied || !inquiry) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: "#F8FAFC" }}>
        {/* Blurred Background */}
        <div className="filter blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" style={{ minHeight: "400px" }}>
              <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Login Required Overlay */}
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md mx-4 text-center">
            {!isAuthenticated ? (
              <>
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
                    문의 상세 내역은 회원 전용 서비스입니다.
                  </p>
                  <p className="text-sm text-gray-500">
                    로그인 후 문의 내역을 확인하실 수 있습니다.
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
                    onClick={() => onNavigate("inquiry-list")}
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
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FEE2E2" }}>
                    <svg className="w-10 h-10" style={{ color: "#DC2626" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#1E293B" }}>
                    접근 권한이 없습니다
                  </h3>
                  <p className="text-gray-600 mb-2">
                    본인의 문의 내역만 조회할 수 있습니다.
                  </p>
                  <p className="text-sm text-gray-500">
                    다른 사용자의 문의는 확인하실 수 없습니다.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("inquiry-list")}
                  className="w-full py-4 rounded-lg transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: "#3B82F6",
                    color: "#FFFFFF",
                    fontWeight: "600",
                    fontSize: "16px"
                  }}
                >
                  목록으로 돌아가기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => onNavigate("inquiry-list")}
          className="flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "#64748B" }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontWeight: "500" }}>목록으로 돌아가기</span>
        </button>

        {/* Inquiry Detail Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: "#EEF2FF",
                      color: "#4F46E5",
                      fontWeight: "600"
                    }}
                  >
                    {inquiry.type}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: inquiry.status === "대기" ? "#FEF3C7" : "#DBEAFE",
                      color: inquiry.status === "대기" ? "#92400E" : "#1E40AF",
                      fontWeight: "600"
                    }}
                  >
                    {inquiry.status === "대기" ? "답변대기" : "답변완료"}
                  </span>
                </div>
                <h1 style={{ color: "#1E293B", fontWeight: "700", fontSize: "28px" }}>
                  {inquiry.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4" style={{ color: "#64748B", fontSize: "14px" }}>
              <span>문의번호: #{inquiry.id}</span>
              <span>•</span>
              <span>작성일: {inquiry.date}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="mb-8">
            <h2 style={{ color: "#1E293B", fontWeight: "600", fontSize: "18px", marginBottom: "16px" }}>
              문의 내용
            </h2>
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: "#F8FAFC",
                color: "#334155",
                fontSize: "15px",
                lineHeight: "1.8",
                whiteSpace: "pre-wrap"
              }}
            >
              {inquiry.content}
            </div>
          </div>

          {/* Attachments Section */}
          {inquiry.attachments && inquiry.attachments.length > 0 && (
            <div className="mb-8">
              <h2 style={{ color: "#1E293B", fontWeight: "600", fontSize: "18px", marginBottom: "16px" }}>
                첨부파일 ({inquiry.attachments.length})
              </h2>
              <div className="space-y-2">
                {inquiry.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{ borderColor: "#E2E8F0" }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" style={{ color: "#64748B" }} />
                      <div>
                        <p style={{ color: "#1E293B", fontWeight: "500" }}>{file.name}</p>
                        <p style={{ color: "#64748B", fontSize: "13px" }}>{file.size}</p>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: "#F1F5F9",
                        color: "#475569",
                        fontWeight: "500"
                      }}
                    >
                      <Download className="w-4 h-4" />
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Response Section */}
        {inquiry.status === "완료" && inquiry.adminResponse && (
          <div className="bg-white rounded-xl shadow-sm border-2 p-8" style={{ borderColor: "#DBEAFE" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#DBEAFE" }}>
                <span style={{ fontSize: "20px" }}>💬</span>
              </div>
              <div>
                <h2 style={{ color: "#1E293B", fontWeight: "600", fontSize: "18px" }}>
                  관리자 답변
                </h2>
                <p style={{ color: "#64748B", fontSize: "14px" }}>
                  답변일: {inquiry.adminResponse.date}
                </p>
              </div>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: "#F0F9FF",
                color: "#334155",
                fontSize: "15px",
                lineHeight: "1.8",
                whiteSpace: "pre-wrap"
              }}
            >
              {inquiry.adminResponse.content}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => onNavigate("inquiry-list")}
            className="px-6 py-3 rounded-lg transition-colors hover:opacity-90"
            style={{
              backgroundColor: "#F1F5F9",
              color: "#475569",
              fontWeight: "600"
            }}
          >
            목록으로
          </button>
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
      </div>
    </div>
  );
}
