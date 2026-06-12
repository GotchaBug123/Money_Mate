package com.gotchabug.moneymate.admin.service;

import com.gotchabug.moneymate.admin.dto.AdminAgeGroupStatResponse;
import com.gotchabug.moneymate.admin.dto.AdminInvestmentSummaryResponse;
import com.gotchabug.moneymate.admin.dto.AdminMemberInvestmentResponse;
import com.gotchabug.moneymate.investment.entity.InvestmentHolding;
import com.gotchabug.moneymate.investment.repository.InvestmentHoldingRepository;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import com.gotchabug.moneymate.risk.entity.RiskProfile;
import com.gotchabug.moneymate.risk.repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInvestmentInfoService {

    private final MemberRepository memberRepository;
    private final InvestmentHoldingRepository investmentHoldingRepository;
    private final RiskProfileRepository riskProfileRepository;

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

    public List<AdminMemberInvestmentResponse> getMemberInvestmentList(
            String keyword,
            String riskTypeCode
    ) {
        List<InvestmentHolding> allHoldings = investmentHoldingRepository.findAll();

        Map<Long, List<InvestmentHolding>> holdingsByMember = allHoldings.stream()
                .collect(Collectors.groupingBy(h -> h.getMember().getMemberId()));

        Map<Long, RiskProfile> riskProfileMap = riskProfileRepository.findAll()
                .stream()
                .collect(Collectors.toMap(
                        rp -> rp.getMember().getMemberId(),
                        rp -> rp,
                        (a, b) -> a
                ));

        return memberRepository.findAll()
                .stream()
                .filter(member -> holdingsByMember.containsKey(member.getMemberId()))
                .filter(member -> matchesKeyword(member, keyword))
                .map(member -> toMemberInvestmentResponse(
                        member,
                        holdingsByMember.get(member.getMemberId()),
                        riskProfileMap.get(member.getMemberId())
                ))
                .filter(response -> matchesRiskType(response, riskTypeCode))
                .toList();
    }

    public List<AdminAgeGroupStatResponse> getAgeGroupStats() {
        Map<Long, Member> memberMap = memberRepository.findAll()
                .stream()
                .filter(member -> member.getBirthDate() != null)
                .collect(Collectors.toMap(
                        Member::getMemberId,
                        member -> member
                ));

        Map<String, List<RiskProfile>> groupMap = createEmptyAgeGroupMap();

        for (RiskProfile profile : riskProfileRepository.findAll()) {
            Member member = memberMap.get(profile.getMember().getMemberId());

            if (member == null) {
                continue;
            }

            String ageGroup = toAgeGroup(member.getBirthDate());

            if (ageGroup == null) {
                continue;
            }

            groupMap.get(ageGroup).add(profile);
        }

        return groupMap.entrySet()
                .stream()
                .map(entry -> toAgeGroupStatResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private boolean matchesKeyword(Member member, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }

        return contains(member.getName(), keyword)
                || contains(member.getLoginId(), keyword);
    }

    private boolean matchesRiskType(
            AdminMemberInvestmentResponse response,
            String riskTypeCode
    ) {
        if (riskTypeCode == null || riskTypeCode.isBlank()) {
            return true;
        }

        return riskTypeCode.equals(response.getRiskTypeCode());
    }

    private AdminMemberInvestmentResponse toMemberInvestmentResponse(
            Member member,
            List<InvestmentHolding> holdings,
            RiskProfile riskProfile
    ) {
        BigDecimal totalEvaluation = holdings.stream()
                .map(h -> h.getBuyPrice().multiply(BigDecimal.valueOf(h.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<String> holdingNames = holdings.stream()
                .map(InvestmentHolding::getAssetName)
                .toList();

        int previewCount = Math.min(5, holdingNames.size());

        return AdminMemberInvestmentResponse.builder()
                .memberId(member.getMemberId())
                .name(member.getName())
                .loginId(member.getLoginId())
                .riskTypeCode(riskProfile == null ? null : riskProfile.getRiskTypeCode())
                .riskTypeName(riskProfile == null ? null : riskProfile.getRiskTypeName())
                .totalEvaluation(totalEvaluation)
                .holdingCount(holdings.size())
                .holdingNames(holdingNames.subList(0, previewCount))
                .remainCount(holdingNames.size() - previewCount)
                .build();
    }

    private Map<String, List<RiskProfile>> createEmptyAgeGroupMap() {
        Map<String, List<RiskProfile>> groupMap = new LinkedHashMap<>();
        groupMap.put("20대", new ArrayList<>());
        groupMap.put("30대", new ArrayList<>());
        groupMap.put("40대", new ArrayList<>());
        groupMap.put("50대", new ArrayList<>());
        groupMap.put("60대", new ArrayList<>());
        return groupMap;
    }

    private AdminAgeGroupStatResponse toAgeGroupStatResponse(
            String ageGroup,
            List<RiskProfile> profiles
    ) {
        if (profiles.isEmpty()) {
            return AdminAgeGroupStatResponse.builder()
                    .ageGroup(ageGroup)
                    .dominantRiskTypeName("-")
                    .ratio(0)
                    .avgScore(0)
                    .build();
        }

        double avgScore = profiles.stream()
                .mapToInt(RiskProfile::getTotalScore)
                .average()
                .orElse(0);

        Map<String, Long> typeCount = profiles.stream()
                .collect(Collectors.groupingBy(
                        RiskProfile::getRiskTypeName,
                        Collectors.counting()
                ));

        String dominantRiskTypeName = typeCount.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("-");

        int ratio = (int) Math.round(
                (double) typeCount.getOrDefault(dominantRiskTypeName, 0L)
                        / profiles.size()
                        * 100
        );

        return AdminAgeGroupStatResponse.builder()
                .ageGroup(ageGroup)
                .dominantRiskTypeName(dominantRiskTypeName)
                .ratio(ratio)
                .avgScore(Math.round(avgScore * 10.0) / 10.0)
                .build();
    }

    private String toAgeGroup(LocalDate birthDate) {
        int currentYear = LocalDate.now().getYear();
        int age = currentYear - birthDate.getYear();

        if (age >= 20 && age < 30) return "20대";
        if (age >= 30 && age < 40) return "30대";
        if (age >= 40 && age < 50) return "40대";
        if (age >= 50 && age < 60) return "50대";
        if (age >= 60) return "60대";
        return null;
    }

    private boolean contains(String value, String keyword) {
        return value != null && value.contains(keyword);
    }
}