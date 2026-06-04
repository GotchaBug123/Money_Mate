package com.gotchabug.moneymate.community.controller;

import com.gotchabug.moneymate.community.dto.*;
import com.gotchabug.moneymate.community.service.CommunityService;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community")
@Tag(name = "커뮤니티", description = "커뮤니티 게시글, 댓글, 좋아요 API")
public class CommunityController {

    private final CommunityService communityService;

    @Operation(summary = "커뮤니티 메인 조회")
    @GetMapping("/main")
    public ResponseEntity<CommunityMainResponse> getCommunityMain() {
        return ResponseEntity.ok(communityService.getCommunityMain());
    }

    @Operation(summary = "커뮤니티 테마 조회")
    @GetMapping("/themes")
    public ResponseEntity<List<CommunityMainResponse.ThemeResponse>> getThemes() {
        return ResponseEntity.ok(communityService.getThemes());
    }

    @Operation(summary = "게시글 목록 조회")
    @GetMapping("/posts")
    public ResponseEntity<CommunityPostPageResponse> getPosts(
            @Parameter(description = "검색 키워드", example = "AI")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "테마 ID", example = "1")
            @RequestParam(required = false) Long themeId,

            @Parameter(description = "카테고리", example = "STOCK")
            @RequestParam(required = false) String category,

            @Parameter(description = "페이지 번호", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "페이지 크기", example = "20")
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(
                communityService.getPosts(keyword, themeId, category, page, size)
        );
    }

    @Operation(summary = "종목별 게시글 조회")
    @GetMapping("/posts/stock/{stockSymbol}")
    public ResponseEntity<CommunityPostPageResponse> getPostsByStockSymbol(
            @Parameter(description = "종목 코드", example = "005930")
            @PathVariable String stockSymbol,

            @Parameter(description = "페이지 번호", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "페이지 크기", example = "20")
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(
                communityService.getPostsByStockSymbol(stockSymbol, page, size)
        );
    }

    @Operation(summary = "인기 게시글 조회")
    @GetMapping("/posts/popular")
    public ResponseEntity<List<CommunityPostListResponse>> getPopularPosts(
            @Parameter(description = "조회할 인기 게시글 개수", example = "5")
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(communityService.getPopularPosts(limit));
    }

    @Operation(summary = "게시글 상세 조회")
    @GetMapping("/posts/{postId}")
    public ResponseEntity<CommunityPostResponse> getPostDetail(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,
            HttpSession session
    ) {
        return ResponseEntity.ok(
                communityService.getPostDetail(postId, getOptionalLoginUserId(session))
        );
    }

    @Operation(summary = "게시글 작성(JSON)")
    @PostMapping(
            value = "/posts",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<CommunityPostResponse> createPost(
            @Valid @RequestBody CommunityPostCreateRequest request,
            HttpSession session
    ) {
        CommunityPostResponse response = communityService.createPost(
                getRequiredLoginUserId(session),
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "게시글 작성(파일 업로드)")
    @PostMapping(
            value = "/posts",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<CommunityPostResponse> createPostWithFiles(
            @RequestParam(required = false) Long themeId,
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String stockSymbol,
            @RequestParam(required = false) String stockName,
            @RequestParam(required = false) List<MultipartFile> files,
            HttpSession session
    ) {
        CommunityPostCreateRequest request = new CommunityPostCreateRequest(
                themeId,
                category,
                title,
                content,
                stockSymbol,
                stockName,
                null
        );

        CommunityPostResponse response = communityService.createPost(
                getRequiredLoginUserId(session),
                request,
                files
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "게시글 수정(JSON)")
    @PutMapping(
            value = "/posts/{postId}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<CommunityPostResponse> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody CommunityPostUpdateRequest request,
            HttpSession session
    ) {
        return ResponseEntity.ok(
                communityService.updatePost(
                        getRequiredLoginUserId(session),
                        postId,
                        request
                )
        );
    }

    @Operation(summary = "게시글 수정(파일 업로드)")
    @PutMapping(
            value = "/posts/{postId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<CommunityPostResponse> updatePostWithFiles(
            @PathVariable Long postId,
            @RequestParam(required = false) Long themeId,
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String stockSymbol,
            @RequestParam(required = false) String stockName,
            @RequestParam(required = false) List<MultipartFile> files,
            HttpSession session
    ) {
        CommunityPostUpdateRequest request = new CommunityPostUpdateRequest(
                themeId,
                category,
                title,
                content,
                stockSymbol,
                stockName,
                null
        );

        return ResponseEntity.ok(
                communityService.updatePost(
                        getRequiredLoginUserId(session),
                        postId,
                        request,
                        files
                )
        );
    }

    @Operation(summary = "게시글 삭제")
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        communityService.deletePost(
                getRequiredLoginUserId(session),
                postId
        );

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "내 게시글 조회")
    @GetMapping("/my-posts")
    public ResponseEntity<CommunityPostPageResponse> getMyPosts(
            HttpSession session,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(
                communityService.getMyPosts(
                        getRequiredLoginUserId(session),
                        page,
                        size
                )
        );
    }

    @Operation(summary = "댓글 목록 조회")
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommunityCommentResponse>> getComments(
            @PathVariable Long postId,
            HttpSession session
    ) {
        return ResponseEntity.ok(
                communityService.getComments(
                        postId,
                        getOptionalLoginUserId(session)
                )
        );
    }

    @Operation(summary = "댓글 작성")
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommunityCommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommunityCommentCreateRequest request,
            HttpSession session
    ) {
        CommunityCommentResponse response = communityService.createComment(
                getRequiredLoginUserId(session),
                postId,
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "댓글 수정")
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommunityCommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommunityCommentUpdateRequest request,
            HttpSession session
    ) {
        return ResponseEntity.ok(
                communityService.updateComment(
                        getRequiredLoginUserId(session),
                        commentId,
                        request
                )
        );
    }

    @Operation(summary = "댓글 삭제")
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            HttpSession session
    ) {
        communityService.deleteComment(
                getRequiredLoginUserId(session),
                commentId
        );

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "게시글 좋아요")
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<CommunityLikeResponse> likePost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        return ResponseEntity.ok(
                communityService.likePost(
                        getRequiredLoginUserId(session),
                        postId
                )
        );
    }

    @Operation(summary = "게시글 좋아요 취소")
    @DeleteMapping("/posts/{postId}/like")
    public ResponseEntity<CommunityLikeResponse> unlikePost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        return ResponseEntity.ok(
                communityService.unlikePost(
                        getRequiredLoginUserId(session),
                        postId
                )
        );
    }

    private Long getRequiredLoginUserId(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return member.getMemberId();
    }

    private Long getOptionalLoginUserId(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (loginUser instanceof Member member) {
            return member.getMemberId();
        }

        return null;
    }
}