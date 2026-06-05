package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.community.dto.CommunityPostCreateRequest;
import com.gotchabug.moneymate.community.dto.CommunityPostPageResponse;
import com.gotchabug.moneymate.community.dto.CommunityPostUpdateRequest;
import com.gotchabug.moneymate.community.service.CommunityService;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
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

    @Operation(summary = "게시글 수정")
    @PutMapping(value = "/posts/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,

            @RequestParam(required = false) Long themeId,
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String stockSymbol,
            @RequestParam(required = false) String stockName,

            @RequestParam(required = false) List<String> attachmentUrl,
            @RequestParam(required = false) List<String> attachmentName,
            @RequestPart(required = false) List<MultipartFile> files,

            HttpSession session
    ) {
        checkAdmin(session);

        CommunityPostUpdateRequest request = new CommunityPostUpdateRequest(
                themeId,
                category,
                title,
                content,
                stockSymbol,
                stockName,
                createAttachmentRequests(attachmentUrl, attachmentName)
        );

        communityService.updatePostByAdmin(
                postId,
                request,
                files == null ? List.of() : files
        );

        return ResponseEntity.ok(Map.of(
                "message", "게시글이 수정되었습니다.",
                "postId", postId
        ));
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

    private List<CommunityPostCreateRequest.AttachmentRequest> createAttachmentRequests(
            List<String> attachmentUrls,
            List<String> attachmentNames
    ) {
        if (attachmentUrls == null || attachmentNames == null) {
            return List.of();
        }

        int size = Math.min(attachmentUrls.size(), attachmentNames.size());
        List<CommunityPostCreateRequest.AttachmentRequest> attachments = new ArrayList<>();

        for (int index = 0; index < size; index++) {
            String url = normalize(attachmentUrls.get(index));
            String name = normalize(attachmentNames.get(index));

            if (url == null || name == null) {
                continue;
            }

            attachments.add(new CommunityPostCreateRequest.AttachmentRequest(url, name));
        }

        return attachments;
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}