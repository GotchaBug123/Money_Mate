package com.gotchabug.moneymate.dto.goal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GoalStrategyInsight {

    private String insightType;

    private String title;

    private String value;

    private String description;

    private String actionCode;

    private String importance;

    private String status;

    public boolean isHighImportance() {
        return "HIGH".equals(importance);
    }

    public boolean needsUserAction() {
        return actionCode != null
                && !"MAINTAIN_CURRENT_STRATEGY".equals(actionCode);
    }

    public boolean isWarning() {
        return "WARNING".equals(status)
                || "DANGER".equals(status);
    }
}