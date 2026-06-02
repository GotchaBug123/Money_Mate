package com.gotchabug.moneymate.controller.community;

import com.gotchabug.moneymate.dto.community.CommunityCommentCreateRequest;
import com.gotchabug.moneymate.dto.community.CommunityCommentResponse;
import com.gotchabug.moneymate.dto.community.CommunityCommentUpdateRequest;
import com.gotchabug.moneymate.dto.community.CommunityLikeResponse;
import com.gotchabug.moneymate.dto.community.CommunityMainResponse;
import com.gotchabug.moneymate.dto.community.CommunityPostCreateRequest;
import com.gotchabug.moneymate.dto.community.CommunityPostListResponse;
import com.gotchabug.moneymate.dto.community.CommunityPostPageResponse;
import com.gotchabug.moneymate.dto.community.CommunityPostResponse;
import com.gotchabug.moneymate.dto.community.CommunityPostUpdateRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.CommunityService;
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
@Tag(name = "Community", description = "커뮤니티 게시글, 댓글, 좋아요 API")
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/main")
    @Operation(summary = "커뮤니티 메인 조회", description = "테마, 인기글 등 커뮤니티 메인 화면에 필요한 데이터를 조회합니다.")
    public CommunityMainResponse getCommunityMain() {
        return communityService.getCommunityMain();
    }

    @GetMapping("/themes")
    @Operation(summary = "커뮤니티 테마 조회", description = "활성화된 커뮤니티 테마 목록을 조회합니다.")
    public List<CommunityMainResponse.ThemeResponse> getThemes() {
        return communityService.getThemes();
    }

    @GetMapping("/posts")
    @Operation(summary = "게시글 목록 조회", description = "키워드, 테마, 카테고리 조건으로 게시글 목록을 페이지 단위로 조회합니다.")
    public CommunityPostPageResponse getPosts(
            @Parameter(description = "검색 키워드", example = "삼성전자")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "테마 ID", example = "1")
            @RequestParam(required = false) Long themeId,
            @Parameter(description = "카테고리", example = "FREE")
            @RequestParam(required = false) String category,
            @Parameter(description = "페이지 번호, 0부터 시작", example = "0")
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

    @GetMapping("/posts/stock/{stockSymbol}")
    @Operation(summary = "종목별 게시글 조회", description = "종목코드 기준으로 관련 커뮤니티 게시글을 조회합니다.")
    public CommunityPostPageResponse getPostsByStockSymbol(
            @Parameter(description = "종목코드", example = "005930")
            @PathVariable String stockSymbol,
            @Parameter(description = "페이지 번호, 0부터 시작", example = "0")
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

    @GetMapping("/posts/popular")
    @Operation(summary = "인기 게시글 조회", description = "조회수와 좋아요 수 기준의 인기 게시글 목록을 조회합니다.")
    public List<CommunityPostListResponse> getPopularPosts(
            @Parameter(description = "조회할 인기글 개수", example = "5")
            @RequestParam(defaultValue = "5") int limit
    ) {
        return communityService.getPopularPosts(limit);
    }

    @GetMapping("/posts/{postId}")
    @Operation(summary = "게시글 상세 조회", description = "게시글 상세 정보와 댓글, 첨부파일, 좋아요 상태를 조회합니다.")
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

    @PostMapping(
            value = "/posts",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "게시글 작성", description = "로그인 사용자가 JSON 요청으로 커뮤니티 게시글을 작성합니다.")
    public CommunityPostResponse createPost(
            @Valid @RequestBody CommunityPostCreateRequest request,
            HttpSession session
    ) {
        return communityService.createPost(
                getRequiredLoginUserId(session),
                request
        );
    }

    @PostMapping(
            value = "/posts",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "첨부파일 포함 게시글 작성", description = "로그인 사용자가 multipart/form-data 요청으로 첨부파일을 포함한 게시글을 작성합니다.")
    public CommunityPostResponse createPostWithFiles(
            @RequestParam(required = false) Long themeId,
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String stockSymbol,
            @RequestParam(required = false) String stockName,
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

    @PutMapping(
            value = "/posts/{postId}",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "게시글 수정", description = "작성자가 JSON 요청으로 게시글 내용을 수정합니다.")
    public CommunityPostResponse updatePost(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,
            @Valid @RequestBody CommunityPostUpdateRequest request,
            HttpSession session
    ) {
        return communityService.updatePost(
                getRequiredLoginUserId(session),
                postId,
                request
        );
    }

    @PutMapping(
            value = "/posts/{postId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Operation(summary = "첨부파일 포함 게시글 수정", description = "작성자가 multipart/form-data 요청으로 첨부파일을 포함해 게시글을 수정합니다.")
    public CommunityPostResponse updatePostWithFiles(
            @Parameter(description = "게시글 ID", example = "1")
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

    @DeleteMapping("/posts/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "게시글 삭제", description = "작성자가 게시글을 삭제합니다.")
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

    @GetMapping("/my-posts")
    @Operation(summary = "내 게시글 조회", description = "로그인 사용자가 작성한 게시글 목록을 페이지 단위로 조회합니다.")
    public CommunityPostPageResponse getMyPosts(
            HttpSession session,
            @Parameter(description = "페이지 번호, 0부터 시작", example = "0")
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

    @GetMapping("/posts/{postId}/comments")
    @Operation(summary = "댓글 목록 조회", description = "게시글 ID에 해당하는 댓글 목록을 조회합니다.")
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

    @PostMapping("/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "댓글 작성", description = "로그인 사용자가 게시글에 댓글을 작성합니다.")
    public CommunityCommentResponse createComment(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,
            @Valid @RequestBody CommunityCommentCreateRequest request,
            HttpSession session
    ) {
        return communityService.createComment(
                getRequiredLoginUserId(session),
                postId,
                request
        );
    }

    @PutMapping("/comments/{commentId}")
    @Operation(summary = "댓글 수정", description = "댓글 작성자가 댓글 내용을 수정합니다.")
    public CommunityCommentResponse updateComment(
            @Parameter(description = "댓글 ID", example = "1")
            @PathVariable Long commentId,
            @Valid @RequestBody CommunityCommentUpdateRequest request,
            HttpSession session
    ) {
        return communityService.updateComment(
                getRequiredLoginUserId(session),
                commentId,
                request
        );
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "댓글 삭제", description = "댓글 작성자가 댓글을 삭제합니다.")
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

    @PostMapping("/posts/{postId}/like")
    @Operation(summary = "게시글 좋아요", description = "로그인 사용자가 게시글에 좋아요를 추가합니다.")
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

    @DeleteMapping("/posts/{postId}/like")
    @Operation(summary = "게시글 좋아요 취소", description = "로그인 사용자가 게시글 좋아요를 취소합니다.")
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
