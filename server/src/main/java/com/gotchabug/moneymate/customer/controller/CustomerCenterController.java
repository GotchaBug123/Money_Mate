package com.gotchabug.moneymate.customer.controller;

import com.gotchabug.moneymate.customer.dto.CustomerInquiryRequest;
import com.gotchabug.moneymate.customer.service.CustomerCenterService;
import org.springframework.web.server.ResponseStatusException;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer-center")
@RequiredArgsConstructor
@Tag(name = "고객센터", description = "고객센터 FAQ 및 문의 API")
public class CustomerCenterController {

    private final CustomerCenterService customerCenterService;

    @Operation(summary = "고객센터 메인 데이터 조회")
    @GetMapping
    public ResponseEntity<?> getCustomerCenter(HttpSession session) {
        Member loginUser = getLoginUser(session);

        return ResponseEntity.ok(
                CustomerCenterResponse.builder()
                        .member(loginUser)
                        .faqs(customerCenterService.getTopFaqs())
                        .categories(customerCenterService.getCategories())
                        .inquiries(customerCenterService.getMyInquiries(loginUser.getMemberId()))
                        .build()
        );
    }

    @Operation(summary = "FAQ 목록 조회")
    @GetMapping("/faqs")
    public ResponseEntity<?> getFaqs() {
        return ResponseEntity.ok(customerCenterService.getTopFaqs());
    }

    @Operation(summary = "문의 카테고리 조회")
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(customerCenterService.getCategories());
    }

    @Operation(summary = "내 문의 목록 조회")
    @GetMapping("/inquiries/me")
    public ResponseEntity<?> getMyInquiries(HttpSession session) {
        Member loginUser = getLoginUser(session);

        return ResponseEntity.ok(
                customerCenterService.getMyInquiries(loginUser.getMemberId())
        );
    }

    @Operation(summary = "고객 문의 등록")
    @PostMapping("/inquiries")
    public ResponseEntity<?> createInquiry(
            @Valid @RequestBody CustomerInquiryRequest request,
            HttpSession session
    ) {
        Member loginUser = getLoginUser(session);

        customerCenterService.createInquiry(
                loginUser,
                request.getCategory(),
                request.getTitle(),
                request.getContent()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiMessage.of("문의가 등록되었습니다."));
    }

    private Member getLoginUser(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return member;
    }

    @Getter
    @Builder
    public static class CustomerCenterResponse {
        private Member member;
        private Object faqs;
        private Object categories;
        private Object inquiries;
    }

    @Getter
    @Builder
    public static class ApiMessage {
        private String message;

        public static ApiMessage of(String message) {
            return ApiMessage.builder()
                    .message(message)
                    .build();
        }
    }
}