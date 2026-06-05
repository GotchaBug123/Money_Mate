package com.gotchabug.moneymate.member.service;

import com.gotchabug.moneymate.member.dto.MemberUpdateRequest;
import com.gotchabug.moneymate.member.dto.PasswordChangeRequest;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.member.entity.MemberAuth;
import com.gotchabug.moneymate.member.repository.MemberAuthRepository;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
// import org.springframework.security.crypto.password.PasswordEncoder; // 비밀번호 암호화용 컴포넌트 필요
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberAuthRepository memberAuthRepository;
    // private final PasswordEncoder passwordEncoder; // 암호화 컴포넌트 주입 필요

    /**
     * MypageService의 기능을 이쪽으로 통합[cite: 7]
     */
    @Transactional(readOnly = true)
    public Member getMyInfo(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
    }

    public Member updateMember(Member loginUser, MemberUpdateRequest request) {
        Member member = memberRepository.findById(loginUser.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // Setter대신 엔티티 메서드 활용
        member.updateMyInfo(request.getName(), request.getEmail(), request.getBirthDate());

        return member;
    }

    public void changePassword(Member loginUser, PasswordChangeRequest request) {
        // 객체 통째로 조회하는 대신 memberId 기반 조회로 안전하게 변경[cite: 8]
        MemberAuth memberAuth = memberAuthRepository.findByMember_MemberId(loginUser.getMemberId())
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