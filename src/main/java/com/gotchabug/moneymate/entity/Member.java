package com.gotchabug.moneymate.entity;


import com.gotchabug.moneymate.common.BaseTimeEntity;
import com.gotchabug.moneymate.enums.SignupStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "signup_status", nullable = false, length = 20)
    private SignupStatus signupStatus;

    public void update(String name, LocalDate birthDate, SignupStatus signupStatus) {
        this.name = name;
        this.birthDate = birthDate;
        this.signupStatus = signupStatus;
    }
}