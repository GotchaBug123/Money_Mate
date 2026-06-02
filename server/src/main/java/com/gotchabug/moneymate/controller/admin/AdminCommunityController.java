package com.gotchabug.moneymate.controller.admin;

import com.gotchabug.moneymate.dto.community.CommunityPostCreateRequest;
import com.gotchabug.moneymate.dto.community.CommunityPostPageResponse;
import com.gotchabug.moneymate.dto.community.CommunityPostUpdateRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.CommunityService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

@io.swagger.v3.oas.annotations.Hidden
@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/community")
public class AdminCommunityController {

    private final CommunityService communityService;

    @GetMapping({"", "/posts"})
    public String communityPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpSession session,
            Model model
    ) {
        String redirect = getAdminRedirect(session);
        if (redirect != null) {
            return redirect;
        }

        addAdminModel(session, model);

        CommunityPostPageResponse postPage = communityService.getPosts(
                null,
                null,
                null,
                page,
                size
        );

        model.addAttribute("postPage", postPage);
        model.addAttribute("posts", postPage.getPosts());

        return "admin/community/list";
    }

    @GetMapping("/posts/{postId}")
    public String communityPostDetail(
            @PathVariable Long postId,
            HttpSession session,
            Model model
    ) {
        String redirect = getAdminRedirect(session);
        if (redirect != null) {
            return redirect;
        }

        addAdminModel(session, model);
        model.addAttribute("post", communityService.getPostForAdmin(postId));

        return "admin/community/detail";
    }

    @GetMapping("/posts/{postId}/edit")
    public String communityPostEditForm(
            @PathVariable Long postId,
            HttpSession session,
            Model model
    ) {
        String redirect = getAdminRedirect(session);
        if (redirect != null) {
            return redirect;
        }

        addAdminModel(session, model);
        model.addAttribute("post", communityService.getPostForAdmin(postId));

        return "admin/community/edit";
    }

    @PostMapping("/posts/{postId}/edit")
    public String communityPostEdit(
            @PathVariable Long postId,
            @RequestParam(required = false) Long themeId,
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String stockSymbol,
            @RequestParam(required = false) String stockName,
            @RequestParam(required = false) List<String> attachmentUrl,
            @RequestParam(required = false) List<String> attachmentName,
            @RequestParam(required = false) List<MultipartFile> files,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        String redirect = getAdminRedirect(session);
        if (redirect != null) {
            return redirect;
        }

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
        redirectAttributes.addFlashAttribute("message", "게시글이 수정되었습니다.");

        return "redirect:/admin/community/posts/" + postId;
    }

    @PostMapping("/posts/{postId}/delete")
    public String communityPostDelete(
            @PathVariable Long postId,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        String redirect = getAdminRedirect(session);
        if (redirect != null) {
            return redirect;
        }

        communityService.deletePostByAdmin(postId);
        redirectAttributes.addFlashAttribute("message", "게시글이 삭제되었습니다.");

        return "redirect:/admin/community";
    }

    private void addAdminModel(
            HttpSession session,
            Model model
    ) {
        model.addAttribute("adminUser", session.getAttribute("loginUser"));
    }

    private String getAdminRedirect(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            return "redirect:/login";
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            return "redirect:/main";
        }

        return null;
    }

    private List<CommunityPostCreateRequest.AttachmentRequest> createAttachmentRequests(
            List<String> attachmentUrls,
            List<String> attachmentNames
    ) {
        if (attachmentUrls == null || attachmentNames == null) {
            return List.of();
        }

        int size = Math.min(attachmentUrls.size(), attachmentNames.size());
        List<CommunityPostCreateRequest.AttachmentRequest> attachments =
                new ArrayList<>();

        for (int index = 0; index < size; index++) {
            String url = normalize(attachmentUrls.get(index));
            String name = normalize(attachmentNames.get(index));

            if (url == null || name == null) {
                continue;
            }

            attachments.add(new CommunityPostCreateRequest.AttachmentRequest(
                    url,
                    name
            ));
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
