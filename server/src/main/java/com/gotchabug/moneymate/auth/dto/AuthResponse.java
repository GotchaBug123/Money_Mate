package com.gotchabug.moneymate.auth.dto;

import com.gotchabug.moneymate.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private Long memberId;
    private String loginId;
    private String email;
    private String name;
    private String role;

    public static AuthResponse from(Member member) {
        return AuthResponse.builder()
                .memberId(member.getMemberId())
                .loginId(member.getLoginId())
                .email(member.getEmail())
                .name(member.getName())
                .role(member.getRole())
                .build();
    }
}
