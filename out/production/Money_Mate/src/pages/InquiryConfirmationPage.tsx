type Page = "home" | "login" | "dashboard" | "my-assets" | "portfolio" | "investment-info" | "support" |
  "account-management" | "settings" | "my-robo" | "analysis" | "asset-summary" |
  "asset-allocation" | "holdings" | "returns" | "favorites" | "notifications" | "notification-settings" |
  "signup-step1" | "signup-step2" | "find-id" | "find-password" | "inquiry-list" | "customer-inquiry" | "customer-inquiry-form" | "inquiry-confirmation";

interface InquiryConfirmationPageProps {
  onNavigate: (page: Page) => void;
}

export function InquiryConfirmationPage({ onNavigate }: InquiryConfirmationPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Main Confirmation Container */}
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-gray-50 rounded-xl p-12 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-6">

            {/* Main Heading */}
            <div className="border-2 border-gray-300 rounded-lg px-6 py-3">
              <h2 style={{ color: "#1E293B", fontWeight: "700", fontSize: "18px" }}>
                | 문의가 정상적으로 접수되었습니다 ✓ |
              </h2>
            </div>

            {/* Instruction 1 */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "20px" }}>📩</span>
              <p style={{ color: "#475569", fontSize: "15px" }}>입력하신 이메일로 답변이 전달됩니다</p>
            </div>

            {/* Divider 1 */}
            <div className="w-full" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Response Time */}
            <div className="flex items-center gap-2">
              <span style={{ fontSize: "20px" }}>⏱️</span>
              <p style={{ color: "#475569", fontSize: "15px" }}>예상 답변 소요 시간: 3일 이내</p>
            </div>

            {/* Divider 2 */}
            <div className="w-full" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Notes Section */}
            <div className="space-y-2 w-full">
              <p style={{ color: "#64748B", fontSize: "14px" }}>※ 정확한 답변을 위해 문의 내용을 검토 중입니다</p>
              <p style={{ color: "#64748B", fontSize: "14px" }}>※ 추가 문의는 동일 이메일로 다시 작성해 주세요</p>
            </div>

            {/* Divider 3 */}
            <div className="w-full" style={{ borderTop: "2px dashed #CBD5E1" }}></div>

            {/* Primary Action */}
            <button
              onClick={() => onNavigate("home")}
              className="px-8 py-3 rounded-lg transition-all hover:opacity-80"
              style={{
                color: "#3B82F6",
                fontWeight: "600",
                fontSize: "15px",
                border: "2px solid #3B82F6",
                backgroundColor: "transparent"
              }}
            >
              [홈으로 이동]
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
