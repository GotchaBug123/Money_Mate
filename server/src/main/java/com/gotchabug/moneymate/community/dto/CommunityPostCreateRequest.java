package com.gotchabug.moneymate.community.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostCreateRequest {

    private Long themeId;

    @NotBlank
    @Size(max = 30)
    private String category;

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    private String content;

    @Size(max = 30)
    private String stockSymbol;

    @Size(max = 100)
    private String stockName;

    @Valid
    @Size(max = 10)
    private List<AttachmentRequest> attachments;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentRequest {

        @Size(max = 500)
        private String attachmentUrl;

        @Size(max = 255)
        private String attachmentName;
    }
}
