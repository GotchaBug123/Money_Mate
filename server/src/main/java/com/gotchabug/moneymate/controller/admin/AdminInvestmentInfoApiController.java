package com.gotchabug.moneymate.controller.admin;

import com.gotchabug.moneymate.dto.admin.investment.InvestmentInfoCreateRequest;
import com.gotchabug.moneymate.dto.admin.investment.InvestmentInfoResponse;
import com.gotchabug.moneymate.dto.admin.investment.InvestmentInfoUpdateRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.AdminInvestmentInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/investment-info")
@Tag(name = "Admin Investment Info", description = "관리자 투자정보 관리 API")
public class AdminInvestmentInfoApiController {

    private final AdminInvestmentInfoService adminInvestmentInfoService;

    @GetMapping
    @Operation(summary = "투자정보 목록 조회", description = "관리자 권한으로 활성 상태의 투자정보 목록을 조회합니다.")
    public List<InvestmentInfoResponse> getInvestmentInfos(
            @Parameter(hidden = true) HttpSession session
    ) {
        validateAdmin(session);

        return adminInvestmentInfoService.getInvestmentInfos();
    }

    @GetMapping("/{infoId}")
    @Operation(summary = "투자정보 상세 조회", description = "투자정보 ID에 해당하는 상세 내용을 조회합니다.")
    public InvestmentInfoResponse getInvestmentInfo(
            @Parameter(description = "투자정보 ID", example = "1")
            @PathVariable Long infoId,
            @Parameter(hidden = true) HttpSession session
    ) {
        validateAdmin(session);

        return adminInvestmentInfoService.getInvestmentInfo(infoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "투자정보 등록", description = "관리자가 새 투자정보를 등록합니다.")
    public InvestmentInfoResponse createInvestmentInfo(
            @Valid @RequestBody InvestmentInfoCreateRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        validateAdmin(session);

        return adminInvestmentInfoService.createInvestmentInfo(request);
    }

    @PutMapping("/{infoId}")
    @Operation(summary = "투자정보 수정", description = "투자정보 ID에 해당하는 투자정보 내용을 수정합니다.")
    public InvestmentInfoResponse updateInvestmentInfo(
            @Parameter(description = "투자정보 ID", example = "1")
            @PathVariable Long infoId,
            @Valid @RequestBody InvestmentInfoUpdateRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        validateAdmin(session);

        return adminInvestmentInfoService.updateInvestmentInfo(infoId, request);
    }

    @DeleteMapping("/{infoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "투자정보 삭제", description = "투자정보를 비활성 상태로 변경합니다. 실제 레코드는 삭제하지 않습니다.")
    public void deleteInvestmentInfo(
            @Parameter(description = "투자정보 ID", example = "1")
            @PathVariable Long infoId,
            @Parameter(hidden = true) HttpSession session
    ) {
        validateAdmin(session);

        adminInvestmentInfoService.deleteInvestmentInfo(infoId);
    }

    private void validateAdmin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Login is required."
            );
        }

        if (!"ADMIN".equalsIgnoreCase(member.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin permission is required."
            );
        }
    }
}
