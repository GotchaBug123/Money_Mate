package com.gotchabug.moneymate.enums;

public enum RebalanceCycle {

    NONE("None", 0),
    MONTHLY("Monthly", 1),
    QUARTERLY("Quarterly", 3),
    HALF_YEARLY("Half-yearly", 6),
    YEARLY("Yearly", 12);

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