package com.gotchabug.moneymate.customer.dto;

import com.gotchabug.moneymate.customer.entity.CustomerInquiry;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CustomerInquiryResponse {

    private Long inquiryId;
    private Long memberId;
    private String memberName;
    private String category;
    private String title;
    private String content;
    private String answer;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;

    public static CustomerInquiryResponse from(CustomerInquiry inquiry) {
        return CustomerInquiryResponse.builder()
                .inquiryId(inquiry.getInquiryId())
                .memberId(inquiry.getMember() == null
                        ? null
                        : inquiry.getMember().getMemberId())
                .memberName(inquiry.getMember() == null
                        ? null
                        : inquiry.getMember().getName())
                .category(inquiry.getCategory())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .answer(inquiry.getAnswer())
                .status(inquiry.getStatus())
                .createdAt(inquiry.getCreatedAt())
                .answeredAt(inquiry.getAnsweredAt())
                .build();
    }
}
