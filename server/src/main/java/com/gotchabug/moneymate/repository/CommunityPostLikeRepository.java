package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.CommunityPostLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityPostLikeRepository
        extends JpaRepository<CommunityPostLike, Long> {

    long countByPost_PostId(Long postId);

    boolean existsByPost_PostIdAndMember_MemberId(
            Long postId,
            Long memberId
    );

    Optional<CommunityPostLike> findByPost_PostIdAndMember_MemberId(
            Long postId,
            Long memberId
    );
}
