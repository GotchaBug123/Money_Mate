package com.gotchabug.moneymate.repository;



import com.gotchabug.moneymate.entity.Spending;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SpendingRepository extends JpaRepository<Spending, Long> {
    List<Spending> findByMember_MemberId(Long memberId);
    List<Spending> findByMember_MemberIdAndSpendingDateBetween(Long memberId, LocalDate start, LocalDate end);
}