package com.gotchabug.moneymate.controller.community;

import com.gotchabug.moneymate.dto.community.CommunityCommentCreateRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.MemberRepository;
import com.gotchabug.moneymate.service.CommunityService;
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

@Controller
@RequiredArgsConstructor
public class FeaturePageController {

    private final CommunityService communityService;
    private final MemberRepository memberRepository;

    @GetMapping("/community")
    public String communityPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/index";
    }

    @GetMapping("/community/posts/view")
    public String communityPostsViewPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/posts-view";
    }

    @GetMapping("/community/posts/{postId}/view")
    public String communityPostDetailViewPage(
            @PathVariable Long postId,
            HttpSession session,
            Model model
    ) {
        addLoginModel(session, model);
        model.addAttribute("postId", postId);
        return "community/posts-view";
    }

    @GetMapping("/community/posts/new")
    public String communityPostNewPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/post-new";
    }

    @GetMapping("/community/my-posts/view")
    public String communityMyPostsViewPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "community/my-posts-view";
    }

    @GetMapping("/community/posts/{postId}/edit")
    public String communityPostEditPage(
            @PathVariable Long postId,
            HttpSession session,
            Model model
    ) {
        addLoginModel(session, model);
        model.addAttribute("postId", postId);
        return "community/post-edit";
    }

    @PostMapping("/community/posts/{postId}/comments/view")
    public String createCommunityCommentFromPage(
            @PathVariable Long postId,
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

    @GetMapping("/rebalancing")
    public String rebalancingPage(HttpSession session, Model model) {
        addLoginModel(session, model);
        return "rebalancing";
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
