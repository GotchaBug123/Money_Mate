package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Long> {

    List<Faq> findByActiveYnOrderByViewCountDesc(String activeYn);

    List<Faq> findTop10ByActiveYnOrderByViewCountDesc(String activeYn);

    List<Faq> findByCategoryAndActiveYnOrderByViewCountDesc(String category, String activeYn);
}
