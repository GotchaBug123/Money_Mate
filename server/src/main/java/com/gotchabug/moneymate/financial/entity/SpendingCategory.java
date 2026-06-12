package com.gotchabug.moneymate.financial.entity;


import com.gotchabug.moneymate.member.enums.EssentialYn;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.time.LocalDateTime;

@Entity
@Table(name = "spending_category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SpendingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false, unique = true, length = 50)
    private String categoryName;

    @Column(name = "parent_category", length = 50)
    private String parentCategory;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(Types.CHAR)
    @Column(name = "essential_yn", nullable = false, length = 1)
    private EssentialYn essentialYn;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}