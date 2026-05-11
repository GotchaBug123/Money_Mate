package com.gotchabug.moneymate.service;


import com.gotchabug.moneymate.dto.member.MemberUpdateRequest;
import com.gotchabug.moneymate.dto.member.PasswordChangeRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.entity.MemberAuth;
import com.gotchabug.moneymate.repository.MemberAuthRepository;
import com.gotchabug.moneymate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberAuthRepository memberAuthRepository;

    public Member updateMember(Member loginUser, MemberUpdateRequest request) {
        Member member = memberRepository.findById(loginUser.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        member.setName(request.getName());
        member.setEmail(request.getEmail());
        member.setBirthDate(request.getBirthDate());

        return member;
    }

    public void changePassword(Member loginUser, PasswordChangeRequest request) {
        MemberAuth memberAuth = memberAuthRepository.findByMember(loginUser)
                .orElseThrow(() -> new IllegalArgumentException("인증 정보를 찾을 수 없습니다."));

        if (!memberAuth.getPasswordHash().equals(request.getCurrentPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        memberAuth.setPasswordHash(request.getNewPassword());
    }
}