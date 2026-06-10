package com.gotchabug.moneymate.community;

import com.gotchabug.moneymate.community.entity.CommunityTheme;
import com.gotchabug.moneymate.community.repository.CommunityThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CommunityThemeSeedRunner implements ApplicationRunner {

    private final CommunityThemeRepository communityThemeRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (communityThemeRepository.count() > 0) {
            return;
        }

        communityThemeRepository.saveAll(List.of(
                createTheme("자유", "자유롭게 투자 이야기를 나누는 공간", 1),
                createTheme("질문", "투자와 서비스 이용 질문을 남기는 공간", 2),
                createTheme("정보공유", "시장 정보와 투자 아이디어를 공유하는 공간", 3),
                createTheme("주식", "국내외 주식 종목 이야기를 나누는 공간", 4),
                createTheme("ETF", "ETF와 분산투자 정보를 공유하는 공간", 5)
        ));
    }

    private CommunityTheme createTheme(
            String themeName,
            String description,
            int displayOrder
    ) {
        return CommunityTheme.builder()
                .themeName(themeName)
                .description(description)
                .displayOrder(displayOrder)
                .activeYn("Y")
                .build();
    }
}
