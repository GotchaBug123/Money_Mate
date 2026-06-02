package com.gotchabug.moneymate.controller.customer;

import com.gotchabug.moneymate.dto.customer.CustomerInquiryRequest;
import com.gotchabug.moneymate.dto.customer.CustomerInquiryResponse;
import com.gotchabug.moneymate.entity.CustomerInquiry;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.CustomerInquiryRepository;
import com.gotchabug.moneymate.service.CustomerCenterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inquiries")
@Tag(name = "Customer Inquiry", description = "사용자 고객 문의 API")
public class CustomerInquiryApiController {

    private final CustomerCenterService customerCenterService;
    private final CustomerInquiryRepository customerInquiryRepository;

    @GetMapping
    @Operation(summary = "내 문의 목록 조회", description = "로그인 사용자가 작성한 문의 목록을 조회합니다.")
    public List<CustomerInquiryResponse> getMyInquiries(
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return customerCenterService.getMyInquiries(loginUser.getMemberId())
                .stream()
                .map(CustomerInquiryResponse::from)
                .toList();
    }

    @GetMapping("/{inquiryId}")
    @Operation(summary = "내 문의 상세 조회", description = "로그인 사용자가 작성한 문의 상세 내용을 조회합니다.")
    public CustomerInquiryResponse getMyInquiry(
            @Parameter(description = "문의 ID", example = "1")
            @PathVariable Long inquiryId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);
        CustomerInquiry inquiry = customerInquiryRepository.findById(inquiryId)
                .filter(item -> item.getMember() != null
                        && loginUser.getMemberId().equals(item.getMember().getMemberId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Inquiry not found."
                ));

        return CustomerInquiryResponse.from(inquiry);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "문의 등록", description = "로그인 사용자의 고객 문의를 등록합니다.")
    public CustomerInquiryResponse createInquiry(
            @Valid @RequestBody CustomerInquiryRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        customerCenterService.createInquiry(
                loginUser,
                request.getCategory(),
                request.getTitle(),
                request.getContent()
        );

        return customerCenterService.getMyInquiries(loginUser.getMemberId())
                .stream()
                .findFirst()
                .map(CustomerInquiryResponse::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Inquiry was not created."
                ));
    }

    private Member requireLogin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Login is required."
            );
        }

        return member;
    }
}
