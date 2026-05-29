package com.gotchabug.moneymate.entity;

import com.gotchabug.moneymate.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "community_attachment")
public class CommunityAttachment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long attachmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @Column(name = "attachment_url", nullable = false, length = 500)
    private String attachmentUrl;

    @Column(name = "attachment_name", nullable = false, length = 255)
    private String attachmentName;

    public static CommunityAttachment of(
            String attachmentUrl,
            String attachmentName
    ) {
        return CommunityAttachment.builder()
                .attachmentUrl(attachmentUrl)
                .attachmentName(attachmentName)
                .build();
    }

    public void assignPost(CommunityPost post) {
        this.post = post;
    }
}
