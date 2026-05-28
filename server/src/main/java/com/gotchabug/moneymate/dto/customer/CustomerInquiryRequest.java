package com.gotchabug.moneymate.dto.customer;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerInquiryRequest {

    @NotBlank(message = "문의 유형을 선택해주세요.")
    private String category;

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "문의 내용을 입력해주세요.")
    private String content;
}