package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.CommunityTheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityThemeRepository
        extends JpaRepository<CommunityTheme, Long> {

    List<CommunityTheme> findByActiveYnOrderByDisplayOrderAscThemeNameAsc(
            String activeYn
    );
}
