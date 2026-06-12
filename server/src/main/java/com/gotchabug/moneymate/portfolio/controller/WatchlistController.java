package com.gotchabug.moneymate.portfolio.controller;

import com.gotchabug.moneymate.auth.dto.HoldingDto;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.investment.service.WatchlistService;
import com.gotchabug.moneymate.portfolio.dto.WatchlistRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist") // 지침 4: 모든 API 경로는 /api로 시작
@RequiredArgsConstructor
@Tag(name = "Watchlist", description = "관심 종목 조회, 추가, 삭제, 관심 여부 확인 API")
public class WatchlistController {

    private final WatchlistService watchlistService;

    @Operation(summary = "내 관심 종목 목록 조회")
    @GetMapping
    public List<HoldingDto.WatchlistDto> getWatchlist(@Parameter(hidden = true) HttpSession session) {
        return watchlistService.getWatchlist(getLoginUser(session).getMemberId());
    }

    @Operation(
            summary = "관심 종목 추가 및 토글",
            description = "프론트엔드(리액트)에서 전송한 WatchlistRequest 데이터를 검증하여 관심 종목을 등록하거나 해제(토글)합니다."
    )
    @PostMapping // 지침 1, 2: Thymeleaf 없는 순수 리액트용 REST API 및 Swagger 연동
    public Map<String, Object> toggleWatchlist(
            @Valid @RequestBody WatchlistRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Long memberId = getLoginUser(session).getMemberId();

        // 💡 [에러 해결 및 지침 3 준수] 서비스의 실제 메서드인 toggleWatchlist를 호출하고 DTO의 필드 형식을 매핑합니다.
        boolean isRegistered = watchlistService.toggleWatchlist(
                memberId,
                request.getTicker(),
                request.getAssetName(),
                request.getMarket()
        );

        // 리액트 프론트엔드에서 등록 상태를 쉽게 판단할 수 있도록 명확한 메시지와 상태값을 JSON으로 반환합니다.
        return Map.of(
                "isRegistered", isRegistered,
                "message", isRegistered ? "관심 종목에 등록되었습니다." : "관심 종목이 해제되었습니다."
        );
    }

    @Operation(summary = "관심 종목 삭제")
    @DeleteMapping("/{watchlistId}")
    public Map<String, String> removeWatchlist(
            @PathVariable Long watchlistId,
            @Parameter(hidden = true) HttpSession session
    ) {
        watchlistService.removeWatchlist(getLoginUser(session).getMemberId(), watchlistId);
        return Map.of("message", "관심 종목에서 삭제되었습니다.");
    }

    @Operation(summary = "관심 종목 담김 여부 확인")
    @GetMapping("/check")
    public Map<String, Boolean> checkWatchlist(@RequestParam String ticker, @Parameter(hidden = true) HttpSession session) {
        boolean watched = watchlistService.isWatched(getLoginUser(session).getMemberId(), ticker);
        return Map.of("watched", watched);
    }

    private Member getLoginUser(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");
        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return member;
    }
}