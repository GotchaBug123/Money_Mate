package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.admin.investment.InvestmentInfoCreateRequest;
import com.gotchabug.moneymate.dto.admin.investment.InvestmentInfoResponse;
import com.gotchabug.moneymate.dto.admin.investment.InvestmentInfoUpdateRequest;
import com.gotchabug.moneymate.entity.InvestmentInfo;
import com.gotchabug.moneymate.repository.InvestmentInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInvestmentInfoService {

    private final InvestmentInfoRepository investmentInfoRepository;

    public List<InvestmentInfoResponse> getInvestmentInfos() {
        return investmentInfoRepository
                .findByActiveYnOrderByCreatedAtDesc("Y")
                .stream()
                .map(InvestmentInfoResponse::from)
                .toList();
    }

    public InvestmentInfoResponse getInvestmentInfo(Long infoId) {
        return InvestmentInfoResponse.from(findActiveInvestmentInfo(infoId));
    }

    @Transactional
    public InvestmentInfoResponse createInvestmentInfo(InvestmentInfoCreateRequest request) {
        InvestmentInfo investmentInfo = InvestmentInfo.builder()
                .title(normalizeRequired(request.getTitle(), "title"))
                .content(normalizeRequired(request.getContent(), "content"))
                .category(normalizeRequired(request.getCategory(), "category"))
                .sourceName(normalize(request.getSourceName()))
                .sourceUrl(normalize(request.getSourceUrl()))
                .activeYn("Y")
                .viewCount(0L)
                .build();

        return InvestmentInfoResponse.from(investmentInfoRepository.save(investmentInfo));
    }

    @Transactional
    public InvestmentInfoResponse updateInvestmentInfo(
            Long infoId,
            InvestmentInfoUpdateRequest request
    ) {
        InvestmentInfo investmentInfo = findActiveInvestmentInfo(infoId);

        investmentInfo.update(
                normalizeRequired(request.getTitle(), "title"),
                normalizeRequired(request.getContent(), "content"),
                normalizeRequired(request.getCategory(), "category"),
                normalize(request.getSourceName()),
                normalize(request.getSourceUrl()),
                toYn(request.getActive())
        );

        return InvestmentInfoResponse.from(investmentInfo);
    }

    @Transactional
    public void deleteInvestmentInfo(Long infoId) {
        InvestmentInfo investmentInfo = findActiveInvestmentInfo(infoId);
        investmentInfo.delete();
    }

    private InvestmentInfo findActiveInvestmentInfo(Long infoId) {
        return investmentInfoRepository.findByInfoIdAndActiveYn(infoId, "Y")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Investment info not found."
                ));
    }

    private String toYn(Boolean value) {
        return Boolean.FALSE.equals(value) ? "N" : "Y";
    }

    private String normalizeRequired(
            String value,
            String fieldName
    ) {
        String normalizedValue = normalize(value);

        if (normalizedValue == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " is required."
            );
        }

        return normalizedValue;
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}
