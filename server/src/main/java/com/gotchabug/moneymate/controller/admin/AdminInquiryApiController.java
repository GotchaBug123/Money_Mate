package com.gotchabug.moneymate.controller.admin;

import com.gotchabug.moneymate.dto.customer.AdminInquiryAnswerRequest;
import com.gotchabug.moneymate.dto.customer.CustomerInquiryResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.AdminInquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/inquiries")
@Tag(name = "Admin Inquiry", description = "관리자 고객 문의 관리 API")
public class AdminInquiryApiController {

    private final AdminInquiryService adminInquiryService;

    @GetMapping
    @Operation(summary = "관리자 문의 목록 조회", description = "관리자 권한으로 전체 고객 문의를 조회합니다.")
    public List<CustomerInquiryResponse> getInquiries(
            @Parameter(hidden = true) HttpSession session
    ) {
        validateAdmin(session);

        return adminInquiryService.getAllInquiries()
                .stream()
                .map(CustomerInquiryResponse::from)
                .toList();
    }

    @PutMapping("/{inquiryId}/answer")
    @Operation(summary = "관리자 문의 답변", description = "관리자 권한으로 고객 문의에 답변을 등록합니다.")
    public CustomerInquiryResponse answerInquiry(
            @Parameter(description = "문의 ID", example = "1")
            @PathVariable Long inquiryId,
            @Valid @RequestBody AdminInquiryAnswerRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        validateAdmin(session);

        adminInquiryService.answerInquiry(inquiryId, request.getAnswer());

        return CustomerInquiryResponse.from(adminInquiryService.getInquiry(inquiryId));
    }

    private void validateAdmin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Login is required."
            );
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin permission is required."
            );
        }
    }
}
