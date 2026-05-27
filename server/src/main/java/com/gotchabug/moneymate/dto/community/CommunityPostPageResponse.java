package com.gotchabug.moneymate.dto.community;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CommunityPostPageResponse {

    private List<CommunityPostListResponse> posts;
    private int page;
    private int size;
    private boolean first;
    private boolean last;
    private boolean hasPrevious;
    private boolean hasNext;
    private long totalElements;
    private int totalPages;
}
