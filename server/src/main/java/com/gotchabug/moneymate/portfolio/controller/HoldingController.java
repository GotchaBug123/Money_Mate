package com.gotchabug.moneymate.portfolio.controller;

import com.gotchabug.moneymate.auth.dto.HoldingDto;
import com.gotchabug.moneymate.investment.dto.PortfolioHistoryDto;
import com.gotchabug.moneymate.investment.dto.PortfolioReturnDto;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.investment.service.HoldingService;
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

@RestController
@RequestMapping("/api/holding")
@RequiredArgsConstructor
@Tag(
        name = "Holding",
        description = "투자 보유 종목 조회, 추가, 삭제, 담김 여부 확인 API"
)
public class HoldingController {

    private final HoldingService holdingService;

    @Operation(
            summary = "내 보유 종목 목록 조회",
            description = "로그인한 사용자의 투자 보유 종목 목록을 조회합니다."
    )
    @GetMapping
    public List<HoldingDto> getHoldingList(

            @Parameter(hidden = true)
            HttpSession session
    ) {

        return holdingService.getHoldingList(
                getLoginUser(session).getMemberId()
        );
    }

    @Operation(
            summary = "투자 종목 담기",
            description = """
                    로그인한 사용자의 투자 보유 종목에 종목을 추가합니다.

                    요청 Body 예시
                    {
                      "ticker": "005930",
                      "assetName": "삼성전자",
                      "market": "KOSPI",
                      "buyPrice": 75000
                    }

                    필수값
                    - ticker
                    - assetName

                    선택값
                    - market
                    - buyPrice
                    """
    )
    @PostMapping
    public HoldingDto addHolding(

            @Parameter(description = "투자 종목 추가 요청 데이터", required = true)
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
                (String) body.get("market");

        BigDecimal buyPrice =
                BigDecimal.ZERO;

        Object rawPrice =
                body.get("buyPrice");

        if (rawPrice != null) {

            try {

                buyPrice =
                        new BigDecimal(
                                rawPrice.toString()
                        );

            } catch (NumberFormatException e) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "buyPrice 형식이 올바르지 않습니다."
                );
            }
        }

        Long memberId =
                getLoginUser(session).getMemberId();

        return holdingService.addHolding(
                memberId,
                ticker,
                assetName,
                market,
                buyPrice
        );
    }

    @Operation(
            summary = "보유 종목 수량 수정",
            description = "로그인한 사용자의 특정 보유 종목 수량을 직접 수정합니다."
    )
    @PatchMapping("/{holdingId}/quantity")
    public HoldingDto updateQuantity(

            @Parameter(description = "수량을 수정할 보유 종목 ID", required = true)
            @PathVariable
            Long holdingId,

            @Parameter(description = "변경할 수량 { \"quantity\": 3 }", required = true)
            @RequestBody
            Map<String, Object> body,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        Object rawQty = body.get("quantity");

        if (rawQty == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "quantity 는 필수입니다."
            );
        }

        int quantity;
        try {
            quantity = Integer.parseInt(rawQty.toString());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "quantity 형식이 올바르지 않습니다."
            );
        }

        if (quantity < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "quantity 는 1 이상이어야 합니다."
            );
        }

        Long memberId = getLoginUser(session).getMemberId();

        return holdingService.updateQuantity(memberId, holdingId, quantity);
    }

    @Operation(
            summary = "보유 종목 삭제",
            description = "로그인한 사용자의 투자 보유 종목에서 특정 종목을 삭제합니다."
    )
    @DeleteMapping("/{holdingId}")
    public Map<String, String> removeHolding(

            @Parameter(description = "삭제할 보유 종목 ID", required = true)
            @PathVariable
            Long holdingId,

            @Parameter(hidden = true)
            HttpSession session
    ) {

        holdingService.removeHolding(
                getLoginUser(session).getMemberId(),
                holdingId
        );

        return Map.of(
                "message",
                "투자 종목에서 삭제되었습니다."
        );
    }

    @Operation(
            summary = "포트폴리오 수익률 조회",
            description = "보유 종목 기준으로 종합 수익률과 월 수익률을 계산하여 반환합니다."
    )
    @GetMapping("/return")
    public PortfolioReturnDto getPortfolioReturn(
            @Parameter(hidden = true) HttpSession session
    ) {
        return holdingService.getPortfolioReturn(getLoginUser(session).getMemberId());
    }

    @Operation(
            summary = "월별 포트폴리오 히스토리 조회",
            description = "최근 6개월 포트폴리오 평가액과 월 수익률을 반환합니다."
    )
    @GetMapping("/monthly-history")
    public PortfolioHistoryDto getMonthlyHistory(
            @Parameter(hidden = true) HttpSession session
    ) {
        return holdingService.getPortfolioHistory(getLoginUser(session).getMemberId());
    }

    @Operation(
            summary = "보유 종목 담김 여부 확인",
            description = """
                    특정 티커가 로그인 사용자의 투자 보유 종목에 이미 담겨 있는지 확인합니다.

                    버튼 상태 초기화용으로 사용됩니다.
                    """
    )
    @GetMapping("/check")
    public Map<String, Boolean> checkHolding(

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

        boolean holding =
                holdingService.isHolding(
                        getLoginUser(session).getMemberId(),
                        ticker
                );

        return Map.of(
                "inHolding",
                holding
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