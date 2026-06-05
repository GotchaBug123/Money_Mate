package com.gotchabug.moneymate.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPasswordRequest {

    @NotBlank(message = "아이디를 입력해주세요.")
    private String loginId;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "새 비밀번호를 입력해주세요.")
    @Size(min = 4, max = 100,
            message = "비밀번호는 4자 이상 입력해주세요.")
    private String newPassword;
}