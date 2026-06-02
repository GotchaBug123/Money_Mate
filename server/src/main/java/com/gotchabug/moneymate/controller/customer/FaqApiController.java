package com.gotchabug.moneymate.controller.customer;

import com.gotchabug.moneymate.dto.customer.FaqResponse;
import com.gotchabug.moneymate.repository.FaqRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/faqs")
@Tag(name = "FAQ", description = "자주 묻는 질문 API")
public class FaqApiController {

    private final FaqRepository faqRepository;

    @GetMapping
    @Operation(summary = "FAQ 목록 조회", description = "활성화된 FAQ 목록을 조회수 순으로 조회합니다.")
    public List<FaqResponse> getFaqs() {
        return faqRepository.findByActiveYnOrderByViewCountDesc("Y")
                .stream()
                .map(FaqResponse::from)
                .toList();
    }

    @GetMapping("/{faqId}")
    @Operation(summary = "FAQ 상세 조회", description = "FAQ ID로 상세 내용을 조회합니다.")
    public FaqResponse getFaq(
            @Parameter(description = "FAQ ID", example = "1")
            @PathVariable Long faqId
    ) {
        return faqRepository.findById(faqId)
                .filter(faq -> "Y".equalsIgnoreCase(faq.getActiveYn()))
                .map(FaqResponse::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "FAQ not found."
                ));
    }
}
