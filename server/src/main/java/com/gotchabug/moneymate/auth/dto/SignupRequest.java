package com.gotchabug.moneymate.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SignupRequest {

    @NotBlank(message = "아이디는 필수입니다.")
    @Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하로 입력해주세요.")
    private String loginId;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식으로 입력해주세요.")
    private String email;

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    private LocalDate birthDate;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 4, max = 100, message = "비밀번호는 4자 이상으로 입력해주세요.")
    private String password;
}
