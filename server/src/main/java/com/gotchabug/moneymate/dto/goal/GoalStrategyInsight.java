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
        return "높음".equals(importance);
    }

    public boolean needsUserAction() {
        return actionCode != null
                && !"현재전략유지".equals(actionCode);
    }

    public boolean isWarning() {
        return "주의".equals(status)
                || "위험".equals(status);
    }
}