package com.gotchabug.moneymate.community.repository;

import com.gotchabug.moneymate.community.entity.CommunityPostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            DELETE FROM CommunityPostLike l
            WHERE l.post.postId = :postId
            """)
    void deleteByPostId(
            @Param("postId") Long postId
    );
}
