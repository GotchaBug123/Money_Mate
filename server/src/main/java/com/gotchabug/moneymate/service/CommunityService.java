package com.gotchabug.moneymate.service;

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
import com.gotchabug.moneymate.entity.CommunityAttachment;
import com.gotchabug.moneymate.entity.CommunityComment;
import com.gotchabug.moneymate.entity.CommunityPost;
import com.gotchabug.moneymate.entity.CommunityPostLike;
import com.gotchabug.moneymate.entity.CommunityTheme;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.CommunityCommentRepository;
import com.gotchabug.moneymate.repository.CommunityPostLikeRepository;
import com.gotchabug.moneymate.repository.CommunityPostRepository;
import com.gotchabug.moneymate.repository.CommunityThemeRepository;
import com.gotchabug.moneymate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityService {

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 50;
    private static final int MAIN_SECTION_LIMIT = 3;
    private static final int POPULAR_LIMIT = 5;
    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "INFO",
            "QUESTION",
            "FREE"
    );

    private final CommunityPostRepository communityPostRepository;
    private final CommunityThemeRepository communityThemeRepository;
    private final CommunityCommentRepository communityCommentRepository;
    private final CommunityPostLikeRepository communityPostLikeRepository;
    private final MemberRepository memberRepository;

    @Value("${moneymate.community.upload-dir:uploads/community}")
    private String uploadDir;

    @Value("${moneymate.community.upload-url-prefix:/uploads/community}")
    private String uploadUrlPrefix;

    public CommunityMainResponse getCommunityMain() {
        List<CommunityTheme> activeThemes = getActiveThemes();

        List<CommunityPostListResponse> popularPosts = communityPostRepository
                .findPopularPosts(PageRequest.of(0, POPULAR_LIMIT))
                .stream()
                .map(this::toListResponse)
                .toList();

        List<CommunityMainResponse.ThemeResponse> popularCommunities =
                findPopularThemes(activeThemes).stream()
                        .map(CommunityMainResponse.ThemeResponse::from)
                        .toList();

        List<CommunityMainResponse.CategorySection> categorySections =
                findMainCategorySections();

        return CommunityMainResponse.builder()
                .themes(activeThemes.stream()
                        .map(CommunityMainResponse.ThemeResponse::from)
                        .toList())
                .popularPosts(popularPosts)
                .popularCommunities(popularCommunities)
                .categorySections(categorySections)
                .build();
    }

    public List<CommunityMainResponse.ThemeResponse> getThemes() {
        return getActiveThemes().stream()
                .map(CommunityMainResponse.ThemeResponse::from)
                .toList();
    }

    public CommunityPostPageResponse getPosts(
            String keyword,
            Long themeId,
            String category,
            int page,
            int size
    ) {
        Page<CommunityPost> postPage = communityPostRepository.searchPosts(
                normalize(keyword),
                themeId,
                normalize(category),
                PageRequest.of(normalizePage(page), normalizeSize(size))
        );

        return toPageResponse(postPage);
    }

    public CommunityPostPageResponse getPostsByStockSymbol(
            String stockSymbol,
            int page,
            int size
    ) {
        Page<CommunityPost> postPage = communityPostRepository
                .findByStockSymbolOrderByCreatedAtDesc(
                        normalizeRequired(stockSymbol, "stockSymbol"),
                        PageRequest.of(normalizePage(page), normalizeSize(size))
                );

        return toPageResponse(postPage);
    }

    public List<CommunityPostListResponse> getPopularPosts(int limit) {
        return communityPostRepository
                .findPopularPosts(PageRequest.of(0, normalizeLimit(limit)))
                .stream()
                .map(this::toListResponse)
                .toList();
    }

    @Transactional
    public CommunityPostResponse getPostDetail(
            Long postId,
            Long currentMemberId
    ) {
        CommunityPost post = findPost(postId);
        post.increaseViewCount();

        return toDetailResponse(post, currentMemberId);
    }

    public CommunityPostResponse getPostForEdit(
            Long memberId,
            Long postId
    ) {
        CommunityPost post = findPost(postId);
        validatePostWriter(post, memberId);

        return toDetailResponse(post, memberId);
    }

    @Transactional
    public CommunityPostResponse createPost(
            Long memberId,
            CommunityPostCreateRequest request
    ) {
        return createPost(memberId, request, List.of());
    }

    @Transactional
    public CommunityPostResponse createPost(
            Long memberId,
            CommunityPostCreateRequest request,
            List<MultipartFile> files
    ) {
        Member member = findMember(memberId);
        CommunityTheme theme = findThemeOrNull(request.getThemeId());

        CommunityPost post = CommunityPost.builder()
                .member(member)
                .theme(theme)
                .category(normalizeRequired(request.getCategory(), "category"))
                .title(normalizeRequired(request.getTitle(), "title"))
                .content(normalizeRequired(request.getContent(), "content"))
                .stockSymbol(normalize(request.getStockSymbol()))
                .stockName(normalize(request.getStockName()))
                .viewCount(0L)
                .build();

        post.replaceAttachments(createAttachments(
                request.getAttachments(),
                files
        ));

        CommunityPost savedPost = communityPostRepository.save(post);

        return toDetailResponse(savedPost, memberId);
    }

    @Transactional
    public CommunityPostResponse updatePost(
            Long memberId,
            Long postId,
            CommunityPostUpdateRequest request
    ) {
        return updatePost(memberId, postId, request, List.of());
    }

    @Transactional
    public CommunityPostResponse updatePost(
            Long memberId,
            Long postId,
            CommunityPostUpdateRequest request,
            List<MultipartFile> files
    ) {
        CommunityPost post = findPost(postId);
        validatePostWriter(post, memberId);

        CommunityTheme theme = findThemeOrNull(request.getThemeId());

        post.update(
                theme,
                normalizeRequired(request.getCategory(), "category"),
                normalizeRequired(request.getTitle(), "title"),
                normalizeRequired(request.getContent(), "content"),
                normalize(request.getStockSymbol()),
                normalize(request.getStockName())
        );
        post.replaceAttachments(createAttachments(
                request.getAttachments(),
                files
        ));

        return toDetailResponse(post, memberId);
    }

    @Transactional
    public void deletePost(
            Long memberId,
            Long postId
    ) {
        CommunityPost post = findPost(postId);
        validatePostWriter(post, memberId);

        communityPostRepository.delete(post);
    }

    public CommunityPostPageResponse getMyPosts(
            Long memberId,
            int page,
            int size
    ) {
        findMember(memberId);

        Page<CommunityPost> postPage = communityPostRepository
                .findByMember_MemberIdOrderByCreatedAtDesc(
                        memberId,
                        PageRequest.of(normalizePage(page), normalizeSize(size))
                );

        return toPageResponse(postPage);
    }

    public List<CommunityCommentResponse> getComments(
            Long postId,
            Long currentMemberId
    ) {
        return communityCommentRepository
                .findByPost_PostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(comment -> CommunityCommentResponse.from(
                        comment,
                        currentMemberId
                ))
                .toList();
    }

    @Transactional
    public CommunityCommentResponse createComment(
            Long memberId,
            Long postId,
            CommunityCommentCreateRequest request
    ) {
        CommunityPost post = findPost(postId);
        Member member = findMember(memberId);

        CommunityComment comment = CommunityComment.builder()
                .post(post)
                .member(member)
                .content(normalizeRequired(request.getContent(), "content"))
                .build();

        CommunityComment savedComment = communityCommentRepository.save(comment);

        return CommunityCommentResponse.from(savedComment, memberId);
    }

    @Transactional
    public CommunityCommentResponse updateComment(
            Long memberId,
            Long commentId,
            CommunityCommentUpdateRequest request
    ) {
        CommunityComment comment = findComment(commentId);
        validateCommentWriter(comment, memberId);

        comment.updateContent(normalizeRequired(
                request.getContent(),
                "content"
        ));

        return CommunityCommentResponse.from(comment, memberId);
    }

    @Transactional
    public void deleteComment(
            Long memberId,
            Long commentId
    ) {
        CommunityComment comment = findComment(commentId);
        validateCommentWriter(comment, memberId);

        communityCommentRepository.delete(comment);
    }

    @Transactional
    public CommunityLikeResponse likePost(
            Long memberId,
            Long postId
    ) {
        CommunityPost post = findPost(postId);
        Member member = findMember(memberId);

        if (!communityPostLikeRepository
                .existsByPost_PostIdAndMember_MemberId(postId, memberId)) {
            communityPostLikeRepository.save(
                    CommunityPostLike.builder()
                            .post(post)
                            .member(member)
                            .build()
            );
        }

        return createLikeResponse(postId, true);
    }

    @Transactional
    public CommunityLikeResponse unlikePost(
            Long memberId,
            Long postId
    ) {
        communityPostLikeRepository
                .findByPost_PostIdAndMember_MemberId(postId, memberId)
                .ifPresent(communityPostLikeRepository::delete);

        return createLikeResponse(postId, false);
    }

    @Transactional
    public CommunityLikeResponse toggleLike(
            Long memberId,
            Long postId
    ) {
        if (communityPostLikeRepository
                .existsByPost_PostIdAndMember_MemberId(postId, memberId)) {
            return unlikePost(memberId, postId);
        }

        return likePost(memberId, postId);
    }

    private CommunityLikeResponse createLikeResponse(
            Long postId,
            boolean liked
    ) {
        return CommunityLikeResponse.builder()
                .postId(postId)
                .liked(liked)
                .likeCount(communityPostLikeRepository.countByPost_PostId(postId))
                .build();
    }

    private CommunityPostResponse toDetailResponse(
            CommunityPost post,
            Long currentMemberId
    ) {
        long likeCount = communityPostLikeRepository
                .countByPost_PostId(post.getPostId());
        boolean liked = currentMemberId != null
                && communityPostLikeRepository
                .existsByPost_PostIdAndMember_MemberId(
                        post.getPostId(),
                        currentMemberId
                );
        List<CommunityCommentResponse> comments = getComments(
                post.getPostId(),
                currentMemberId
        );

        return CommunityPostResponse.from(
                post,
                currentMemberId,
                likeCount,
                liked,
                comments
        );
    }

    private CommunityPostPageResponse toPageResponse(
            Page<CommunityPost> postPage
    ) {
        return CommunityPostPageResponse.builder()
                .posts(postPage.getContent()
                        .stream()
                        .map(this::toListResponse)
                        .toList())
                .page(postPage.getNumber())
                .size(postPage.getSize())
                .first(postPage.isFirst())
                .last(postPage.isLast())
                .hasPrevious(postPage.hasPrevious())
                .hasNext(postPage.hasNext())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .build();
    }

    private CommunityPostListResponse toListResponse(CommunityPost post) {
        return CommunityPostListResponse.from(
                post,
                communityPostLikeRepository.countByPost_PostId(post.getPostId())
        );
    }

    private List<CommunityTheme> getActiveThemes() {
        return communityThemeRepository
                .findByActiveYnOrderByDisplayOrderAscThemeNameAsc("Y");
    }

    private List<CommunityTheme> findPopularThemes(
            List<CommunityTheme> activeThemes
    ) {
        if (activeThemes.isEmpty()) {
            return List.of();
        }

        List<Long> popularThemeIds = communityPostRepository
                .findPopularThemeIds(PageRequest.of(0, POPULAR_LIMIT));

        if (popularThemeIds.isEmpty()) {
            return activeThemes.stream()
                    .limit(POPULAR_LIMIT)
                    .toList();
        }

        Map<Long, CommunityTheme> themeMap = activeThemes.stream()
                .collect(Collectors.toMap(
                        CommunityTheme::getThemeId,
                        Function.identity()
                ));

        List<CommunityTheme> popularThemes = new ArrayList<>();

        for (Long themeId : popularThemeIds) {
            CommunityTheme theme = themeMap.get(themeId);

            if (theme != null) {
                popularThemes.add(theme);
            }
        }

        if (popularThemes.size() >= POPULAR_LIMIT) {
            return popularThemes;
        }

        HashSet<Long> alreadyAdded = popularThemes.stream()
                .map(CommunityTheme::getThemeId)
                .collect(Collectors.toCollection(HashSet::new));

        for (CommunityTheme theme : activeThemes) {
            if (popularThemes.size() >= POPULAR_LIMIT) {
                break;
            }

            if (alreadyAdded.add(theme.getThemeId())) {
                popularThemes.add(theme);
            }
        }

        return popularThemes;
    }

    private List<CommunityMainResponse.CategorySection>
    findMainCategorySections() {
        List<String> categories = communityPostRepository
                .findDistinctCategories()
                .stream()
                .limit(MAIN_SECTION_LIMIT)
                .toList();

        if (categories.isEmpty()) {
            categories = DEFAULT_CATEGORIES;
        }

        return categories.stream()
                .map(category -> CommunityMainResponse.CategorySection.builder()
                        .category(category)
                        .posts(communityPostRepository
                                .findByCategoryOrderByCreatedAtDesc(
                                        category,
                                        PageRequest.of(0, MAIN_SECTION_LIMIT)
                                )
                                .stream()
                                .map(this::toListResponse)
                                .toList())
                        .build())
                .toList();
    }

    private CommunityPost findPost(Long postId) {
        return communityPostRepository.findDetailByPostId(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community post not found."
                ));
    }

    private CommunityComment findComment(Long commentId) {
        return communityCommentRepository.findByCommentId(commentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community comment not found."
                ));
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Member not found."
                ));
    }

    private CommunityTheme findThemeOrNull(Long themeId) {
        if (themeId == null) {
            return null;
        }

        CommunityTheme theme = communityThemeRepository.findById(themeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Community theme not found."
                ));

        if (!theme.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Inactive community theme."
            );
        }

        return theme;
    }

    private void validatePostWriter(
            CommunityPost post,
            Long memberId
    ) {
        if (!post.isWrittenBy(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the author can modify this post."
            );
        }
    }

    private void validateCommentWriter(
            CommunityComment comment,
            Long memberId
    ) {
        if (!comment.isWrittenBy(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the author can modify this comment."
            );
        }
    }

    private List<CommunityAttachment> createAttachments(
            List<CommunityPostCreateRequest.AttachmentRequest> requests,
            List<MultipartFile> files
    ) {
        List<CommunityAttachment> attachments = new ArrayList<>();

        attachments.addAll(createMetadataAttachments(requests));
        attachments.addAll(storeFiles(files));

        return attachments;
    }

    private List<CommunityAttachment> createMetadataAttachments(
            List<CommunityPostCreateRequest.AttachmentRequest> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }

        return requests.stream()
                .filter(request -> request != null
                        && hasText(request.getAttachmentUrl())
                        && hasText(request.getAttachmentName()))
                .map(request -> CommunityAttachment.of(
                        normalizeRequired(
                                request.getAttachmentUrl(),
                                "attachmentUrl"
                        ),
                        normalizeRequired(
                                request.getAttachmentName(),
                                "attachmentName"
                        )
                ))
                .toList();
    }

    private List<CommunityAttachment> storeFiles(
            List<MultipartFile> files
    ) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        try {
            Path uploadPath = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();
            Files.createDirectories(uploadPath);

            List<CommunityAttachment> attachments = new ArrayList<>();

            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) {
                    continue;
                }

                String originalFilename = StringUtils.cleanPath(
                        file.getOriginalFilename() == null
                                ? "attachment"
                                : file.getOriginalFilename()
                );
                String storedFilename = UUID.randomUUID()
                        + extractExtension(originalFilename);
                Path targetPath = uploadPath.resolve(storedFilename)
                        .normalize();

                if (!targetPath.startsWith(uploadPath)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid attachment path."
                    );
                }

                file.transferTo(targetPath);
                attachments.add(CommunityAttachment.of(
                        normalizeUploadUrlPrefix() + "/" + storedFilename,
                        originalFilename
                ));
            }

            return attachments;
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to store attachment file.",
                    exception
            );
        }
    }

    private String extractExtension(String filename) {
        int dotIndex = filename.lastIndexOf(".");

        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            return "";
        }

        return filename.substring(dotIndex);
    }

    private String normalizeUploadUrlPrefix() {
        String prefix = uploadUrlPrefix == null
                ? "/uploads/community"
                : uploadUrlPrefix.trim();

        if (prefix.endsWith("/")) {
            return prefix.substring(0, prefix.length() - 1);
        }

        return prefix;
    }

    private int normalizePage(int page) {
        return Math.max(0, page);
    }

    private int normalizeSize(int size) {
        if (size <= 0) {
            return DEFAULT_PAGE_SIZE;
        }

        return Math.min(size, MAX_PAGE_SIZE);
    }

    private int normalizeLimit(int limit) {
        if (limit <= 0) {
            return POPULAR_LIMIT;
        }

        return Math.min(limit, MAX_PAGE_SIZE);
    }

    private String normalizeRequired(
            String value,
            String fieldName
    ) {
        String normalizedValue = normalize(value);

        if (normalizedValue == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " is required."
            );
        }

        return normalizedValue;
    }

    private String normalize(String value) {
        if (!hasText(value)) {
            return null;
        }

        return value.trim();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
