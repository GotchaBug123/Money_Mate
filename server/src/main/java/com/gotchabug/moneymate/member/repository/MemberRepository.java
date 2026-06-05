package com.gotchabug.moneymate.member.repository;

import com.gotchabug.moneymate.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Optional<Member> findByLoginId(String loginId);

    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    long countByRole(String role);

    List<Member> findAllByOrderByCreatedAtDesc();
    // 아이디 찾기
    Optional<Member> findByNameAndEmail(String name, String email);

    // 비밀번호 재설정
    Optional<Member> findByLoginIdAndEmail(String loginId, String email);
}