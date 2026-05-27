package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.CommunityComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityCommentRepository
        extends JpaRepository<CommunityComment, Long> {

    @EntityGraph(attributePaths = {"member"})
    List<CommunityComment> findByPost_PostIdOrderByCreatedAtAsc(Long postId);

    @EntityGraph(attributePaths = {"member", "post"})
    Optional<CommunityComment> findByCommentId(Long commentId);
}
