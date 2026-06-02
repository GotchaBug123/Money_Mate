package com.gotchabug.moneymate.controller.goal;

import com.gotchabug.moneymate.dto.goal.GoalCreateRequest;
import com.gotchabug.moneymate.dto.goal.GoalResponse;
import com.gotchabug.moneymate.dto.goal.GoalUpdateRequest;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.InvestmentGoalService;
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
@RequestMapping("/api/goals")
@Tag(name = "Goal", description = "사용자 투자 목표 관리 API")
public class InvestmentGoalController {

    private final InvestmentGoalService investmentGoalService;

    @GetMapping
    @Operation(summary = "투자 목표 목록 조회", description = "로그인 사용자의 활성 투자 목표 목록을 조회합니다.")
    public List<GoalResponse> getGoals(
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return investmentGoalService.getGoals(loginUser.getMemberId());
    }

    @GetMapping("/{goalId}")
    @Operation(summary = "투자 목표 상세 조회", description = "로그인 사용자의 투자 목표 상세 정보를 조회합니다.")
    public GoalResponse getGoal(
            @Parameter(description = "목표 ID", example = "1")
            @PathVariable Long goalId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return investmentGoalService.getGoal(loginUser.getMemberId(), goalId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "투자 목표 등록", description = "로그인 사용자의 새 투자 목표를 등록합니다.")
    public GoalResponse createGoal(
            @Valid @RequestBody GoalCreateRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return investmentGoalService.createGoal(loginUser.getMemberId(), request);
    }

    @PutMapping("/{goalId}")
    @Operation(summary = "투자 목표 수정", description = "로그인 사용자의 투자 목표를 수정합니다.")
    public GoalResponse updateGoal(
            @Parameter(description = "목표 ID", example = "1")
            @PathVariable Long goalId,
            @Valid @RequestBody GoalUpdateRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return investmentGoalService.updateGoal(
                loginUser.getMemberId(),
                goalId,
                request
        );
    }

    @DeleteMapping("/{goalId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "투자 목표 삭제", description = "투자 목표를 DELETED 상태로 변경합니다.")
    public void deleteGoal(
            @Parameter(description = "목표 ID", example = "1")
            @PathVariable Long goalId,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        investmentGoalService.deleteGoal(loginUser.getMemberId(), goalId);
    }

    private Member requireLogin(HttpSession session) {
        Object loginUser = session.getAttribute("loginUser");

        if (!(loginUser instanceof Member member)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Login is required."
            );
        }

        return member;
    }
}
