package com.gotchabug.moneymate.portfolio.controller;

import com.gotchabug.moneymate.auth.dto.HoldingDto;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.investment.service.WatchlistService;
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

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@Tag(
        name = "Watchlist",
        description = "관심 종목 조회, 토글, 삭제, 관심 여부 확인 API"
)
public class WatchlistController {

    private final WatchlistService watchlistService;

    @Operation(
            summary = "내 관심 종목 목록 조회",
            description = "로그인한 사용자의 관심 종목 목록을 조회합니다."
    )
    @GetMapping
    public List<HoldingDto.WatchlistDto> getWatchlist(

            @Parameter(hidden = true)
            HttpSession session
    ) {

        return watchlistService.getWatchlist(
                getLoginUser(session).getMemberId()
        );
    }

    @Operation(
            summary = "관심 종목 토글",
            description = """
                    관심 종목을 추가하거나 해제합니다.

                    요청 Body 예시
                    {
                      "ticker": "005930",
                      "assetName": "삼성전자",
                      "market": "KOSPI"
                    }

                    동작
                    - 관심 종목에 없으면 추가
                    - 이미 관심 종목이면 해제

                    응답 예시
                    {
                      "watched": true,
                      "message": "관심등록 되었습니다."
                    }
                    """
    )
    @PostMapping("/toggle")
    public Map<String, Object> toggleWatchlist(

            @Parameter(description = "관심 종목 토글 요청 데이터", required = true)
            @RequestBody
            Map<String, Object> body,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        String ticker =
                requireString(
                        body,
                        "ticker"
                );

        String assetName =
                requireString(
                        body,
                        "assetName"
                );

        String market =
                body.get("market") != null
                        ? body.get("market").toString()
                        : null;

        Long memberId =
                getLoginUser(session).getMemberId();

        boolean added =
                watchlistService.toggleWatchlist(
                        memberId,
                        ticker,
                        assetName,
                        market
                );

        return Map.of(
                "watched",
                added,
                "message",
                added ? "관심등록 되었습니다." : "관심 해제되었습니다."
        );
    }

    @Operation(
            summary = "관심 종목 삭제",
            description = "로그인한 사용자의 관심 종목에서 특정 종목을 삭제합니다."
    )
    @DeleteMapping("/{watchlistId}")
    public Map<String, String> removeWatchlist(

            @Parameter(description = "삭제할 관심 종목 ID", required = true)
            @PathVariable
            Long watchlistId,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        watchlistService.removeWatchlist(
                getLoginUser(session).getMemberId(),
                watchlistId
        );

        return Map.of(
                "message",
                "관심 종목에서 삭제되었습니다."
        );
    }

    @Operation(
            summary = "관심 여부 확인",
            description = """
                    특정 티커가 로그인 사용자의 관심 종목에 등록되어 있는지 확인합니다.

                    화면에서 관심 버튼의 초기 상태를 설정할 때 사용됩니다.
                    """
    )
    @GetMapping("/check")
    public Map<String, Boolean> checkWatchlist(

            @Parameter(
                    description = "확인할 종목 티커",
                    required = true,
                    example = "005930"
            )
            @RequestParam
            String ticker,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        boolean watched =
                watchlistService.isWatched(
                        getLoginUser(session).getMemberId(),
                        ticker
                );

        return Map.of(
                "watched",
                watched
        );
    }

    private String requireString(
            Map<String, Object> body,
            String key
    ) {

        Object val =
                body.get(key);

        if (val == null || val.toString().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    key + " 은(는) 필수입니다."
            );
        }

        return val.toString();
    }

    private Member getLoginUser(HttpSession session) {

        Object loginUser =
                session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        return member;
    }
}