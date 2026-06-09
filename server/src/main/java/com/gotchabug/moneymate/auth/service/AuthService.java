package com.gotchabug.moneymate.auth.service;

import com.gotchabug.moneymate.auth.dto.FindIdRequest;
import com.gotchabug.moneymate.auth.dto.FindPasswordRequest;
import com.gotchabug.moneymate.auth.dto.LoginRequest;
import com.gotchabug.moneymate.auth.dto.SignupRequest;
import com.gotchabug.moneymate.financial.entity.FinancialProfile;
import com.gotchabug.moneymate.financial.repository.FinancialProfileRepository;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.member.entity.MemberAuth;
import com.gotchabug.moneymate.member.repository.MemberAuthRepository;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String PASSWORD_HASH_PREFIX = "sha256:";

    private final MemberRepository memberRepository;
    private final MemberAuthRepository memberAuthRepository;
    private final FinancialProfileRepository financialProfileRepository;

    @Transactional
    public Member signup(SignupRequest request) {

        if (memberRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디");
        }

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 이메일");
        }

        Member member = Member.builder()
                .loginId(request.getLoginId())
                .email(request.getEmail())
                .name(request.getName())
                .birthDate(request.getBirthDate())
                .build();

        memberRepository.save(member);

        MemberAuth auth = MemberAuth.builder()
                .member(member)
                .passwordHash(hashPassword(request.getPassword()))
                .build();

        memberAuthRepository.save(auth);

        FinancialProfile profile = FinancialProfile.builder()
                .member(member)
                .build();

        financialProfileRepository.save(profile);

        return member;
    }

    @Transactional(readOnly = true)
    public boolean checkLoginIdAvailable(String loginId) {

        if (loginId == null || loginId.trim().isEmpty()) {
            throw new IllegalArgumentException("아이디를 입력해주세요.");
        }

        return !memberRepository.existsByLoginId(loginId.trim());
    }

    @Transactional
    public Member login(LoginRequest request) {

        Member member = memberRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다."));

        MemberAuth auth = memberAuthRepository.findByMember_MemberId(member.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("인증 정보가 없습니다."));

        if (!passwordMatches(request.getPassword(), auth.getPasswordHash())) {
            auth.loginFail();
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        auth.loginSuccess();

        return member;
    }

    @Transactional(readOnly = true)
    public String findId(FindIdRequest request) {

        Member member = memberRepository.findByNameAndEmail(
                        request.getName(),
                        request.getEmail()
                )
                .orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));

        return member.getLoginId();
    }

    @Transactional
    public void resetPassword(FindPasswordRequest request) {

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new IllegalArgumentException("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        Member member = memberRepository.findByLoginIdAndEmail(
                        request.getLoginId(),
                        request.getEmail()
                )
                .orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));

        MemberAuth auth = memberAuthRepository.findByMember(member)
                .orElseThrow(() -> new IllegalArgumentException("인증 정보가 없습니다."));

        if (passwordMatches(request.getNewPassword(), auth.getPasswordHash())) {
            throw new IllegalArgumentException("기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.");
        }

        auth.setPasswordHash(hashPassword(request.getNewPassword()));
    }

    private String hashPassword(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return PASSWORD_HASH_PREFIX + HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("비밀번호 암호화 알고리즘을 사용할 수 없습니다.", e);
        }
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        if (storedPassword == null) {
            return false;
        }

        if (storedPassword.startsWith(PASSWORD_HASH_PREFIX)) {
            return hashPassword(rawPassword).equals(storedPassword);
        }

        return storedPassword.equals(rawPassword);
    }
}