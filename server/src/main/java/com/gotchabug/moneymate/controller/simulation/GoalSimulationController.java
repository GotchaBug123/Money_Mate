package com.gotchabug.moneymate.controller.simulation;

import com.gotchabug.moneymate.dto.goal.GoalSimulationHistoryResponse;
import com.gotchabug.moneymate.dto.goal.GoalStrategyRequest;
import com.gotchabug.moneymate.dto.goal.GoalStrategyResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.GoalStrategyResultRepository;
import com.gotchabug.moneymate.service.GoalStrategyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/simulation")
@Tag(name = "Goal Simulation", description = "목표 달성 시뮬레이션 API")
public class GoalSimulationController {

    private final GoalStrategyService goalStrategyService;
    private final GoalStrategyResultRepository goalStrategyResultRepository;

    @PostMapping("/goal")
    @Operation(summary = "목표 시뮬레이션 실행", description = "선택 자산과 투자 조건으로 목표 달성 확률을 분석합니다.")
    public GoalStrategyResponse simulateGoal(
            @Valid @RequestBody GoalStrategyRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return goalStrategyService.simulate(loginUser.getMemberId(), request);
    }

    @PostMapping("/what-if")
    @Operation(summary = "What-if 시뮬레이션 실행", description = "현재 요청 조건을 기반으로 목표 달성 가능성을 다시 분석합니다.")
    public GoalStrategyResponse simulateWhatIf(
            @Valid @RequestBody GoalStrategyRequest request,
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return goalStrategyService.simulate(loginUser.getMemberId(), request);
    }

    @GetMapping("/history")
    @Operation(summary = "시뮬레이션 이력 조회", description = "로그인 사용자의 목표 시뮬레이션 저장 이력을 최신순으로 조회합니다.")
    public List<GoalSimulationHistoryResponse> getHistory(
            @Parameter(hidden = true) HttpSession session
    ) {
        Member loginUser = requireLogin(session);

        return goalStrategyResultRepository
                .findByMember_MemberIdOrderByCreatedAtDesc(loginUser.getMemberId())
                .stream()
                .map(GoalSimulationHistoryResponse::from)
                .toList();
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
