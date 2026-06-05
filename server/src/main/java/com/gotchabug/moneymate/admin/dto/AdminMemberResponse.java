package com.gotchabug.moneymate.admin.dto;

import com.gotchabug.moneymate.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class AdminMemberResponse {

    private Long memberId;
    private String loginId;
    private String name;
    private String email;
    private LocalDate birthDate;
    private String role;
    private String signupStatus;
    private LocalDateTime createdAt;

    public static AdminMemberResponse from(Member member) {
        return AdminMemberResponse.builder()
                .memberId(member.getMemberId())
                .loginId(member.getLoginId())
                .name(member.getName())
                .email(member.getEmail())
                .birthDate(member.getBirthDate())
                .role(member.getRole())
                .signupStatus(member.getSignupStatus())
                .createdAt(member.getCreatedAt())
                .build();
    }
}