package com.gotchabug.moneymate.controller.portfolio;

import com.gotchabug.moneymate.dto.HoldingDto;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.HoldingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 투자 보유 종목(장바구니) REST 컨트롤러
 * 테이블: investment_holding
 *
 * GET    /api/holding          → 내 보유 종목 목록
 * POST   /api/holding          → 종목 담기 (장바구니 추가)
 * DELETE /api/holding/{id}     → 종목 삭제
 * GET    /api/holding/check    → 담김 여부 확인 (ticker 기준)
 */
@RestController
@RequestMapping("/api/holding")
@RequiredArgsConstructor
@Tag(name = "Holding", description = "사용자 보유 종목 관리 API")
public class HoldingController {

    private final HoldingService holdingService;

    /** 내 보유 종목 목록 조회 */
    @GetMapping
    @Operation(summary = "내 보유 종목 목록 조회", description = "로그인 사용자의 보유 종목 목록을 조회합니다.")
    public List<HoldingDto> getHoldingList(
            @Parameter(hidden = true) HttpSession session
    ) {
        return holdingService.getHoldingList(getLoginUser(session).getMemberId());
    }

    /**
     * 장바구니 담기
     *
     * 요청 Body 예시:
     * {
     *   "ticker":    "005930",
     *   "assetName": "삼성전자",
     *   "market":    "KOSPI",
     *   "buyPrice":  75000
     * }
     */
    @PostMapping
    @Operation(summary = "보유 종목 추가", description = "투자정보 화면에서 선택한 종목을 내 보유 종목 목록에 추가합니다.")
    public HoldingDto addHolding(@RequestBody Map<String, Object> body,
                                 @Parameter(hidden = true) HttpSession session) {
        String ticker    = requireString(body, "ticker");
        String assetName = requireString(body, "assetName");
        String market    = (String) body.get("market");  // nullable

        BigDecimal buyPrice = BigDecimal.ZERO;
        Object rawPrice = body.get("buyPrice");
        if (rawPrice != null) {
            try {
                buyPrice = new BigDecimal(rawPrice.toString());
            } catch (NumberFormatException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "buyPrice 형식이 올바르지 않습니다.");
            }
        }

        Long memberId = getLoginUser(session).getMemberId();
        return holdingService.addHolding(memberId, ticker, assetName, market, buyPrice);
    }

    /** 보유 종목 삭제 */
    @DeleteMapping("/{holdingId}")
    @Operation(summary = "보유 종목 삭제", description = "보유 종목 ID에 해당하는 항목을 삭제합니다.")
    public Map<String, String> removeHolding(
            @Parameter(description = "보유 종목 ID", example = "1")
            @PathVariable Long holdingId,
            @Parameter(hidden = true) HttpSession session
    ) {
        holdingService.removeHolding(getLoginUser(session).getMemberId(), holdingId);
        return Map.of("message", "투자 종목에서 삭제되었습니다.");
    }

    /**
     * 담김 여부 확인 (버튼 상태 초기화용)
     * GET /api/holding/check?ticker=005930
     */
    @GetMapping("/check")
    @Operation(summary = "보유 종목 여부 확인", description = "티커 기준으로 이미 보유 종목에 등록되어 있는지 확인합니다.")
    public Map<String, Boolean> checkHolding(
            @Parameter(description = "종목 티커", example = "005930")
            @RequestParam String ticker,
            @Parameter(hidden = true) HttpSession session
    ) {
        boolean holding = holdingService.isHolding(getLoginUser(session).getMemberId(), ticker);
        return Map.of("inHolding", holding);
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
