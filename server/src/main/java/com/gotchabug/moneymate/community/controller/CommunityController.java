package com.gotchabug.moneymate.community.controller;

import com.gotchabug.moneymate.community.dto.CommunityCommentCreateRequest;
import com.gotchabug.moneymate.community.dto.CommunityCommentResponse;
import com.gotchabug.moneymate.community.dto.CommunityCommentUpdateRequest;
import com.gotchabug.moneymate.community.dto.CommunityLikeResponse;
import com.gotchabug.moneymate.community.dto.CommunityMainResponse;
import com.gotchabug.moneymate.community.dto.CommunityPostCreateRequest;
import com.gotchabug.moneymate.community.dto.CommunityPostListResponse;
import com.gotchabug.moneymate.community.dto.CommunityPostPageResponse;
import com.gotchabug.moneymate.community.dto.CommunityPostResponse;
import com.gotchabug.moneymate.community.dto.CommunityPostUpdateRequest;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.community.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/community")
@Tag(name = "커뮤니티", description = "커뮤니티 게시글, 댓글, 좋아요 API")
public class CommunityController {

    private final CommunityService communityService;

    @Operation(
            summary = "커뮤니티 메인 조회",
            description = "테마, 인기글 등 커뮤니티 메인 화면에 필요한 데이터를 조회합니다."
    )
    @GetMapping("/main")
    public CommunityMainResponse getCommunityMain() {
        return communityService.getCommunityMain();
    }

    @Operation(
            summary = "커뮤니티 테마 조회",
            description = "활성화된 커뮤니티 테마 목록을 조회합니다."
    )
    @GetMapping("/themes")
    public List<CommunityMainResponse.ThemeResponse> getThemes() {
        return communityService.getThemes();
    }

    @Operation(
            summary = "게시글 목록 조회",
            description = "키워드, 테마, 카테고리 조건으로 게시글 목록을 페이지 단위로 조회합니다."
    )
    @GetMapping("/posts")
    public CommunityPostPageResponse getPosts(
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
        return communityService.getPosts(
                keyword,
                themeId,
                category,
                page,
                size
        );
    }

    @Operation(
            summary = "종목별 게시글 조회",
            description = "특정 종목 코드와 관련된 게시글 목록을 페이지 단위로 조회합니다."
    )
    @GetMapping("/posts/stock/{stockSymbol}")
    public CommunityPostPageResponse getPostsByStockSymbol(
            @Parameter(description = "종목 코드", example = "005930")
            @PathVariable String stockSymbol,

            @Parameter(description = "페이지 번호", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "페이지 크기", example = "20")
            @RequestParam(defaultValue = "20") int size
    ) {
        return communityService.getPostsByStockSymbol(
                stockSymbol,
                page,
                size
        );
    }

    @Operation(
            summary = "인기 게시글 조회",
            description = "조회수와 좋아요 수 기준의 인기 게시글 목록을 조회합니다."
    )
    @GetMapping("/posts/popular")
    public List<CommunityPostListResponse> getPopularPosts(
            @Parameter(description = "조회할 인기 게시글 개수", example = "5")
            @RequestParam(defaultValue = "5") int limit
    ) {
        return communityService.getPopularPosts(limit);
    }

    @Operation(
            summary = "게시글 상세 조회",
            description = "게시글 상세 정보와 댓글, 첨부파일, 좋아요 상태를 조회합니다."
    )
    @GetMapping("/posts/{postId}")
    public CommunityPostResponse getPostDetail(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            HttpSession session
    ) {
        return communityService.getPostDetail(
                postId,
                getOptionalLoginUserId(session)
        );
    }

    @Operation(
            summary = "게시글 작성(JSON)",
            description = "로그인 사용자가 JSON 요청으로 커뮤니티 게시글을 작성합니다."
    )
    @PostMapping(
            value = "/posts",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public CommunityPostResponse createPost(
            @Parameter(description = "게시글 작성 요청 정보")
            @Valid @RequestBody CommunityPostCreateRequest request,

            HttpSession session
    ) {
        return communityService.createPost(
                getRequiredLoginUserId(session),
                request
        );
    }

    @Operation(
            summary = "게시글 작성(파일 업로드)",
            description = "로그인 사용자가 첨부파일과 함께 커뮤니티 게시글을 작성합니다."
    )
    @PostMapping(
            value = "/posts",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public CommunityPostResponse createPostWithFiles(
            @Parameter(description = "테마 ID", example = "1")
            @RequestParam(required = false) Long themeId,

            @Parameter(description = "카테고리", example = "STOCK")
            @RequestParam String category,

            @Parameter(description = "게시글 제목", example = "AI 관련주 전망")
            @RequestParam String title,

            @Parameter(description = "게시글 내용", example = "AI 관련주에 대한 의견입니다.")
            @RequestParam String content,

            @Parameter(description = "종목 코드", example = "005930")
            @RequestParam(required = false) String stockSymbol,

            @Parameter(description = "종목명", example = "삼성전자")
            @RequestParam(required = false) String stockName,

            @Parameter(description = "첨부파일 목록")
            @RequestParam(required = false) List<MultipartFile> files,

            HttpSession session
    ) {
        CommunityPostCreateRequest request =
                new CommunityPostCreateRequest(
                        themeId,
                        category,
                        title,
                        content,
                        stockSymbol,
                        stockName,
                        null
                );

        return communityService.createPost(
                getRequiredLoginUserId(session),
                request,
                files
        );
    }

    @Operation(
            summary = "게시글 수정(JSON)",
            description = "작성자가 JSON 요청으로 게시글 내용을 수정합니다."
    )
    @PutMapping(
            value = "/posts/{postId}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public CommunityPostResponse updatePost(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            @Parameter(description = "게시글 수정 요청 정보")
            @Valid @RequestBody CommunityPostUpdateRequest request,

            HttpSession session
    ) {
        return communityService.updatePost(
                getRequiredLoginUserId(session),
                postId,
                request
        );
    }

    @Operation(
            summary = "게시글 수정(파일 업로드)",
            description = "작성자가 첨부파일과 함께 게시글 내용을 수정합니다."
    )
    @PutMapping(
            value = "/posts/{postId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CommunityPostResponse updatePostWithFiles(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            @Parameter(description = "테마 ID", example = "1")
            @RequestParam(required = false) Long themeId,

            @Parameter(description = "카테고리", example = "STOCK")
            @RequestParam String category,

            @Parameter(description = "게시글 제목", example = "AI 관련주 전망 수정")
            @RequestParam String title,

            @Parameter(description = "게시글 내용", example = "수정된 게시글 내용입니다.")
            @RequestParam String content,

            @Parameter(description = "종목 코드", example = "005930")
            @RequestParam(required = false) String stockSymbol,

            @Parameter(description = "종목명", example = "삼성전자")
            @RequestParam(required = false) String stockName,

            @Parameter(description = "첨부파일 목록")
            @RequestParam(required = false) List<MultipartFile> files,

            HttpSession session
    ) {
        CommunityPostUpdateRequest request =
                new CommunityPostUpdateRequest(
                        themeId,
                        category,
                        title,
                        content,
                        stockSymbol,
                        stockName,
                        null
                );

        return communityService.updatePost(
                getRequiredLoginUserId(session),
                postId,
                request,
                files
        );
    }

    @Operation(
            summary = "게시글 삭제",
            description = "작성자가 게시글을 삭제합니다."
    )
    @DeleteMapping("/posts/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            HttpSession session
    ) {
        communityService.deletePost(
                getRequiredLoginUserId(session),
                postId
        );
    }

    @Operation(
            summary = "내 게시글 조회",
            description = "로그인 사용자가 작성한 게시글 목록을 페이지 단위로 조회합니다."
    )
    @GetMapping("/my-posts")
    public CommunityPostPageResponse getMyPosts(
            HttpSession session,

            @Parameter(description = "페이지 번호", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "페이지 크기", example = "20")
            @RequestParam(defaultValue = "20") int size
    ) {
        return communityService.getMyPosts(
                getRequiredLoginUserId(session),
                page,
                size
        );
    }

    @Operation(
            summary = "댓글 목록 조회",
            description = "특정 게시글의 댓글 목록을 조회합니다."
    )
    @GetMapping("/posts/{postId}/comments")
    public List<CommunityCommentResponse> getComments(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            HttpSession session
    ) {
        return communityService.getComments(
                postId,
                getOptionalLoginUserId(session)
        );
    }

    @Operation(
            summary = "댓글 작성",
            description = "로그인 사용자가 게시글에 댓글을 작성합니다."
    )
    @PostMapping("/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommunityCommentResponse createComment(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            @Parameter(description = "댓글 작성 요청 정보")
            @Valid @RequestBody CommunityCommentCreateRequest request,

            HttpSession session
    ) {
        return communityService.createComment(
                getRequiredLoginUserId(session),
                postId,
                request
        );
    }

    @Operation(
            summary = "댓글 수정",
            description = "작성자가 댓글 내용을 수정합니다."
    )
    @PutMapping("/comments/{commentId}")
    public CommunityCommentResponse updateComment(
            @Parameter(description = "댓글 ID", example = "1")
            @PathVariable Long commentId,

            @Parameter(description = "댓글 수정 요청 정보")
            @Valid @RequestBody CommunityCommentUpdateRequest request,

            HttpSession session
    ) {
        return communityService.updateComment(
                getRequiredLoginUserId(session),
                commentId,
                request
        );
    }

    @Operation(
            summary = "댓글 삭제",
            description = "작성자가 댓글을 삭제합니다."
    )
    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(
            @Parameter(description = "댓글 ID", example = "1")
            @PathVariable Long commentId,

            HttpSession session
    ) {
        communityService.deleteComment(
                getRequiredLoginUserId(session),
                commentId
        );
    }

    @Operation(
            summary = "게시글 좋아요",
            description = "로그인 사용자가 게시글에 좋아요를 추가합니다."
    )
    @PostMapping("/posts/{postId}/like")
    public CommunityLikeResponse likePost(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            HttpSession session
    ) {
        return communityService.likePost(
                getRequiredLoginUserId(session),
                postId
        );
    }

    @Operation(
            summary = "게시글 좋아요 취소",
            description = "로그인 사용자가 게시글 좋아요를 취소합니다."
    )
    @DeleteMapping("/posts/{postId}/like")
    public CommunityLikeResponse unlikePost(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            HttpSession session
    ) {
        return communityService.unlikePost(
                getRequiredLoginUserId(session),
                postId
        );
    }

    private Long getRequiredLoginUserId(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Login is required."
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