package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.MemberAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gotchabug.moneymate.entity.Member;
import java.util.Optional;

public interface MemberAuthRepository extends JpaRepository<MemberAuth, Long> {

    Optional<MemberAuth> findByMember_MemberId(Long memberId);
    Optional<MemberAuth> findByMember(Member member);
}