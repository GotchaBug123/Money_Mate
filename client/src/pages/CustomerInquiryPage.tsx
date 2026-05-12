import { useState } from "react";

type InquiryTab = "create" | "mylist";
type SubMenu = "inquiry-history" | "faq" | "contact" | "notices";

interface Inquiry {
  id: number;
  type: string;
  title: string;
  date: string;
  status: "대기" | "완료";
}

export function CustomerInquiryPage() {
  const [activeTab, setActiveTab] = useState<InquiryTab>("mylist");
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>("contact");

  const inquiries: Inquiry[] = [
    {
      id: 2,
      type: "지출분석",
      title: "마이데이터 연동오류...",
      date: "2024.10.24.",
      status: "대기"
    },
    {
      id: 1,
      type: "이용문의",
      title: "종목 추천 기준이 뭔가요?",
      date: "2024.10.20.",
      status: "완료"
    }
  ];

  const totalCount = inquiries.length;
  const waitingCount = inquiries.filter(i => i.status === "대기").length;
  const completedCount = inquiries.filter(i => i.status === "완료").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Sub-Navigation Bar */}
      <div style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center" style={{ gap: "0px", height: "48px" }}>
            <button
              onClick={() => setActiveSubMenu("inquiry-history")}
              className="hover:transition-colors flex items-center gap-1 px-6"
              style={{
                color: activeSubMenu === "inquiry-history" ? "#3B82F6" : "#64748B",
                fontWeight: activeSubMenu === "inquiry-history" ? "700" : "400",
                borderRight: "1px solid #E2E8F0",
                height: "100%"
              }}
            >
              문의내역 <span style={{ fontSize: "12px" }}>▼</span>
            </button>
            <button
              onClick={() => setActiveSubMenu("faq")}
              className="hover:transition-colors px-6"
              style={{
                color: activeSubMenu === "faq" ? "#3B82F6" : "#64748B",
                fontWeight: activeSubMenu === "faq" ? "700" : "400",
                borderRight: "1px solid #E2E8F0",
                height: "100%"
              }}
            >
              자주묻는 질문
            </button>
            <button
              onClick={() => setActiveSubMenu("contact")}
              className="hover:transition-colors px-6"
              style={{
                color: activeSubMenu === "contact" ? "#3B82F6" : "#64748B",
                fontWeight: activeSubMenu === "contact" ? "700" : "400",
                borderRight: "1px solid #E2E8F0",
                height: "100%"
              }}
            >
              고객문의
            </button>
            <button
              onClick={() => setActiveSubMenu("notices")}
              className="hover:transition-colors px-6"
              style={{
                color: activeSubMenu === "notices" ? "#3B82F6" : "#64748B",
                fontWeight: activeSubMenu === "notices" ? "700" : "400",
                height: "100%"
              }}
            >
              공지사항
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          </div>

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
                      <button className="hover:text-blue-600 transition-colors text-left">
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
          </div>

          {/* Pagination & Action Button */}
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
    </div>
  );
}
