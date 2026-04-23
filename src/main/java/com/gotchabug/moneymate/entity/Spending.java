package com.gotchabug.moneymate.entity;



import com.gotchabug.moneymate.common.BaseTimeEntity;
import com.gotchabug.moneymate.enums.InputSource;
import com.gotchabug.moneymate.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "spending")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Spending extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spending_id")
    private Long spendingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private SpendingCategory category;

    @Column(name = "spending_date", nullable = false)
    private LocalDate spendingDate;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "merchant_name", length = 100)
    private String merchantName;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 30)
    private PaymentMethod paymentMethod;

    @Column(length = 255)
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_source", nullable = false, length = 20)
    private InputSource inputSource;
}