package com.gotchabug.moneymate.member.dto;



import com.gotchabug.moneymate.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MemberResponse {
    private Long memberId;
    private String email;
    private String name;
    private LocalDate birthDate;
    private String phoneNumber;
    private String signupStatus;

    public static MemberResponse from(Member member) {
        return MemberResponse.builder()
                .memberId(member.getMemberId())
                .email(member.getEmail())
                .name(member.getName())
                .birthDate(member.getBirthDate())
                .phoneNumber(member.getPhoneNumber())
                .signupStatus(member.getSignupStatus())
                .build();
    }
}