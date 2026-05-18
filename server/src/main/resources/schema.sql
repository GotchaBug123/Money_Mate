USE moneymate_db;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS data_sync_history;
DROP TABLE IF EXISTS goal_simulation_result;
DROP TABLE IF EXISTS asset_fundamental;
DROP TABLE IF EXISTS external_data_source;
DROP TABLE IF EXISTS conversion_funnel_log;
DROP TABLE IF EXISTS user_event_log;
DROP TABLE IF EXISTS member_data_consent;
DROP TABLE IF EXISTS identity_verification;
DROP TABLE IF EXISTS signup_progress;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS rebalancing_detail;
DROP TABLE IF EXISTS rebalancing_history;
DROP TABLE IF EXISTS rebalancing_rule;
DROP TABLE IF EXISTS recommendation_asset;
DROP TABLE IF EXISTS recommendation;
DROP TABLE IF EXISTS portfolio_asset_current;
DROP TABLE IF EXISTS portfolio_asset_target;
DROP TABLE IF EXISTS portfolio;
DROP TABLE IF EXISTS investment_goal;
DROP TABLE IF EXISTS asset_indicator;
DROP TABLE IF EXISTS asset_price;
DROP TABLE IF EXISTS asset;
DROP TABLE IF EXISTS investment_style;
DROP TABLE IF EXISTS risk_answer;
DROP TABLE IF EXISTS risk_answer_sheet;
DROP TABLE IF EXISTS risk_question_option;
DROP TABLE IF EXISTS risk_question;
DROP TABLE IF EXISTS saving_analysis;
DROP TABLE IF EXISTS monthly_budget;
DROP TABLE IF EXISTS spending;
DROP TABLE IF EXISTS spending_category;
DROP TABLE IF EXISTS financial_profile;
DROP TABLE IF EXISTS member_auth;
DROP TABLE IF EXISTS member;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE member
(
    member_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(100) NOT NULL UNIQUE,
    name          VARCHAR(50)  NOT NULL,
    birth_date    DATE         NULL,
    signup_status VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE member_auth
(
    auth_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id        BIGINT       NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    last_login_at    DATETIME     NULL,
    login_fail_count INT          NOT NULL DEFAULT 0,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_auth_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT uq_member_auth_member UNIQUE (member_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;



CREATE TABLE financial_profile
(
    profile_id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                BIGINT         NOT NULL,
    monthly_income           DECIMAL(15, 2) NOT NULL DEFAULT 0,
    monthly_fixed_expense    DECIMAL(15, 2) NOT NULL DEFAULT 0,
    monthly_variable_expense DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_asset              DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_liability          DECIMAL(15, 2) NOT NULL DEFAULT 0,
    cash_asset               DECIMAL(15, 2) NOT NULL DEFAULT 0,
    investable_amount        DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at               DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_financial_profile_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT uq_financial_profile_member UNIQUE (member_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE spending_category
(
    category_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name   VARCHAR(50) NOT NULL UNIQUE,
    parent_category VARCHAR(50) NULL,
    essential_yn    CHAR(1)     NOT NULL DEFAULT 'N',
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_spending_category_essential_yn CHECK (essential_yn IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE spending
(
    spending_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id      BIGINT         NOT NULL,
    category_id    BIGINT         NOT NULL,
    spending_date  DATE           NOT NULL,
    amount         DECIMAL(15, 2) NOT NULL,
    merchant_name  VARCHAR(100)   NULL,
    payment_method VARCHAR(30)    NULL,
    memo           VARCHAR(255)   NULL,
    input_source   VARCHAR(20)    NOT NULL DEFAULT 'MANUAL',
    created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_spending_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_spending_category
        FOREIGN KEY (category_id) REFERENCES spending_category (category_id),
    CONSTRAINT ck_spending_input_source CHECK (input_source IN ('MANUAL', 'AUTO'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_spending_member_date ON spending (member_id, spending_date);
CREATE INDEX idx_spending_member_category_date ON spending (member_id, category_id, spending_date);

CREATE TABLE monthly_budget
(
    budget_id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id            BIGINT         NOT NULL,
    budget_year          INT            NOT NULL,
    budget_month         INT            NOT NULL,
    total_budget         DECIMAL(15, 2) NOT NULL,
    target_saving_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_monthly_budget_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT uq_monthly_budget_member UNIQUE (member_id, budget_year, budget_month),
    CONSTRAINT ck_monthly_budget_month CHECK (budget_month BETWEEN 1 AND 12)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE saving_analysis
(
    analysis_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id               BIGINT         NOT NULL,
    analysis_year           INT            NOT NULL,
    analysis_month          INT            NOT NULL,
    total_spending          DECIMAL(15, 2) NOT NULL DEFAULT 0,
    essential_spending      DECIMAL(15, 2) NOT NULL DEFAULT 0,
    non_essential_spending  DECIMAL(15, 2) NOT NULL DEFAULT 0,
    estimated_saving_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    top_over_category_id    BIGINT         NULL,
    summary_comment         VARCHAR(255)   NULL,
    created_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saving_analysis_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_saving_analysis_category
        FOREIGN KEY (top_over_category_id) REFERENCES spending_category (category_id),
    CONSTRAINT uq_saving_analysis_member UNIQUE (member_id, analysis_year, analysis_month),
    CONSTRAINT ck_saving_analysis_month CHECK (analysis_month BETWEEN 1 AND 12)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE risk_question
(
    question_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text  VARCHAR(500) NOT NULL,
    question_order INT          NOT NULL,
    active_yn      CHAR(1)      NOT NULL DEFAULT 'Y',
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_risk_question_active_yn CHECK (active_yn IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE risk_question_option
(
    option_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id  BIGINT       NOT NULL,
    option_text  VARCHAR(300) NOT NULL,
    score        INT          NOT NULL,
    option_order INT          NOT NULL,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_question_option_question
        FOREIGN KEY (question_id) REFERENCES risk_question (question_id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE risk_answer_sheet
(
    answer_sheet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT      NOT NULL,
    total_score     INT         NOT NULL DEFAULT 0,
    result_type     VARCHAR(20) NULL,
    submitted_at    DATETIME    NULL,
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_answer_sheet_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE risk_answer
(
    answer_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    answer_sheet_id BIGINT   NOT NULL,
    question_id     BIGINT   NOT NULL,
    option_id       BIGINT   NOT NULL,
    score           INT      NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_answer_sheet
        FOREIGN KEY (answer_sheet_id) REFERENCES risk_answer_sheet (answer_sheet_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_risk_answer_question
        FOREIGN KEY (question_id) REFERENCES risk_question (question_id),
    CONSTRAINT fk_risk_answer_option
        FOREIGN KEY (option_id) REFERENCES risk_question_option (option_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE investment_style
(
    style_id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                BIGINT        NOT NULL,
    answer_sheet_id          BIGINT        NULL,
    risk_score               INT           NOT NULL,
    risk_type                VARCHAR(20)   NOT NULL,
    investment_horizon_month INT           NOT NULL,
    max_loss_tolerance_pct   DECIMAL(5, 2) NULL,
    created_at               DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_investment_style_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_investment_style_answer_sheet
        FOREIGN KEY (answer_sheet_id) REFERENCES risk_answer_sheet (answer_sheet_id)
            ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE external_data_source
(
    source_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_name           VARCHAR(50)  NOT NULL,
    source_type           VARCHAR(30)  NOT NULL,
    base_url              VARCHAR(255) NULL,
    auth_method           VARCHAR(30)  NULL,
    refresh_cycle         VARCHAR(30)  NOT NULL,
    latest_guarantee_rule VARCHAR(255) NULL,
    active_yn             CHAR(1)      NOT NULL DEFAULT 'Y',
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_external_data_source_name UNIQUE (source_name),
    CONSTRAINT ck_external_data_source_active_yn CHECK (active_yn IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE asset
(
    asset_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticker          VARCHAR(30)   NOT NULL UNIQUE,
    asset_name      VARCHAR(100)  NOT NULL,
    asset_type      VARCHAR(30)   NOT NULL,
    market          VARCHAR(30)   NOT NULL,
    currency        VARCHAR(10)   NOT NULL DEFAULT 'KRW',
    sector          VARCHAR(50)   NULL,
    issuer_name     VARCHAR(100)  NULL,
    benchmark_index VARCHAR(100)  NULL,
    expense_ratio   DECIMAL(7, 4) NULL,
    risk_grade      VARCHAR(20)   NULL,
    data_source     VARCHAR(30)   NOT NULL DEFAULT 'YAHOO_FINANCE',
    source_id       BIGINT        NULL,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_source
        FOREIGN KEY (source_id) REFERENCES external_data_source (source_id)
            ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE asset_price
(
    price_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id        BIGINT         NOT NULL,
    price_date      DATE           NOT NULL,
    open_price      DECIMAL(15, 2) NOT NULL,
    high_price      DECIMAL(15, 2) NOT NULL,
    low_price       DECIMAL(15, 2) NOT NULL,
    close_price     DECIMAL(15, 2) NOT NULL,
    adj_close_price DECIMAL(15, 2) NULL,
    volume          BIGINT         NULL,
    source_id       BIGINT         NULL,
    created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_price_asset
        FOREIGN KEY (asset_id) REFERENCES asset (asset_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_asset_price_source
        FOREIGN KEY (source_id) REFERENCES external_data_source (source_id)
            ON DELETE SET NULL,
    CONSTRAINT uq_asset_price UNIQUE (asset_id, price_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_asset_price_date ON asset_price (price_date);

CREATE TABLE asset_indicator
(
    indicator_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id           BIGINT         NOT NULL,
    base_date          DATE           NOT NULL,
    daily_return_pct   DECIMAL(10, 4) NULL,
    monthly_return_pct DECIMAL(10, 4) NULL,
    volatility_30d     DECIMAL(10, 4) NULL,
    moving_avg_5d      DECIMAL(15, 2) NULL,
    moving_avg_20d     DECIMAL(15, 2) NULL,
    moving_avg_60d     DECIMAL(15, 2) NULL,
    sharpe_ratio       DECIMAL(10, 4) NULL,
    max_drawdown_pct   DECIMAL(10, 4) NULL,
    source_id          BIGINT         NULL,
    created_at         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_indicator_asset
        FOREIGN KEY (asset_id) REFERENCES asset (asset_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_asset_indicator_source
        FOREIGN KEY (source_id) REFERENCES external_data_source (source_id)
            ON DELETE SET NULL,
    CONSTRAINT uq_asset_indicator UNIQUE (asset_id, base_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE asset_fundamental
(
    fundamental_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id         BIGINT         NOT NULL,
    base_date        DATE           NOT NULL,
    roe              DECIMAL(10, 4) NULL,
    roa              DECIMAL(10, 4) NULL,
    per              DECIMAL(10, 4) NULL,
    pbr              DECIMAL(10, 4) NULL,
    eps              DECIMAL(15, 4) NULL,
    bps              DECIMAL(15, 4) NULL,
    debt_ratio       DECIMAL(10, 4) NULL,
    operating_margin DECIMAL(10, 4) NULL,
    net_margin       DECIMAL(10, 4) NULL,
    revenue          BIGINT         NULL,
    operating_income BIGINT         NULL,
    net_income       BIGINT         NULL,
    source_id        BIGINT         NULL,
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_fundamental_asset
        FOREIGN KEY (asset_id) REFERENCES asset (asset_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_asset_fundamental_source
        FOREIGN KEY (source_id) REFERENCES external_data_source (source_id)
            ON DELETE SET NULL,
    CONSTRAINT uq_asset_fundamental UNIQUE (asset_id, base_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_asset_fundamental_base_date ON asset_fundamental (base_date);

CREATE TABLE investment_goal
(
    goal_id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id            BIGINT         NOT NULL,
    goal_name            VARCHAR(100)   NOT NULL,
    target_amount        DECIMAL(15, 2) NOT NULL,
    target_date          DATE           NOT NULL,
    monthly_contribution DECIMAL(15, 2) NOT NULL DEFAULT 0,
    current_amount       DECIMAL(15, 2) NOT NULL DEFAULT 0,
    goal_status          VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    created_at           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_investment_goal_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE goal_simulation_result
(
    simulation_result_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                   BIGINT   NOT NULL,
    current_amount              BIGINT   NOT NULL,
    monthly_investment          BIGINT   NOT NULL,
    target_amount               BIGINT   NOT NULL,
    years                       INT      NOT NULL,
    expected_annual_return      DOUBLE   NOT NULL,
    annual_volatility           DOUBLE   NOT NULL,
    success_probability         DOUBLE   NOT NULL,
    average_final_amount        BIGINT   NOT NULL,
    optimistic_amount           BIGINT   NOT NULL,
    median_amount               BIGINT   NOT NULL,
    pessimistic_amount          BIGINT   NOT NULL,
    var_amount                  BIGINT   NOT NULL,
    worst_case_average_amount   BIGINT   NOT NULL,
    shortage_amount             BIGINT   NOT NULL,
    what_if_success_probability DOUBLE   NULL,
    probability_improvement     DOUBLE   NULL,
    created_at                  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_simulation_result_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE portfolio
(
    portfolio_id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id               BIGINT         NOT NULL,
    goal_id                 BIGINT         NULL,
    style_id                BIGINT         NULL,
    portfolio_name          VARCHAR(100)   NOT NULL,
    portfolio_type          VARCHAR(30)    NOT NULL DEFAULT 'RECOMMENDED',
    total_invested_amount   DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_evaluation_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    expected_return_pct     DECIMAL(10, 4) NULL,
    expected_volatility_pct DECIMAL(10, 4) NULL,
    portfolio_status        VARCHAR(20)    NOT NULL DEFAULT 'ACTIVE',
    created_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_portfolio_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_portfolio_goal
        FOREIGN KEY (goal_id) REFERENCES investment_goal (goal_id)
            ON DELETE SET NULL,
    CONSTRAINT fk_portfolio_style
        FOREIGN KEY (style_id) REFERENCES investment_style (style_id)
            ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE portfolio_asset_target
(
    target_id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id        BIGINT         NOT NULL,
    asset_id            BIGINT         NOT NULL,
    target_weight_pct   DECIMAL(7, 4)  NOT NULL,
    expected_return_pct DECIMAL(10, 4) NULL,
    risk_score          DECIMAL(10, 4) NULL,
    created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_portfolio_asset_target_portfolio
        FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_portfolio_asset_target_asset
        FOREIGN KEY (asset_id) REFERENCES asset (asset_id),
    CONSTRAINT uq_portfolio_asset_target UNIQUE (portfolio_id, asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE portfolio_asset_current
(
    current_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id           BIGINT         NOT NULL,
    asset_id               BIGINT         NOT NULL,
    holding_quantity       DECIMAL(18, 6) NOT NULL DEFAULT 0,
    average_buy_price      DECIMAL(15, 2) NULL,
    current_price          DECIMAL(15, 2) NULL,
    current_weight_pct     DECIMAL(7, 4)  NULL,
    evaluation_amount      DECIMAL(15, 2) NULL,
    unrealized_profit_loss DECIMAL(15, 2) NULL,
    updated_at             DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_portfolio_asset_current_portfolio
        FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_portfolio_asset_current_asset
        FOREIGN KEY (asset_id) REFERENCES asset (asset_id),
    CONSTRAINT uq_portfolio_asset_current UNIQUE (portfolio_id, asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE recommendation
(
    recommendation_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id               BIGINT         NOT NULL,
    portfolio_id            BIGINT         NULL,
    goal_id                 BIGINT         NULL,
    style_id                BIGINT         NULL,
    recommendation_type     VARCHAR(30)    NOT NULL,
    algorithm_version       VARCHAR(50)    NOT NULL,
    expected_return_pct     DECIMAL(10, 4) NULL,
    expected_volatility_pct DECIMAL(10, 4) NULL,
    success_probability     DECIMAL(10, 4) NULL,
    recommendation_reason   VARCHAR(500)   NULL,
    applied_yn              CHAR(1)        NOT NULL DEFAULT 'N',
    created_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendation_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_recommendation_portfolio
        FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id)
            ON DELETE SET NULL,
    CONSTRAINT fk_recommendation_goal
        FOREIGN KEY (goal_id) REFERENCES investment_goal (goal_id)
            ON DELETE SET NULL,
    CONSTRAINT fk_recommendation_style
        FOREIGN KEY (style_id) REFERENCES investment_style (style_id)
            ON DELETE SET NULL,
    CONSTRAINT ck_recommendation_applied_yn CHECK (applied_yn IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE recommendation_asset
(
    recommendation_asset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recommendation_id       BIGINT        NOT NULL,
    asset_id                BIGINT        NOT NULL,
    recommended_weight_pct  DECIMAL(7, 4) NOT NULL,
    rank_no                 INT           NOT NULL,
    reason_text             VARCHAR(255)  NULL,
    created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendation_asset_recommendation
        FOREIGN KEY (recommendation_id) REFERENCES recommendation (recommendation_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_recommendation_asset_asset
        FOREIGN KEY (asset_id) REFERENCES asset (asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE rebalancing_rule
(
    rule_id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id            BIGINT        NOT NULL,
    deviation_threshold_pct DECIMAL(7, 4) NOT NULL DEFAULT 5.0000,
    execution_cycle         VARCHAR(20)   NOT NULL DEFAULT 'MONTHLY',
    auto_rebalance_yn       CHAR(1)       NOT NULL DEFAULT 'Y',
    active_yn               CHAR(1)       NOT NULL DEFAULT 'Y',
    created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rebalancing_rule_portfolio
        FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id)
            ON DELETE CASCADE,
    CONSTRAINT uq_rebalancing_rule_portfolio UNIQUE (portfolio_id),
    CONSTRAINT ck_rebalancing_rule_auto_yn CHECK (auto_rebalance_yn IN ('Y', 'N')),
    CONSTRAINT ck_rebalancing_rule_active_yn CHECK (active_yn IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE rebalancing_history
(
    rebalance_id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id               BIGINT         NOT NULL,
    rule_id                    BIGINT         NULL,
    rebalance_date             DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rebalance_type             VARCHAR(30)    NOT NULL,
    trigger_reason             VARCHAR(255)   NOT NULL,
    before_expected_return_pct DECIMAL(10, 4) NULL,
    after_expected_return_pct  DECIMAL(10, 4) NULL,
    before_risk_pct            DECIMAL(10, 4) NULL,
    after_risk_pct             DECIMAL(10, 4) NULL,
    status                     VARCHAR(20)    NOT NULL DEFAULT 'COMPLETED',
    created_at                 DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rebalancing_history_portfolio
        FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_rebalancing_history_rule
        FOREIGN KEY (rule_id) REFERENCES rebalancing_rule (rule_id)
            ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE rebalancing_detail
(
    detail_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    rebalance_id      BIGINT        NOT NULL,
    asset_id          BIGINT        NOT NULL,
    before_weight_pct DECIMAL(7, 4) NOT NULL,
    target_weight_pct DECIMAL(7, 4) NOT NULL,
    after_weight_pct  DECIMAL(7, 4) NULL,
    action_type       VARCHAR(20)   NOT NULL,
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rebalancing_detail_rebalance
        FOREIGN KEY (rebalance_id) REFERENCES rebalancing_history (rebalance_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_rebalancing_detail_asset
        FOREIGN KEY (asset_id) REFERENCES asset (asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE notification
(
    notification_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id         BIGINT       NOT NULL,
    notification_type VARCHAR(30)  NOT NULL,
    title             VARCHAR(100) NOT NULL,
    message           VARCHAR(500) NOT NULL,
    related_id        BIGINT       NULL,
    is_read           CHAR(1)      NOT NULL DEFAULT 'N',
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT ck_notification_is_read CHECK (is_read IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE signup_progress
(
    progress_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT       NULL,
    session_key     VARCHAR(100) NOT NULL,
    current_step    VARCHAR(50)  NOT NULL,
    step_status     VARCHAR(20)  NOT NULL DEFAULT 'IN_PROGRESS',
    last_input_data JSON         NULL,
    resume_token    VARCHAR(100) NULL,
    started_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_saved_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at    DATETIME     NULL,
    CONSTRAINT uq_signup_progress_session UNIQUE (session_key),
    CONSTRAINT uq_signup_progress_resume_token UNIQUE (resume_token),
    CONSTRAINT fk_signup_progress_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_signup_progress_member ON signup_progress (member_id);

CREATE TABLE identity_verification
(
    verification_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id           BIGINT       NOT NULL,
    verification_type   VARCHAR(30)  NOT NULL,
    verification_status VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    request_id          VARCHAR(100) NULL,
    verified_name       VARCHAR(50)  NULL,
    verified_ci         VARCHAR(255) NULL,
    verified_di         VARCHAR(255) NULL,
    requested_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at         DATETIME     NULL,
    expired_at          DATETIME     NULL,
    failure_reason      VARCHAR(255) NULL,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_identity_verification_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_identity_verification_member_status
    ON identity_verification (member_id, verification_status);

CREATE TABLE member_data_consent
(
    consent_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT      NOT NULL,
    consent_type    VARCHAR(50) NOT NULL,
    consent_version VARCHAR(20) NOT NULL,
    consent_yn      CHAR(1)     NOT NULL DEFAULT 'Y',
    agreed_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at      DATETIME    NULL,
    source_channel  VARCHAR(30) NULL,
    CONSTRAINT ck_member_data_consent_yn CHECK (consent_yn IN ('Y', 'N')),
    CONSTRAINT fk_member_data_consent_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE CASCADE,
    CONSTRAINT uq_member_data_consent UNIQUE (member_id, consent_type, consent_version)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE user_event_log
(
    event_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id      BIGINT       NULL,
    session_key    VARCHAR(100) NULL,
    event_type     VARCHAR(50)  NOT NULL,
    event_name     VARCHAR(100) NOT NULL,
    event_value    VARCHAR(255) NULL,
    event_count    INT          NOT NULL DEFAULT 1,
    ref_table      VARCHAR(50)  NULL,
    ref_id         BIGINT       NULL,
    event_metadata JSON         NULL,
    occurred_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_event_log_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_user_event_log_member_time
    ON user_event_log (member_id, occurred_at);

CREATE INDEX idx_user_event_log_event_type_time
    ON user_event_log (event_type, occurred_at);

CREATE TABLE conversion_funnel_log
(
    funnel_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id     BIGINT       NULL,
    session_key   VARCHAR(100) NULL,
    funnel_name   VARCHAR(50)  NOT NULL,
    stage_name    VARCHAR(50)  NOT NULL,
    stage_order   INT          NOT NULL,
    stage_status  VARCHAR(20)  NOT NULL DEFAULT 'ENTERED',
    entered_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at  DATETIME     NULL,
    drop_reason   VARCHAR(255) NULL,
    CONSTRAINT fk_conversion_funnel_log_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
            ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_conversion_funnel_log_member
    ON conversion_funnel_log (member_id, funnel_name);

CREATE INDEX idx_conversion_funnel_log_stage
    ON conversion_funnel_log (funnel_name, stage_name, stage_status);

CREATE TABLE data_sync_history
(
    sync_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_id        BIGINT       NOT NULL,
    sync_target      VARCHAR(50)  NOT NULL,
    target_key       VARCHAR(100) NULL,
    sync_status      VARCHAR(20)  NOT NULL DEFAULT 'SUCCESS',
    requested_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at       DATETIME     NULL,
    finished_at      DATETIME     NULL,
    records_received INT          NOT NULL DEFAULT 0,
    records_saved    INT          NOT NULL DEFAULT 0,
    error_message    VARCHAR(500) NULL,
    CONSTRAINT fk_data_sync_history_source
        FOREIGN KEY (source_id) REFERENCES external_data_source (source_id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_data_sync_history_source_time
    ON data_sync_history (source_id, requested_at);

CREATE INDEX idx_data_sync_history_target
    ON data_sync_history (sync_target, sync_status);