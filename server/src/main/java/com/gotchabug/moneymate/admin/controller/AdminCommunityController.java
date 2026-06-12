package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.community.dto.CommunityPostPageResponse;
import com.gotchabug.moneymate.community.service.CommunityService;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Tag(name = "관리자 커뮤니티", description = "관리자 커뮤니티 게시글 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/community")
public class AdminCommunityController {

    private final CommunityService communityService;

    @Operation(summary = "커뮤니티 게시글 목록 조회")
    @GetMapping({ "", "/posts" })
    public ResponseEntity<CommunityPostPageResponse> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpSession session
    ) {
        checkAdmin(session);

        CommunityPostPageResponse response = communityService.getPosts(
                null,
                null,
                null,
                page,
                size
        );

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "커뮤니티 게시글 상세 조회")
    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        checkAdmin(session);

        return ResponseEntity.ok(
                communityService.getPostForAdmin(postId)
        );
    }

    @Operation(summary = "게시글 삭제")
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        checkAdmin(session);

        communityService.deletePostByAdmin(postId);

        return ResponseEntity.ok(Map.of(
                "message", "게시글이 삭제되었습니다.",
                "postId", postId
        ));
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