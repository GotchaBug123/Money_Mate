package com.gotchabug.moneymate.enums;

public enum RebalanceCycle {

    NONE("리밸런싱 없음", 0),
    MONTHLY("매월", 1),
    QUARTERLY("분기별", 3),
    HALF_YEARLY("반기별", 6),
    YEARLY("매년", 12);

    private final String label;
    private final int intervalMonths;

    RebalanceCycle(String label, int intervalMonths) {
        this.label = label;
        this.intervalMonths = intervalMonths;
    }

    public String getLabel() {
        return label;
    }

    public int getIntervalMonths() {
        return intervalMonths;
    }

    public boolean isEnabled() {
        return this != NONE;
    }

    public boolean shouldRebalance(int elapsedMonth) {
        return isEnabled()
                && elapsedMonth > 0
                && elapsedMonth % intervalMonths == 0;
    }
}
