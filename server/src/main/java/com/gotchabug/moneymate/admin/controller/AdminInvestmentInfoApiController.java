package com.gotchabug.moneymate.admin.controller;

import com.gotchabug.moneymate.admin.dto.AdminAgeGroupStatResponse;
import com.gotchabug.moneymate.admin.dto.AdminInvestmentSummaryResponse;
import com.gotchabug.moneymate.admin.dto.AdminMemberInvestmentResponse;
import com.gotchabug.moneymate.admin.service.AdminInvestmentInfoService;
import com.gotchabug.moneymate.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/investment-info")
@RequiredArgsConstructor
@Tag(
        name = "관리자 투자정보관리 API",
        description = "관리자 페이지 > 투자정보관리 탭 데이터 API"
)
public class AdminInvestmentInfoApiController {

    private final AdminInvestmentInfoService adminInvestmentInfoService;

    @Operation(
            summary = "투자정보 요약 통계 조회",
            description = "투자정보관리 상단에 표시되는 관리 회원 수, 보유 종목 수, 총 평가금액을 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 필요"),
            @ApiResponse(responseCode = "403", description = "관리자 권한 없음")
    })
    @GetMapping("/summary")
    public ResponseEntity<AdminInvestmentSummaryResponse> getSummary(
            HttpSession session
    ) {
        checkAdmin(session);

        return ResponseEntity.ok(
                adminInvestmentInfoService.getSummary()
        );
    }

    @Operation(
            summary = "회원별 투자 현황 목록 조회",
            description = "보유 종목이 있는 회원의 투자 현황을 반환합니다. " +
                    "keyword로 이름/아이디 검색, riskTypeCode로 투자 성향 필터링이 가능합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 필요"),
            @ApiResponse(responseCode = "403", description = "관리자 권한 없음")
    })
    @GetMapping("/members")
    public ResponseEntity<List<AdminMemberInvestmentResponse>> getMemberList(

            @Parameter(description = "검색어 (회원 이름 또는 로그인 ID 부분 일치)")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "투자 성향 코드 필터")
            @RequestParam(required = false) String riskTypeCode,

            HttpSession session
    ) {
        checkAdmin(session);

        return ResponseEntity.ok(
                adminInvestmentInfoService.getMemberInvestmentList(
                        keyword,
                        riskTypeCode
                )
        );
    }

    @Operation(
            summary = "연령대별 투자 성향 통계 조회",
            description = "20대~60대 연령대별로 가장 많은 투자 유형과 비율, 평균 성향 점수를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 필요"),
            @ApiResponse(responseCode = "403", description = "관리자 권한 없음")
    })
    @GetMapping("/stats/age-group")
    public ResponseEntity<List<AdminAgeGroupStatResponse>> getAgeGroupStats(
            HttpSession session
    ) {
        checkAdmin(session);

        return ResponseEntity.ok(
                adminInvestmentInfoService.getAgeGroupStats()
        );
    }

    private void checkAdmin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "관리자 권한이 필요합니다."
            );
        }
    }
}