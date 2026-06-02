package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.goal.GoalCreateRequest;
import com.gotchabug.moneymate.dto.goal.GoalResponse;
import com.gotchabug.moneymate.dto.goal.GoalUpdateRequest;
import com.gotchabug.moneymate.entity.InvestmentGoal;
import com.gotchabug.moneymate.entity.Member;
import com.gotchabug.moneymate.repository.InvestmentGoalRepository;
import com.gotchabug.moneymate.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvestmentGoalService {

    private static final String ACTIVE = "ACTIVE";

    private final InvestmentGoalRepository investmentGoalRepository;
    private final MemberRepository memberRepository;

    public List<GoalResponse> getGoals(Long memberId) {
        return investmentGoalRepository
                .findByMember_MemberIdAndGoalStatusOrderByCreatedAtDesc(
                        memberId,
                        ACTIVE
                )
                .stream()
                .map(GoalResponse::from)
                .toList();
    }

    public GoalResponse getGoal(Long memberId, Long goalId) {
        return GoalResponse.from(findActiveGoal(memberId, goalId));
    }

    @Transactional
    public GoalResponse createGoal(Long memberId, GoalCreateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Member not found."
                ));

        InvestmentGoal goal = InvestmentGoal.builder()
                .member(member)
                .goalName(request.getGoalName().trim())
                .targetAmount(request.getTargetAmount())
                .targetDate(request.getTargetDate())
                .monthlyContribution(request.getMonthlyContribution())
                .currentAmount(request.getCurrentAmount())
                .goalStatus(ACTIVE)
                .build();

        return GoalResponse.from(investmentGoalRepository.save(goal));
    }

    @Transactional
    public GoalResponse updateGoal(
            Long memberId,
            Long goalId,
            GoalUpdateRequest request
    ) {
        InvestmentGoal goal = findActiveGoal(memberId, goalId);

        goal.update(
                request.getGoalName().trim(),
                request.getTargetAmount(),
                request.getTargetDate(),
                request.getMonthlyContribution(),
                request.getCurrentAmount()
        );

        return GoalResponse.from(goal);
    }

    @Transactional
    public void deleteGoal(Long memberId, Long goalId) {
        InvestmentGoal goal = findActiveGoal(memberId, goalId);
        goal.delete();
    }

    private InvestmentGoal findActiveGoal(Long memberId, Long goalId) {
        return investmentGoalRepository
                .findByGoalIdAndMember_MemberIdAndGoalStatus(
                        goalId,
                        memberId,
                        ACTIVE
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found."
                ));
    }
}
