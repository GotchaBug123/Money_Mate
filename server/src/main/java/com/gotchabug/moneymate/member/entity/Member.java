package com.gotchabug.moneymate.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;
    @Column(nullable = false, unique = true, length = 50)
    private String loginId;
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    @Column(nullable = false, length = 50)
    private String name;
    private LocalDate birthDate;
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    @Column(nullable = false, length = 20)
    private String signupStatus = "ACTIVE";
    @Column(nullable = false, length = 20)
    private String role = "USER";
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public Member(String loginId, String email, String name, LocalDate birthDate) {
        this.loginId = loginId;
        this.email = email;
        this.name = name;
        this.birthDate = birthDate;
        this.signupStatus = "ACTIVE";
        this.role = "USER";
    }

    // @Setter는 클래스 상단에서 제거하고, 아래 메서드를 엔티티 내부에 추가하세요.[cite: 6]
    public void updateMyInfo(String name, String email, LocalDate birthDate) {
        this.name = name;
        this.email = email;
        
        if (birthDate != null) {
            this.birthDate = birthDate;
        }
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateAdminInfo(String name, String email, String role, String signupStatus) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.signupStatus = signupStatus;
    }
}
