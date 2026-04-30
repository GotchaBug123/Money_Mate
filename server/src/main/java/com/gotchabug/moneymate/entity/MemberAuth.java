package com.gotchabug.moneymate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member_auth")
public class MemberAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long authId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private String passwordHash;

    private LocalDateTime lastLoginAt;

    @Column(nullable = false)
    private int loginFailCount = 0;

    @Column(nullable = false, length = 1)
    private String accountLockedYn = "N";

    private LocalDateTime createdAt;

    @Builder
    public MemberAuth(Member member, String passwordHash) {
        this.member = member;
        this.passwordHash = passwordHash;
        this.loginFailCount = 0;
        this.accountLockedYn = "N";
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public void loginSuccess() {
        this.lastLoginAt = LocalDateTime.now();
        this.loginFailCount = 0;
    }

    public void loginFail() {
        this.loginFailCount++;
    }
}