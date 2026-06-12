package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.admin.dto.AdminAssetMasterResponse;
import com.gotchabug.moneymate.admin.dto.AdminAssetResponse;
import com.gotchabug.moneymate.market.repository.AssetMasterRepository;
import com.gotchabug.moneymate.market.repository.AssetRepository;
import com.gotchabug.moneymate.member.entity.Member;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/assets")
public class AdminAssetApiController {

    private final AssetRepository assetRepository;
    private final AssetMasterRepository assetMasterRepository;

    @GetMapping
    public ResponseEntity<List<AdminAssetResponse>> getAssets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            HttpSession session
    ) {
        checkAdmin(session);

        List<AdminAssetResponse> response =
                assetRepository.findAll(PageRequest.of(page, size))
                        .getContent()
                        .stream()
                        .map(AdminAssetResponse::from)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/masters")
    public ResponseEntity<List<AdminAssetMasterResponse>> getAssetMasters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            HttpSession session
    ) {
        checkAdmin(session);

        List<AdminAssetMasterResponse> response =
                assetMasterRepository.findAll(PageRequest.of(page, size))
                        .getContent()
                        .stream()
                        .map(AdminAssetMasterResponse::from)
                        .toList();

        return ResponseEntity.ok(response);
    }

    private void checkAdmin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "관리자 권한이 필요합니다."
            );
        }
    }
}