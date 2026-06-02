package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.InvestmentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvestmentInfoRepository extends JpaRepository<InvestmentInfo, Long> {

    List<InvestmentInfo> findByActiveYnOrderByCreatedAtDesc(String activeYn);

    Optional<InvestmentInfo> findByInfoIdAndActiveYn(Long infoId, String activeYn);
}
