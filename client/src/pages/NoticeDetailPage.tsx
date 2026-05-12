import { ArrowLeft, Calendar, Eye } from "lucide-react";

interface NoticeDetailPageProps {
  onNavigate: (page: string) => void;
  noticeId: number | undefined;
}

interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  date: string;
  views: number;
  isImportant: boolean;
}

const mockNoticeDetails: Record<number, NoticeDetail> = {
  1: {
    id: 1,
    title: "MoneyMate 서비스 정기점검 안내",
    content: `안녕하세요, MoneyMate입니다.

보다 안정적인 서비스 제공을 위해 정기점검을 실시합니다.

■ 점검 일시
- 2026년 5월 15일(목) 02:00 ~ 06:00 (약 4시간)

■ 점검 내용
- 서버 인프라 점검 및 최적화
- 보안 업데이트 적용
- 데이터베이스 정비

■ 점검 중 이용 제한 사항
- 로그인 불가
- 거래 및 조회 서비스 일시 중단
- 고객센터 1:1 문의 답변 지연 가능

■ 유의사항
- 점검 시작 전 미체결 주문은 자동 취소됩니다.
- 점검이 조기 완료될 경우 별도 공지 없이 서비스가 재개됩니다.

이용에 불편을 드려 죄송하며, 더 나은 서비스로 보답하겠습니다.

감사합니다.`,
    date: "2026-05-07",
    views: 1523,
    isImportant: true
  },
  2: {
    id: 2,
    title: "로보어드바이저 AI 알고리즘 업데이트 완료",
    content: `안녕하세요, MoneyMate입니다.

로보어드바이저 AI 알고리즘이 대폭 업데이트되었습니다.

■ 주요 개선 사항
1. 포트폴리오 분석 정확도 향상
   - 머신러닝 모델 고도화로 30% 개선

2. 실시간 리밸런싱 알고리즘 추가
   - 시장 변동성에 따른 자동 조정 기능

3. 섹터 분산 최적화
   - 업종별 위험 분산 로직 강화

4. ESG 투자 선호도 반영
   - 환경·사회·지배구조 요소 고려

■ 이용 방법
- MY 자산 > 내 로보 > 포트폴리오 분석

더욱 정교해진 AI 분석을 통해 최적의 투자 전략을 수립하세요.

감사합니다.`,
    date: "2026-05-05",
    views: 2341,
    isImportant: true
  },
  3: {
    id: 3,
    title: "신규 ETF 종목 추가 안내",
    content: `안녕하세요, MoneyMate입니다.

투자자 여러분의 다양한 투자 니즈를 충족하기 위해 신규 ETF 종목을 추가하였습니다.

■ 추가 종목 (총 10종)

[국내 ETF]
- TIGER 미국나스닥100
- KODEX 차이나H
- TIGER 2차전지테마
- KODEX K-신재생에너지액티브

[해외 ETF]
- VTI (Vanguard Total Stock Market ETF)
- QQQ (Invesco QQQ Trust)
- SPY (SPDR S&P 500 ETF)
- IVV (iShares Core S&P 500 ETF)
- VEA (Vanguard FTSE Developed Markets ETF)
- EEM (iShares MSCI Emerging Markets ETF)

■ 이용 방법
- 대시보드 > 종목 추가 버튼 클릭
- 검색창에서 종목명 또는 티커 검색

분산투자 포트폴리오 구성에 활용하시기 바랍니다.

감사합니다.`,
    date: "2026-05-03",
    views: 987,
    isImportant: false
  },
  4: {
    id: 4,
    title: "투자 커뮤니티 기능 오픈",
    content: `안녕하세요, MoneyMate입니다.

종목별 투자자 의견을 공유하고 소통할 수 있는 커뮤니티 기능이 오픈되었습니다.

■ 주요 기능
1. 종목별 커뮤니티
   - 관심 종목에 대한 투자 의견 작성
   - 주주 인증 배지 제공

2. 게시글 작성 및 좋아요
   - 실시간 투자 의견 공유
   - 유용한 정보에 좋아요 표시

3. 정렬 기능
   - 최신순 / 인기순 정렬

4. 익명성 보장
   - 사용자 ID 마스킹 처리 (앞 3자리만 표시)

■ 이용 방법
- 대시보드 > 종목 클릭 > 투자 커뮤니티 탭

건전한 투자 문화 조성을 위해 욕설, 비방 등 부적절한 내용은 관리자에 의해 삭제될 수 있습니다.

감사합니다.`,
    date: "2026-05-01",
    views: 1845,
    isImportant: false
  },
  5: {
    id: 5,
    title: "개인정보 처리방침 변경 안내",
    content: `안녕하세요, MoneyMate입니다.

개인정보 보호법 개정에 따라 개인정보 처리방침이 일부 변경됩니다.

■ 시행일
- 2026년 5월 10일(금)

■ 주요 변경 내용
1. 개인정보 수집 항목 명확화
2. 개인정보 보유 기간 세분화
3. 개인정보 파기 절차 구체화
4. 정보주체 권리 행사 방법 추가

■ 확인 방법
- 홈페이지 하단 > 개인정보 처리방침
- 설정 > 약관 및 정책

변경된 처리방침은 시행일부터 적용되며, 동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.

궁금하신 사항은 고객센터로 문의해 주시기 바랍니다.

감사합니다.`,
    date: "2026-04-28",
    views: 756,
    isImportant: false
  }
};

export function NoticeDetailPage({ onNavigate, noticeId }: NoticeDetailPageProps) {
  const notice = noticeId ? mockNoticeDetails[noticeId] : null;

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">공지사항을 찾을 수 없습니다.</p>
            <button
              onClick={() => onNavigate("notice-list")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => onNavigate("notice-list")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>목록으로</span>
        </button>

        {/* Notice Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              {notice.isImportant && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                  중요
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900 flex-1">{notice.title}</h1>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{notice.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>조회 {notice.views.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {notice.content}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onNavigate("notice-list")}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
