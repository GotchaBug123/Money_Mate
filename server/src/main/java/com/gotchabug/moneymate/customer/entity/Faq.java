package com.gotchabug.moneymate.customer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "faq")
@Getter
@NoArgsConstructor
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faq_id")
    private Long faqId;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 255)
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Column(name = "active_yn", nullable = false, columnDefinition = "CHAR(1)")
    private String activeYn = "Y";

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}