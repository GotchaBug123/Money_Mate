package com.gotchabug.moneymate.community.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommunityLikeResponse {

    private Long postId;
    private Boolean liked;
    private Long likeCount;
}
