package com.gotchabug.moneymate.customer.repository;

import com.gotchabug.moneymate.customer.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Long> {

    List<Faq> findTop10ByActiveYnOrderByViewCountDesc(String activeYn);

    List<Faq> findByCategoryAndActiveYnOrderByViewCountDesc(String category, String activeYn);
}