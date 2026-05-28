package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.CustomerInquiry;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerInquiryRepository extends JpaRepository<CustomerInquiry, Long> {

    List<CustomerInquiry> findByMember_MemberIdOrderByCreatedAtDesc(Long memberId);

    long countByStatus(String status);

    @EntityGraph(attributePaths = {"member"})
    List<CustomerInquiry> findAllByOrderByCreatedAtDesc();
}