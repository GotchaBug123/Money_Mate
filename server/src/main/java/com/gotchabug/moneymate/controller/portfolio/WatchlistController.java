package com.gotchabug.moneymate.controller.portfolio;

import com.gotchabug.moneymate.dto.WatchlistDto;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.WatchlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * 관심 종목 REST 컨트롤러
 * 테이블: watchlist
 *
 * GET    /api/watchlist               → 내 관심 종목 목록
 * POST   /api/watchlist/toggle        → 관심 토글 (★ 추가 / ☆ 해제)
 * DELETE /api/watchlist/{watchlistId} → 삭제
 * GET    /api/watchlist/check         → 관심 여부 확인 (ticker 기준)
 */
@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@Tag(name = "Watchlist", description = "사용자 관심 종목 관리 API")
public class WatchlistController {

    private final WatchlistService watchlistService;

    /** 내 관심 종목 목록 조회 */
    @GetMapping
    @Operation(summary = "내 관심 종목 목록 조회", description = "로그인 사용자의 관심 종목 목록을 조회합니다.")
    public List<WatchlistDto> getWatchlist(
            @Parameter(hidden = true) HttpSession session
    ) {
        return watchlistService.getWatchlist(getLoginUser(session).getMemberId());
    }

    /**
     * 관심 종목 토글 (☆ → ★ 추가 / ★ → ☆ 해제)
     *
     * 요청 Body 예시:
     * {
     *   "ticker":    "005930",
     *   "assetName": "삼성전자",
     *   "market":    "KOSPI"
     * }
     *
     * 응답 예시:
     * { "watched": true, "message": "관심등록 되었습니다." }
     */
    @PostMapping("/toggle")
    @Operation(summary = "관심 종목 토글", description = "선택한 종목을 관심 종목에 추가하거나 이미 등록된 경우 해제합니다.")
    public Map<String, Object> toggleWatchlist(@RequestBody Map<String, Object> body,
                                               @Parameter(hidden = true) HttpSession session) {
        String ticker    = requireString(body, "ticker");
        String assetName = requireString(body, "assetName");
        String market    = body.get("market") != null ? body.get("market").toString() : null;

        Long memberId = getLoginUser(session).getMemberId();
        boolean added = watchlistService.toggleWatchlist(memberId, ticker, assetName, market);

        return Map.of(
                "watched", added,
                "message", added ? "관심등록 되었습니다." : "관심 해제되었습니다."
        );
    }

    /** 관심 종목 삭제 */
    @DeleteMapping("/{watchlistId}")
    @Operation(summary = "관심 종목 삭제", description = "관심 종목 ID에 해당하는 항목을 삭제합니다.")
    public Map<String, String> removeWatchlist(
            @Parameter(description = "관심 종목 ID", example = "1")
            @PathVariable Long watchlistId,
            @Parameter(hidden = true) HttpSession session
    ) {
        watchlistService.removeWatchlist(getLoginUser(session).getMemberId(), watchlistId);
        return Map.of("message", "관심 종목에서 삭제되었습니다.");
    }

    /**
     * 관심 여부 확인 (버튼 초기 상태용)
     * GET /api/watchlist/check?ticker=005930
     */
    @GetMapping("/check")
    @Operation(summary = "관심 종목 여부 확인", description = "티커 기준으로 이미 관심 종목에 등록되어 있는지 확인합니다.")
    public Map<String, Boolean> checkWatchlist(
            @Parameter(description = "종목 티커", example = "005930")
            @RequestParam String ticker,
            @Parameter(hidden = true) HttpSession session
    ) {
        boolean watched = watchlistService.isWatched(getLoginUser(session).getMemberId(), ticker);
        return Map.of("watched", watched);
    }

    private String requireString(Map<String, Object> body, String key) {
        Object val = body.get(key);
        if (val == null || val.toString().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, key + " 은(는) 필수입니다.");
        }
        return val.toString();
    }

    private Member getLoginUser(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");
        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return member;
    }
}
