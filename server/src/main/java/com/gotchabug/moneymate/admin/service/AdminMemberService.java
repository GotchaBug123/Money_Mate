package com.gotchabug.moneymate.admin.service;

import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminMemberService {

    private final MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAllByOrderByCreatedAtDesc();
    }

    public Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
    }

    @Transactional
    public void updateMember(Long memberId, String name, String email, String role, String signupStatus) {
        Member member = getMember(memberId);
        member.updateAdminInfo(name, email, role, signupStatus);
    }

    @Transactional
    public void deleteMember(Long memberId) {
        memberRepository.deleteById(memberId);
    }
}