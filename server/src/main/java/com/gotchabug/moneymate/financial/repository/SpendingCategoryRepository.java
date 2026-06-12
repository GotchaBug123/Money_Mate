package com.gotchabug.moneymate.financial.repository;


import com.gotchabug.moneymate.financial.entity.SpendingCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpendingCategoryRepository extends JpaRepository<SpendingCategory, Long> {
}