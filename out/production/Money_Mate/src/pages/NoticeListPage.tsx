import { useState } from "react";
import { Search, ChevronRight, Bell } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  views: number;
  isImportant: boolean;
}

interface NoticeListPageProps {
  onNavigate: (page: string) => void;
  onViewDetail: (id: number) => void;
}

const mockNotices: Notice[] = [
  {
    id: 1,
    title: "MoneyMate 서비스 정기점검 안내",
    content: "2026년 5월 15일(목) 02:00~06:00 정기점검이 진행됩니다.",
    date: "2026-05-07",
    views: 1523,
    isImportant: true
  },
  {
    id: 2,
    title: "로보어드바이저 AI 알고리즘 업데이트 완료",
    content: "더욱 정교해진 포트폴리오 분석 기능을 경험해보세요.",
    date: "2026-05-05",
    views: 2341,
    isImportant: true
  },
  {
    id: 3,
    title: "신규 ETF 종목 추가 안내",
    content: "TIGER 미국나스닥100, KODEX 차이나H 등 10종이 추가되었습니다.",
    date: "2026-05-03",
    views: 987,
    isImportant: false
  },
  {
    id: 4,
    title: "투자 커뮤니티 기능 오픈",
    content: "종목별 투자자 의견을 공유하고 소통할 수 있는 커뮤니티가 오픈되었습니다.",
    date: "2026-05-01",
    views: 1845,
    isImportant: false
  },
  {
    id: 5,
    title: "개인정보 처리방침 변경 안내",
    content: "2026년 5월 10일부터 개인정보 처리방침이 일부 변경됩니다.",
    date: "2026-04-28",
    views: 756,
    isImportant: false
  },
  {
    id: 6,
    title: "모바일 앱 v2.0 업데이트",
    content: "새로운 UI/UX와 향상된 성능을 경험해보세요.",
    date: "2026-04-25",
    views: 1234,
    isImportant: false
  },
  {
    id: 7,
    title: "해외주식 거래시간 연장 안내",
    content: "미국 시장 거래시간이 한국시간 23:30~06:00으로 연장됩니다.",
    date: "2026-04-20",
    views: 2103,
    isImportant: false
  },
  {
    id: 8,
    title: "고객센터 운영시간 변경 안내",
    content: "평일 09:00~18:00 → 09:00~19:00으로 연장 운영합니다.",
    date: "2026-04-15",
    views: 543,
    isImportant: false
  },
  {
    id: 9,
    title: "투자 성향 분석 설문 기능 추가",
    content: "30초만에 완성되는 AI 기반 투자 성향 분석을 이용해보세요.",
    date: "2026-04-10",
    views: 1876,
    isImportant: false
  },
  {
    id: 10,
    title: "MoneyMate 가입자 5만명 돌파 감사 이벤트",
    content: "추첨을 통해 50분께 스타벅스 기프티콘을 드립니다.",
    date: "2026-04-05",
    views: 3421,
    isImportant: false
  }
];

export function NoticeListPage({ onNavigate, onViewDetail }: NoticeListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 검색 필터링
  const filteredNotices = mockNotices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 페이지네이션
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
          </div>
          <p className="text-gray-600">MoneyMate의 새로운 소식과 안내사항을 확인하세요</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="공지사항 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Notice List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-7">제목</div>
            <div className="col-span-3 text-center">작성일</div>
            <div className="col-span-2 text-center">조회수</div>
          </div>

          {/* Notice Items */}
          {paginatedNotices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedNotices.map((notice) => (
                <button
                  key={notice.id}
                  onClick={() => onViewDetail(notice.id)}
                  className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                    {/* Title */}
                    <div className="md:col-span-7 flex items-center gap-2 mb-2 md:mb-0">
                      {notice.isImportant && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          중요
                        </span>
                      )}
                      <span className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        {notice.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto md:hidden" />
                    </div>

                    {/* Date */}
                    <div className="md:col-span-3 md:text-center">
                      <span className="text-sm text-gray-500">{notice.date}</span>
                    </div>

                    {/* Views */}
                    <div className="md:col-span-2 md:text-center">
                      <span className="text-sm text-gray-500">{notice.views.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
