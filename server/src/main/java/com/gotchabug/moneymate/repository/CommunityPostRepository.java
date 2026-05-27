package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommunityPostRepository
        extends JpaRepository<CommunityPost, Long> {

    @EntityGraph(attributePaths = {"member", "theme"})
    @Query(
            value = """
        SELECT p
        FROM CommunityPost p
        WHERE (:keyword IS NULL
                OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR p.content LIKE CONCAT('%', :keyword, '%')
                OR LOWER(p.stockSymbol) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.stockName) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:themeId IS NULL OR p.theme.themeId = :themeId)
          AND (:category IS NULL OR p.category = :category)
        ORDER BY p.createdAt DESC
        """,
            countQuery = """
        SELECT COUNT(p)
        FROM CommunityPost p
        WHERE (:keyword IS NULL
                OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR p.content LIKE CONCAT('%', :keyword, '%')
                OR LOWER(p.stockSymbol) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.stockName) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:themeId IS NULL OR p.theme.themeId = :themeId)
          AND (:category IS NULL OR p.category = :category)
        """
    )
    Page<CommunityPost> searchPosts(
            @Param("keyword") String keyword,
            @Param("themeId") Long themeId,
            @Param("category") String category,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"member", "theme", "attachments"})
    @Query("""
            SELECT DISTINCT p
            FROM CommunityPost p
            WHERE p.postId = :postId
            """)
    Optional<CommunityPost> findDetailByPostId(
            @Param("postId") Long postId
    );

    @EntityGraph(attributePaths = {"member", "theme"})
    @Query("""
            SELECT p
            FROM CommunityPost p
            ORDER BY p.viewCount DESC, p.createdAt DESC
            """)
    List<CommunityPost> findPopularPosts(Pageable pageable);

    @EntityGraph(attributePaths = {"member", "theme"})
    Page<CommunityPost> findByMember_MemberIdOrderByCreatedAtDesc(
            Long memberId,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"member", "theme"})
    Page<CommunityPost> findByStockSymbolOrderByCreatedAtDesc(
            String stockSymbol,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"member", "theme"})
    List<CommunityPost> findByCategoryOrderByCreatedAtDesc(
            String category,
            Pageable pageable
    );

    @Query("""
            SELECT DISTINCT p.category
            FROM CommunityPost p
            ORDER BY p.category
            """)
    List<String> findDistinctCategories();

    @Query("""
            SELECT p.theme.themeId
            FROM CommunityPost p
            WHERE p.theme IS NOT NULL
            GROUP BY p.theme.themeId
            ORDER BY COUNT(p.postId) DESC
            """)
    List<Long> findPopularThemeIds(Pageable pageable);
}
