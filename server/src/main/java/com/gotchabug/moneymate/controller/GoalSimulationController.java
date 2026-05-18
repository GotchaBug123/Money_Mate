package com.gotchabug.moneymate.controller;

import com.gotchabug.moneymate.dto.simulation.GoalSimulationRequest;
import com.gotchabug.moneymate.dto.simulation.GoalSimulationResponse;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.service.GoalSimulationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/simulation")
public class GoalSimulationController {

    private final GoalSimulationService goalSimulationService;

    // 목표 달성 시뮬레이션 실행 API
    @PostMapping("/goal")
    public GoalSimulationResponse simulateGoal(
            @Valid @RequestBody GoalSimulationRequest request,
            HttpSession session
    ) {

        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return goalSimulationService.simulate(
                loginUser.getMemberId(),
                request
        );
    }
}