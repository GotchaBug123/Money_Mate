package com.gotchabug.moneymate.community.controller;

import com.gotchabug.moneymate.community.dto.CommunityCommentCreateRequest;
import com.gotchabug.moneymate.community.service.CommunityService;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Tag(
        name = "Community Page",
        description = "커뮤니티 임시 화면 이동 컨트롤러"
)
@Controller
@Hidden
@RequiredArgsConstructor
public class FeaturePageController {

    private final CommunityService communityService;
    private final MemberRepository memberRepository;

    @Operation(summary = "커뮤니티 메인 화면")
    @GetMapping("/community")
    public String communityPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/index";
    }

    @Operation(summary = "커뮤니티 게시글 목록 화면")
    @GetMapping("/community/posts/view")
    public String communityPostsViewPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/posts-view";
    }

    @Operation(summary = "커뮤니티 게시글 상세 화면")
    @GetMapping("/community/posts/{postId}/view")
    public String communityPostDetailViewPage(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            HttpSession session,
            Model model
    ) {
        addLoginModel(session, model);
        model.addAttribute("postId", postId);
        return "community/posts-view";
    }

    @Operation(summary = "커뮤니티 게시글 작성 화면")
    @GetMapping("/community/posts/new")
    public String communityPostNewPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/post-new";
    }

    @Operation(summary = "내 게시글 화면")
    @GetMapping("/community/my-posts/view")
    public String communityMyPostsViewPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/my-posts-view";
    }

    @Operation(summary = "커뮤니티 게시글 수정 화면")
    @GetMapping("/community/posts/{postId}/edit")
    public String communityPostEditPage(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            HttpSession session,
            Model model
    ) {
        addLoginModel(session, model);
        model.addAttribute("postId", postId);
        return "community/post-edit";
    }

    @Operation(summary = "댓글 등록 화면 처리")
    @PostMapping("/community/posts/{postId}/comments/view")
    public String createCommunityCommentFromPage(
            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            @Parameter(description = "댓글 내용", example = "좋은 글 감사합니다.")
            @RequestParam String content,

            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        try {
            Long memberId = resolvePageMemberId(session);
            communityService.createComment(
                    memberId,
                    postId,
                    new CommunityCommentCreateRequest(content)
            );
            redirectAttributes.addFlashAttribute(
                    "commentMessage",
                    "댓글이 등록되었습니다."
            );
        } catch (RuntimeException exception) {
            redirectAttributes.addFlashAttribute(
                    "commentError",
                    exception.getMessage()
            );
        }

        return "redirect:/community/posts/" + postId + "/view";
    }

    private void addLoginModel(HttpSession session, Model model) {
        Object loginUser = session.getAttribute("loginUser");

        if (loginUser instanceof Member member) {
            model.addAttribute("loggedIn", true);
            model.addAttribute("loginUserName", member.getName());
            return;
        }

        model.addAttribute("loggedIn", false);
        model.addAttribute("loginUserName", "");
    }

    private Long resolvePageMemberId(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (loginUser instanceof Member member) {
            return member.getMemberId();
        }

        return memberRepository.findAll(PageRequest.of(0, 1))
                .getContent()
                .stream()
                .findFirst()
                .map(Member::getMemberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "로그인 사용자가 없어 요청을 처리할 수 없습니다."
                ));
    }
}
