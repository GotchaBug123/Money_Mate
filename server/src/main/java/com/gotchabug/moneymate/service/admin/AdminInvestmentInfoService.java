package com.gotchabug.moneymate.service.admin;


import com.gotchabug.moneymate.admin.dto.AdminAgeGroupStatResponse;
import com.gotchabug.moneymate.admin.dto.AdminInvestmentSummaryResponse;
import com.gotchabug.moneymate.admin.dto.AdminMemberInvestmentResponse;
import com.gotchabug.moneymate.investment.entity.InvestmentHolding;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.risk.entity.RiskProfile;
import com.gotchabug.moneymate.investment.repository.InvestmentHoldingRepository;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import com.gotchabug.moneymate.risk.repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


/**
 * 관리자 투자정보관리 서비스
 * - 회원별 보유 종목 목록 + 평가금액
 * - 연령대별 투자 성향 통계
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInvestmentInfoService {


    private final MemberRepository memberRepository;
    private final InvestmentHoldingRepository investmentHoldingRepository;
    private final RiskProfileRepository riskProfileRepository;


    /** ───────────────────────────────────────────────
     * 요약 통계 (상단 카드 3개)
     * - 관리 회원 수: 보유 종목이 1건 이상인 회원 수
     * - 보유 종목 수: investment_holding 전체 건수
     * - 총 평가금액: buy_price × quantity 합산
     * ─────────────────────────────────────────────── */
    public AdminInvestmentSummaryResponse getSummary() {
        List<InvestmentHolding> allHoldings = investmentHoldingRepository.findAll();


        long memberCount = allHoldings.stream()
                .map(h -> h.getMember().getMemberId())
                .distinct()
                .count();


        long totalHoldingCount = allHoldings.size();


        BigDecimal totalEvaluation = allHoldings.stream()
                .map(h -> h.getBuyPrice().multiply(BigDecimal.valueOf(h.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);


        return AdminInvestmentSummaryResponse.builder()
                .memberCount(memberCount)
                .totalHoldingCount(totalHoldingCount)
                .totalEvaluation(totalEvaluation)
                .build();
    }


    /** ───────────────────────────────────────────────
     * 회원별 투자 현황 목록
     * - 검색어(keyword)가 있으면 name / loginId 포함 필터
     * - 투자 성향(riskTypeCode)이 있으면 필터
     * ─────────────────────────────────────────────── */
    public List<AdminMemberInvestmentResponse> getMemberInvestmentList(String keyword,
                                                                       String riskTypeCode) {
        List<InvestmentHolding> allHoldings = investmentHoldingRepository.findAll();
        Map<Long, List<InvestmentHolding>> holdingsByMember = allHoldings.stream()
                .collect(Collectors.groupingBy(h -> h.getMember().getMemberId()));


        List<Member> members = memberRepository.findAll().stream()
                .filter(m -> holdingsByMember.containsKey(m.getMemberId()))
                .collect(Collectors.toList());


        List<AdminMemberInvestmentResponse> result = new ArrayList<>();


        for (Member member : members) {
            Optional<RiskProfile> riskOpt = riskProfileRepository.findByMember_MemberId(member.getMemberId());


            String code     = riskOpt.map(RiskProfile::getRiskTypeCode).orElse(null);
            String typeName = riskOpt.map(RiskProfile::getRiskTypeName).orElse(null);


            if (riskTypeCode != null && !riskTypeCode.isBlank()) {
                if (!riskTypeCode.equals(code)) continue;
            }


            if (keyword != null && !keyword.isBlank()) {
                boolean nameMatch = member.getName() != null && member.getName().contains(keyword);
                boolean idMatch   = member.getLoginId() != null && member.getLoginId().contains(keyword);
                if (!nameMatch && !idMatch) continue;
            }


            List<InvestmentHolding> holdings = holdingsByMember.get(member.getMemberId());


            BigDecimal totalEval = holdings.stream()
                    .map(h -> h.getBuyPrice().multiply(BigDecimal.valueOf(h.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);


            List<String> allNames = holdings.stream()
                    .map(InvestmentHolding::getAssetName)
                    .collect(Collectors.toList());


            int preview   = Math.min(5, allNames.size());
            int remainCnt = allNames.size() - preview;


            result.add(AdminMemberInvestmentResponse.builder()
                    .memberId(member.getMemberId())
                    .name(member.getName())
                    .loginId(member.getLoginId())
                    .riskTypeCode(code)
                    .riskTypeName(typeName)
                    .totalEvaluation(totalEval)
                    .holdingCount(holdings.size())
                    .holdingNames(allNames.subList(0, preview))
                    .remainCount(remainCnt)
                    .build());
        }


        return result;
    }


    /** ───────────────────────────────────────────────
     * 연령대별 평균 투자 성향 통계
     * - member.birth_date → 연령 계산 → 10년 단위 그룹
     * - risk_profile.total_score 평균
     * - 해당 연령대에서 가장 많은 riskTypeName + 비율
     * ─────────────────────────────────────────────── */
    public List<AdminAgeGroupStatResponse> getAgeGroupStats() {
        List<Member> allMembers = memberRepository.findAll();


        Map<String, List<RiskProfile>> groupMap = new LinkedHashMap<>();
        String[] groups = {"20대", "30대", "40대", "50대", "60대"};
        for (String g : groups) groupMap.put(g, new ArrayList<>());


        int currentYear = LocalDate.now().getYear();


        for (Member member : allMembers) {
            if (member.getBirthDate() == null) continue;
            int age = currentYear - member.getBirthDate().getYear();
            String group = toAgeGroup(age);
            if (group == null) continue;
            riskProfileRepository.findByMember_MemberId(member.getMemberId())
                    .ifPresent(rp -> groupMap.get(group).add(rp));
        }


        List<AdminAgeGroupStatResponse> result = new ArrayList<>();


        for (String group : groups) {
            List<RiskProfile> profiles = groupMap.get(group);


            if (profiles.isEmpty()) {
                result.add(AdminAgeGroupStatResponse.builder()
                        .ageGroup(group)
                        .dominantRiskTypeName("-")
                        .ratio(0)
                        .avgScore(0)
                        .build());
                continue;
            }


            double avgScore = profiles.stream()
                    .mapToInt(RiskProfile::getTotalScore)
                    .average()
                    .orElse(0);


            Map<String, Long> typeCount = profiles.stream()
                    .collect(Collectors.groupingBy(RiskProfile::getRiskTypeName, Collectors.counting()));


            String dominant = typeCount.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("-");


            int ratio = (int) Math.round(
                    (double) typeCount.getOrDefault(dominant, 0L) / profiles.size() * 100);


            result.add(AdminAgeGroupStatResponse.builder()
                    .ageGroup(group)
                    .dominantRiskTypeName(dominant)
                    .ratio(ratio)
                    .avgScore(Math.round(avgScore * 10.0) / 10.0)
                    .build());
        }


        return result;
    }


    private String toAgeGroup(int age) {
        if (age >= 20 && age < 30) return "20대";
        if (age >= 30 && age < 40) return "30대";
        if (age >= 40 && age < 50) return "40대";
        if (age >= 50 && age < 60) return "50대";
        if (age >= 60)             return "60대";
        return null;
    }
}

