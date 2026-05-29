package com.gotchabug.moneymate.controller;

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
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/main")
    public CommunityMainResponse getCommunityMain() {
        return communityService.getCommunityMain();
    }

    @GetMapping("/themes")
    public List<CommunityMainResponse.ThemeResponse> getThemes() {
        return communityService.getThemes();
    }

    @GetMapping("/posts")
    public CommunityPostPageResponse getPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long themeId,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
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
    public CommunityPostPageResponse getPostsByStockSymbol(
            @PathVariable String stockSymbol,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return communityService.getPostsByStockSymbol(
                stockSymbol,
                page,
                size
        );
    }

    @GetMapping("/posts/popular")
    public List<CommunityPostListResponse> getPopularPosts(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return communityService.getPopularPosts(limit);
    }

    @GetMapping("/posts/{postId}")
    public CommunityPostResponse getPostDetail(
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
    public CommunityPostResponse updatePost(
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
    public CommunityPostResponse updatePostWithFiles(
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
    public void deletePost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        communityService.deletePost(
                getRequiredLoginUserId(session),
                postId
        );
    }

    @GetMapping("/my-posts")
    public CommunityPostPageResponse getMyPosts(
            HttpSession session,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return communityService.getMyPosts(
                getRequiredLoginUserId(session),
                page,
                size
        );
    }

    @GetMapping("/posts/{postId}/comments")
    public List<CommunityCommentResponse> getComments(
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
    public CommunityCommentResponse createComment(
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
    public CommunityCommentResponse updateComment(
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
    public void deleteComment(
            @PathVariable Long commentId,
            HttpSession session
    ) {
        communityService.deleteComment(
                getRequiredLoginUserId(session),
                commentId
        );
    }

    @PostMapping("/posts/{postId}/like")
    public CommunityLikeResponse likePost(
            @PathVariable Long postId,
            HttpSession session
    ) {
        return communityService.likePost(
                getRequiredLoginUserId(session),
                postId
        );
    }

    @DeleteMapping("/posts/{postId}/like")
    public CommunityLikeResponse unlikePost(
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
