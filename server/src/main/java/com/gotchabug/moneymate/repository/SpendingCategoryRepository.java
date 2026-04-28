package com.gotchabug.moneymate.repository;


import com.gotchabug.moneymate.entity.SpendingCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpendingCategoryRepository extends JpaRepository<SpendingCategory, Long> {
}