package com.gotchabug.moneymate.admin.dto;

import com.gotchabug.moneymate.customer.entity.CustomerInquiry;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminInquiryResponse {

    private Long inquiryId;
    private Long memberId;
    private String memberName;
    private String title;
    private String content;
    private String answer;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;

    public static AdminInquiryResponse from(CustomerInquiry inquiry) {
        return AdminInquiryResponse.builder()
                .inquiryId(inquiry.getInquiryId())
                .memberId(
                        inquiry.getMember() == null
                                ? null
                                : inquiry.getMember().getMemberId()
                )
                .memberName(
                        inquiry.getMember() == null
                                ? null
                                : inquiry.getMember().getName()
                )
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .answer(inquiry.getAnswer())
                .status(inquiry.getStatus())
                .createdAt(inquiry.getCreatedAt())
                .answeredAt(inquiry.getAnsweredAt())
                .build();
    }
}