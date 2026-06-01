package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.HoldingDto;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.HoldingService;
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
public class HoldingController {

    private final HoldingService holdingService;

    /** 내 보유 종목 목록 조회 */
    @GetMapping
    public List<HoldingDto> getHoldingList(HttpSession session) {
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
    public HoldingDto addHolding(@RequestBody Map<String, Object> body,
                                 HttpSession session) {
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
    public Map<String, String> removeHolding(@PathVariable Long holdingId,
                                             HttpSession session) {
        holdingService.removeHolding(getLoginUser(session).getMemberId(), holdingId);
        return Map.of("message", "투자 종목에서 삭제되었습니다.");
    }

    /**
     * 담김 여부 확인 (버튼 상태 초기화용)
     * GET /api/holding/check?ticker=005930
     */
    @GetMapping("/check")
    public Map<String, Boolean> checkHolding(@RequestParam String ticker,
                                             HttpSession session) {
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