package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.MemberAuth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberAuthRepository extends JpaRepository<MemberAuth, Long> {

    Optional<MemberAuth> findByMember_MemberId(Long memberId);
}