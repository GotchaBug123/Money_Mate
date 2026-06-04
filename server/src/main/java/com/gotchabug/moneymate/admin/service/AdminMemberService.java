package com.gotchabug.moneymate.admin.service;

import com.gotchabug.moneymate.admin.dto.AdminMemberResponse;
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

    public List<AdminMemberResponse> getAllMembers() {
        return memberRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AdminMemberResponse::from)
                .toList();
    }

    public AdminMemberResponse getMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        return AdminMemberResponse.from(member);
    }

    @Transactional
    public void updateMember(
            Long memberId,
            String name,
            String email,
            String role,
            String signupStatus
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        member.updateAdminInfo(
                name,
                email,
                role,
                signupStatus
        );
    }

    @Transactional
    public void deleteMember(Long memberId) {

        if (!memberRepository.existsById(memberId)) {
            throw new IllegalArgumentException("회원이 존재하지 않습니다.");
        }

        memberRepository.deleteById(memberId);
    }
}