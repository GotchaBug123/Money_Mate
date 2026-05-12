import { useState, useEffect } from "react";

type Region = "all" | "국내" | "해외";
type Sector = "all" | "IT" | "바이오" | "금융" | "소비재" | "에너지";

interface PortfolioPost {
  id: number;
  region: "국내" | "해외";
  sector: "IT" | "바이오" | "금융" | "소비재" | "에너지";
  title: string;
  summary: string;
  date: string;
  thumbnail: string;
}

const portfolioPosts: PortfolioPost[] = [
  {
    id: 1,
    region: "국내",
    sector: "IT",
    title: "머니메이트, AI 반도체 ETF 기반 성장형 포트폴리오 공개",
    summary: "머니메이트 투자전략연구소는 최근 AI 서버 및 데이터센터 시장 확대 흐름에 맞춰 국내 AI 반도체 ETF 중심의 성장형 포트폴리오를 공개했습니다. 삼성전자, SK하이닉스 등 국내 반도체 대표 기업과 관련 ETF 비중을 확대해 AI 산업 성장 수혜를 장기적으로 반영한 전략입니다.",
    date: "2026.04.15",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    region: "해외",
    sector: "IT",
    title: "머니메이트 글로벌 전략팀, 미국 빅테크 중심 투자 모델 리포트 발간",
    summary: "머니메이트 글로벌 전략팀은 클라우드, AI, 플랫폼 산업 성장세를 기반으로 미국 빅테크 기업 중심의 장기 성장형 포트폴리오 리포트를 발간했습니다. AI 인프라 기업과 클라우드 플랫폼 기업을 중심으로 성장성과 안정성을 함께 고려했습니다.",
    date: "2026.04.20",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    region: "국내",
    sector: "바이오",
    title: "머니메이트, 국내 헬스케어 성장주 포트폴리오 분석 결과 발표",
    summary: "머니메이트는 국내 헬스케어 및 바이오 산업 성장 가능성을 반영한 포트폴리오 분석 자료를 공개했습니다. 바이오시밀러, 의료기기, 디지털 헬스케어 기업 중심으로 구성해 성장성과 안정성을 동시에 고려했습니다.",
    date: "2026.04.12",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    region: "해외",
    sector: "바이오",
    title: "글로벌 헬스케어 ETF 시장 분석… 머니메이트 \"장기 분산 투자 유효\"",
    summary: "머니메이트 ETF 분석팀은 미국과 유럽 중심의 글로벌 헬스케어 ETF 시장 분석 자료를 공개했습니다. 글로벌 제약사, 의료장비 기업, 바이오 기술 기업 중심 ETF를 활용해 경기 방어성과 장기 성장성을 함께 반영했습니다.",
    date: "2026.04.18",
    thumbnail: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    region: "국내",
    sector: "금융",
    title: "고금리 시대 주목받는 금융주… 머니메이트 배당형 전략 공개",
    summary: "머니메이트는 국내 은행·증권·보험 업종 중심의 배당형 포트폴리오 전략을 공개했습니다. 안정적인 현금흐름과 배당 수익률 확보에 초점을 맞추고, 장기 투자자 중심의 안정형 자산 배분 전략을 적용했습니다.",
    date: "2026.04.10",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
  },
  {
    id: 6,
    region: "해외",
    sector: "금융",
    title: "머니메이트, 글로벌 금융주 리밸런싱 전략 업데이트",
    summary: "머니메이트 글로벌 자산전략팀은 미국 대형 은행주, 글로벌 자산운용사, 보험·결제 플랫폼 기업 중심의 금융 섹터 리밸런싱 전략을 공개했습니다. 금리 변화와 경기 흐름을 고려해 안정적인 현금흐름과 성장성을 함께 반영했습니다.",
    date: "2026.04.22",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
  },
  {
    id: 7,
    region: "국내",
    sector: "소비재",
    title: "경기 둔화 속 소비재 방어주 강세… 머니메이트 대응 전략 제시",
    summary: "머니메이트는 국내 식품, 생활용품, 유통 기업 중심의 소비재 방어형 포트폴리오 전략을 공개했습니다. 경기 변동 상황에서도 비교적 안정적인 매출 흐름을 유지할 수 있는 업종을 중심으로 구성했습니다.",
    date: "2026.04.08",
    thumbnail: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=400&h=250&fit=crop",
  },
  {
    id: 8,
    region: "해외",
    sector: "소비재",
    title: "글로벌 브랜드 소비재 기업 분석 리포트 공개",
    summary: "머니메이트 글로벌 리서치센터는 글로벌 소비재 기업들의 장기 성장성과 브랜드 경쟁력을 분석한 투자 리포트를 공개했습니다. 안정적인 현금흐름과 글로벌 브랜드 가치를 보유한 기업 중심 전략입니다.",
    date: "2026.04.25",
    thumbnail: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=250&fit=crop",
  },
  {
    id: 9,
    region: "국내",
    sector: "에너지",
    title: "친환경 산업 성장 본격화… 머니메이트 에너지 포트폴리오 강화",
    summary: "머니메이트는 국내 태양광, 2차전지, 전력 인프라 관련 기업 중심의 친환경 에너지 포트폴리오 전략을 공개했습니다. ESG 투자 흐름과 전기차 시장 성장 가능성을 반영한 중장기 전략입니다.",
    date: "2026.04.05",
    thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
  },
  {
    id: 10,
    region: "해외",
    sector: "에너지",
    title: "글로벌 신재생 에너지 ETF 비교 분석 결과 공개",
    summary: "머니메이트 ETF 분석팀은 미국과 유럽 중심의 글로벌 신재생 에너지 ETF를 비교 분석한 리포트를 공개했습니다. 태양광, 풍력, 수소 산업 관련 ETF를 중심으로 장기 분산 투자 전략을 제시했습니다.",
    date: "2026.04.17",
    thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
  },
  {
    id: 11,
    region: "국내",
    sector: "IT",
    title: "디지털 전환 수혜 기대… 국내 플랫폼·소프트웨어 전략 발표",
    summary: "머니메이트는 국내 SaaS, 정보보안, 플랫폼 서비스 기업 중심의 IT 포트폴리오 전략을 공개했습니다. 기업 디지털 전환 수요 확대와 AI 서비스 확산에 따른 성장 가능성을 주요 투자 포인트로 분석했습니다.",
    date: "2026.04.14",
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=250&fit=crop",
  },
  {
    id: 12,
    region: "해외",
    sector: "금융",
    title: "미국 배당 성장 금융 포트폴리오 운용 사례 공개",
    summary: "머니메이트는 미국 금융 섹터 중심의 배당 성장형 포트폴리오 운용 사례를 공개했습니다. 글로벌 대형 은행주와 자산운용사 중심으로 안정적인 배당 수익과 장기 자본 성장을 동시에 고려했습니다.",
    date: "2026.04.27",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
  },
];

export function PortfolioPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("all");
  const [selectedSector, setSelectedSector] = useState<Sector>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, selectedSector]);

  const filteredPosts = portfolioPosts.filter((post) => {
    const regionMatch = selectedRegion === "all" || post.region === selectedRegion;
    const sectorMatch = selectedSector === "all" || post.sector === selectedSector;
    return regionMatch && sectorMatch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handleCardClick = (id: number) => {
    // Portfolio detail page navigation would go here
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">포트폴리오</h1>
          <p className="text-gray-600">
            머니메이트 투자 전략 아카이브
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRegion("국내")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRegion === "국내"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                국내
              </button>
              <button
                onClick={() => setSelectedRegion("해외")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRegion === "해외"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                해외
              </button>
              {selectedRegion !== "all" && (
                <button
                  onClick={() => setSelectedRegion("all")}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  전체
                </button>
              )}
            </div>

            <span className="text-gray-300">|</span>

            {/* Sector Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-600 font-medium mr-2">분류</span>
              <button
                onClick={() => setSelectedSector("IT")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSector === "IT"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                IT
              </button>
              <button
                onClick={() => setSelectedSector("바이오")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSector === "바이오"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                바이오
              </button>
              <button
                onClick={() => setSelectedSector("금융")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSector === "금융"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                금융
              </button>
              <button
                onClick={() => setSelectedSector("소비재")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSector === "소비재"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                소비재
              </button>
              <button
                onClick={() => setSelectedSector("에너지")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSector === "에너지"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                에너지
              </button>
              {selectedSector !== "all" && (
                <button
                  onClick={() => setSelectedSector("all")}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  전체
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handleCardClick(post.id)}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className="px-2 py-1 text-xs font-semibold rounded"
                    style={{
                      backgroundColor: post.region === "국내" ? "#1D6AE5" : "#00C896",
                      color: "white",
                    }}
                  >
                    {post.region}
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold bg-white text-gray-700 rounded">
                    {post.sector}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-2">{post.date}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
