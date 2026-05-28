package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.LoginRequest;
import com.gotchabug.moneymate.dto.SignupRequest;
import com.gotchabug.moneymate.entity.*;
import com.gotchabug.moneymate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final MemberAuthRepository memberAuthRepository;
    private final FinancialProfileRepository financialProfileRepository;

    @Transactional
    public void signup(SignupRequest request) {

        if (memberRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디");
        }

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 이메일");
        }

        Member member = Member.builder()
                .loginId(request.getLoginId())
                .email(request.getEmail())
                .name(request.getName())
                .build();

        memberRepository.save(member);

        MemberAuth auth = MemberAuth.builder()
                .member(member)
                .passwordHash(request.getPassword())
                .build();

        memberAuthRepository.save(auth);

        FinancialProfile profile = FinancialProfile.builder()
                .member(member)
                .build();

        financialProfileRepository.save(profile);
    }

    @Transactional
    public Member login(LoginRequest request) {

        Member member = memberRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다."));

        MemberAuth auth = memberAuthRepository.findByMember_MemberId(member.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("인증 정보가 없습니다."));

        if (!auth.getPasswordHash().equals(request.getPassword())) {
            auth.loginFail();
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        auth.loginSuccess();

        System.out.println("로그인 성공: " + member.getLoginId());

        return member;
    }
}