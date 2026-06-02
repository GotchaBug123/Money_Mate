package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.community.dto.CommunityPostCreateRequest;
import com.gotchabug.moneymate.community.dto.CommunityPostPageResponse;
import com.gotchabug.moneymate.community.dto.CommunityPostUpdateRequest;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.community.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(
        name = "관리자 커뮤니티",
        description = "관리자 커뮤니티 게시글 관리 API"
)
@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/community")
public class AdminCommunityController {

    private final CommunityService communityService;

    @Operation(
            summary = "커뮤니티 게시글 목록 조회",
            description = "관리자가 커뮤니티 게시글 목록을 페이지 단위로 조회합니다."
    )
    @GetMapping({"", "/posts"})
    public String communityPosts(

            @Parameter(description = "페이지 번호", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "페이지 크기", example = "20")
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

    @Operation(
            summary = "커뮤니티 게시글 상세 조회",
            description = "관리자가 특정 게시글의 상세 내용을 조회합니다."
    )
    @GetMapping("/posts/{postId}")
    public String communityPostDetail(

            @Parameter(description = "게시글 ID", example = "1")
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

    @Operation(
            summary = "게시글 수정 화면 조회",
            description = "관리자가 게시글 수정 화면을 조회합니다."
    )
    @GetMapping("/posts/{postId}/edit")
    public String communityPostEditForm(

            @Parameter(description = "게시글 ID", example = "1")
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

    @Operation(
            summary = "게시글 수정",
            description = "관리자가 게시글 정보와 첨부파일을 수정합니다."
    )
    @PostMapping("/posts/{postId}/edit")
    public String communityPostEdit(

            @Parameter(description = "게시글 ID", example = "1")
            @PathVariable Long postId,

            @Parameter(description = "테마 ID", example = "1")
            @RequestParam(required = false) Long themeId,

            @Parameter(description = "카테고리", example = "AI")
            @RequestParam String category,

            @Parameter(description = "게시글 제목", example = "AI 관련주 전망")
            @RequestParam String title,

            @Parameter(description = "게시글 내용")
            @RequestParam String content,

            @Parameter(description = "종목 코드", example = "005930")
            @RequestParam(required = false) String stockSymbol,

            @Parameter(description = "종목명", example = "삼성전자")
            @RequestParam(required = false) String stockName,

            @Parameter(description = "기존 첨부파일 URL 목록")
            @RequestParam(required = false) List<String> attachmentUrl,

            @Parameter(description = "기존 첨부파일명 목록")
            @RequestParam(required = false) List<String> attachmentName,

            @Parameter(description = "신규 첨부파일")
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

    @Operation(
            summary = "게시글 삭제",
            description = "관리자가 특정 게시글을 삭제합니다."
    )
    @PostMapping("/posts/{postId}/delete")
    public String communityPostDelete(

            @Parameter(description = "게시글 ID", example = "1")
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