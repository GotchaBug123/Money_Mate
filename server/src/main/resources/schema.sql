DROP DATABASE IF EXISTS moneymate_db;

CREATE DATABASE moneymate_db;
USE moneymate_db;

CREATE TABLE member
(
    member_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    login_id      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    name          VARCHAR(50)  NOT NULL,
    birth_date    DATE         NULL,
    signup_status VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE member_auth
(
    auth_id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id         BIGINT       NOT NULL,
    password_hash     VARCHAR(255) NOT NULL,
    last_login_at     DATETIME     NULL,
    login_fail_count  INT          NOT NULL DEFAULT 0,
    account_locked_yn VARCHAR(1)   NOT NULL DEFAULT 'N',
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_auth_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT uq_member_auth_member UNIQUE (member_id),
    CONSTRAINT ck_member_auth_locked CHECK (account_locked_yn IN ('Y', 'N'))
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
    net_asset                DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_expense            DECIMAL(15, 2) NOT NULL DEFAULT 0,
    expense_ratio            DECIMAL(5, 2)  NOT NULL DEFAULT 0,
    saving_ratio             DECIMAL(5, 2)  NOT NULL DEFAULT 0,
    diagnosis_grade          VARCHAR(20)    NULL     DEFAULT 'NORMAL',
    created_at               DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_financial_profile_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
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
    CONSTRAINT fk_spending_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_spending_category FOREIGN KEY (category_id) REFERENCES spending_category (category_id),
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
    CONSTRAINT fk_monthly_budget_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
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
    CONSTRAINT fk_saving_analysis_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_saving_analysis_category FOREIGN KEY (top_over_category_id) REFERENCES spending_category (category_id),
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
    CONSTRAINT fk_risk_question_option_question FOREIGN KEY (question_id) REFERENCES risk_question (question_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE risk_profile
(
    risk_profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT      NOT NULL UNIQUE,
    total_score     INT         NOT NULL,
    risk_type_code  VARCHAR(20) NOT NULL,
    risk_type_name  VARCHAR(30) NOT NULL,
    created_at      DATETIME(6) NULL,
    CONSTRAINT fk_risk_profile_member
        FOREIGN KEY (member_id)
            REFERENCES member (member_id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


CREATE TABLE risk_answer_sheet
(
    answer_sheet_id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                  BIGINT       NOT NULL,
    total_score                INT          NOT NULL DEFAULT 0,
    result_type                VARCHAR(30)  NULL,
    age_group                  VARCHAR(30)  NULL,
    income_range               VARCHAR(50)  NULL,
    investment_purpose         VARCHAR(100) NULL,
    investment_horizon         VARCHAR(30)  NULL,
    experience_level           VARCHAR(30)  NULL,
    understanding_level        VARCHAR(30)  NULL,
    risk_tolerance             VARCHAR(30)  NULL,
    preferred_product          VARCHAR(30)  NULL,
    preferred_themes           VARCHAR(500) NULL,
    risk_avoidance_percent     DECIMAL(5, 2)         DEFAULT 0.00,
    financial_interest_percent DECIMAL(5, 2)         DEFAULT 0.00,
    submitted_at               DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP,
    created_at                 DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_answer_sheet_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE
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
    CONSTRAINT fk_risk_answer_sheet FOREIGN KEY (answer_sheet_id) REFERENCES risk_answer_sheet (answer_sheet_id) ON DELETE CASCADE,
    CONSTRAINT fk_risk_answer_question FOREIGN KEY (question_id) REFERENCES risk_question (question_id),
    CONSTRAINT fk_risk_answer_option FOREIGN KEY (option_id) REFERENCES risk_question_option (option_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE investment_style
(
    style_id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                BIGINT        NOT NULL,
    answer_sheet_id          BIGINT        NULL,
    risk_score               INT           NOT NULL,
    risk_type                VARCHAR(30)   NOT NULL,
    investment_horizon_month INT           NOT NULL,
    max_loss_tolerance_pct   DECIMAL(5, 2) NULL,
    created_at               DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_investment_style_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_investment_style_answer_sheet FOREIGN KEY (answer_sheet_id) REFERENCES risk_answer_sheet (answer_sheet_id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE external_data_source
(
    source_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_name           VARCHAR(50)  NOT NULL UNIQUE,
    source_type           VARCHAR(30)  NOT NULL,
    base_url              VARCHAR(255) NULL,
    auth_method           VARCHAR(30)  NULL,
    refresh_cycle         VARCHAR(30)  NOT NULL,
    latest_guarantee_rule VARCHAR(255) NULL,
    active_yn             CHAR(1)      NOT NULL DEFAULT 'Y',
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ck_external_data_source_active_yn CHECK (active_yn IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE asset_master
(
    asset_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol       VARCHAR(30)  NOT NULL,
    yahoo_symbol VARCHAR(30)  NOT NULL,
    asset_name   VARCHAR(120) NOT NULL,
    market       VARCHAR(30)  NOT NULL,
    asset_type   VARCHAR(30)  NOT NULL,
    country      VARCHAR(10)  NOT NULL DEFAULT 'KR',
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_asset_master_symbol UNIQUE (symbol),
    CONSTRAINT uq_asset_master_yahoo_symbol UNIQUE (yahoo_symbol)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_asset_master_asset_name ON asset_master (asset_name);
CREATE INDEX idx_asset_master_market ON asset_master (market);
CREATE INDEX idx_asset_master_country ON asset_master (country);

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
    CONSTRAINT fk_asset_source FOREIGN KEY (source_id) REFERENCES external_data_source (source_id) ON DELETE SET NULL
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
    trading_value   BIGINT         NULL,
    daily_return    DECIMAL(10, 6) NULL,
    source_id       BIGINT         NULL,
    created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_price_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE,
    CONSTRAINT fk_asset_price_source FOREIGN KEY (source_id) REFERENCES external_data_source (source_id) ON DELETE SET NULL,
    CONSTRAINT uq_asset_price UNIQUE (asset_id, price_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_asset_price_date ON asset_price (price_date);
CREATE INDEX idx_asset_price_asset_date ON asset_price (asset_id, price_date);

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
    dividend_yield_pct DECIMAL(10, 4) NULL,
    source_id          BIGINT         NULL,
    created_at         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_indicator_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE,
    CONSTRAINT fk_asset_indicator_source FOREIGN KEY (source_id) REFERENCES external_data_source (source_id) ON DELETE SET NULL,
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
    CONSTRAINT fk_asset_fundamental_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE,
    CONSTRAINT fk_asset_fundamental_source FOREIGN KEY (source_id) REFERENCES external_data_source (source_id) ON DELETE SET NULL,
    CONSTRAINT uq_asset_fundamental UNIQUE (asset_id, base_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_asset_fundamental_base_date ON asset_fundamental (base_date);

CREATE TABLE asset_score
(
    score_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id             BIGINT   NOT NULL,
    score_date           DATE     NOT NULL,
    return_score         DECIMAL(5, 2)     DEFAULT 0,
    trend_score          DECIMAL(5, 2)     DEFAULT 0,
    volatility_score     DECIMAL(5, 2)     DEFAULT 0,
    volume_score         DECIMAL(5, 2)     DEFAULT 0,
    fundamental_score    DECIMAL(5, 2)     DEFAULT 0,
    user_interest_score  DECIMAL(5, 2)     DEFAULT 0,
    total_score          DECIMAL(5, 2)     DEFAULT 0,
    recommendation_grade VARCHAR(20),
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_score_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE,
    UNIQUE KEY uq_asset_score (asset_id, score_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

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
    CONSTRAINT fk_investment_goal_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE theme
(
    theme_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    theme_name  VARCHAR(100) NOT NULL,
    theme_type  VARCHAR(30)  NOT NULL,
    description TEXT         NULL,
    active_yn   CHAR(1)      NOT NULL DEFAULT 'Y',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_theme_name (theme_name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE theme_asset
(
    theme_asset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    theme_id       BIGINT   NOT NULL,
    asset_id       BIGINT   NOT NULL,
    display_order  INT      NOT NULL DEFAULT 0,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theme_asset_theme FOREIGN KEY (theme_id) REFERENCES theme (theme_id) ON DELETE CASCADE,
    CONSTRAINT fk_theme_asset_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE,
    UNIQUE KEY uq_theme_asset (theme_id, asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE favorite_asset
(
    favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id   BIGINT   NOT NULL,
    asset_id    BIGINT   NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorite_asset_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_favorite_asset_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE,
    UNIQUE KEY uq_favorite_asset (member_id, asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_favorite_member ON favorite_asset (member_id, asset_id);

CREATE TABLE cart_asset
(
    cart_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT   NOT NULL,
    asset_id        BIGINT   NOT NULL,
    source_theme_id BIGINT   NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_asset_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_asset_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_asset_theme FOREIGN KEY (source_theme_id) REFERENCES theme (theme_id) ON DELETE SET NULL,
    UNIQUE KEY uq_cart_asset (member_id, asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE investment_info
(
    info_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    content     LONGTEXT     NOT NULL,
    category    VARCHAR(50),
    source_name VARCHAR(100),
    source_url  VARCHAR(500),
    active      BOOLEAN  DEFAULT TRUE,
    view_count  BIGINT   DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE user_investment_asset
(
    investment_asset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id           BIGINT         NOT NULL,
    asset_id            BIGINT         NOT NULL,
    buy_price           DECIMAL(15, 2) NOT NULL,
    quantity            DECIMAL(15, 4) NOT NULL,
    buy_date            DATE           NOT NULL DEFAULT (CURRENT_DATE),
    memo                VARCHAR(255)   NULL,
    investment_status   VARCHAR(20)    NOT NULL DEFAULT 'HOLDING',
    created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_investment_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_investment_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_user_investment_member ON user_investment_asset (member_id, asset_id);

CREATE TABLE investment_holding
(
    holding_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id  BIGINT         NOT NULL,
    ticker     VARCHAR(30)    NOT NULL,
    asset_name VARCHAR(100)   NOT NULL,
    market     VARCHAR(30),
    quantity   INT            NOT NULL DEFAULT 1,
    buy_price  DECIMAL(15, 2) NOT NULL,
    buy_date   DATE           NOT NULL DEFAULT (CURRENT_DATE),
    created_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_holding_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    UNIQUE KEY uq_member_ticker_holding (member_id, ticker)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE watchlist
(
    watchlist_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id    BIGINT       NOT NULL,
    ticker       VARCHAR(30)  NOT NULL,
    asset_name   VARCHAR(100) NOT NULL,
    market       VARCHAR(30),
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_watchlist_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    UNIQUE KEY uq_member_ticker_watchlist (member_id, ticker)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE goal_simulation
(
    simulation_id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id               BIGINT         NOT NULL,
    goal_id                 BIGINT         NULL,
    goal_amount             DECIMAL(15, 2) NOT NULL,
    initial_amount          DECIMAL(15, 2) NOT NULL,
    monthly_invest_amount   DECIMAL(15, 2) NOT NULL,
    investment_years        INT            NOT NULL,
    expected_return_pct     DECIMAL(10, 4) NOT NULL,
    expected_volatility_pct DECIMAL(10, 4) NOT NULL,
    simulation_count        INT            NOT NULL DEFAULT 1000,
    success_probability     DECIMAL(5, 2)  NULL,
    worst_result_amount     DECIMAL(15, 2) NULL,
    median_result_amount    DECIMAL(15, 2) NULL,
    best_result_amount      DECIMAL(15, 2) NULL,
    created_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_simulation_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_goal_simulation_goal FOREIGN KEY (goal_id) REFERENCES investment_goal (goal_id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE member_investment_grade
(
    grade_id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id           BIGINT        NOT NULL,
    grade_name          VARCHAR(30)   NOT NULL DEFAULT 'BRONZE',
    grade_color         VARCHAR(20)   NOT NULL DEFAULT '#CD7F32',
    investment_months   INT           NOT NULL DEFAULT 0,
    return_score        DECIMAL(5, 2) NOT NULL DEFAULT 0,
    understanding_score DECIMAL(5, 2) NOT NULL DEFAULT 0,
    activity_score      DECIMAL(5, 2) NOT NULL DEFAULT 0,
    total_score         DECIMAL(5, 2) NOT NULL DEFAULT 0,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_grade_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    UNIQUE KEY uq_member_grade (member_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE member_yearly_performance
(
    performance_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id               BIGINT         NOT NULL,
    performance_year        INT            NOT NULL,
    total_invested_amount   DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_evaluation_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    profit_amount           DECIMAL(15, 2) NOT NULL DEFAULT 0,
    return_rate             DECIMAL(10, 4) NOT NULL DEFAULT 0,
    risk_type               VARCHAR(30)    NULL,
    created_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_yearly_performance_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    UNIQUE KEY uq_member_yearly_performance (member_id, performance_year)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE investment_performance_summary
(
    summary_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    performance_year  INT            NOT NULL,
    risk_type         VARCHAR(30)    NOT NULL,
    member_count      INT            NOT NULL DEFAULT 0,
    avg_return_rate   DECIMAL(10, 4) NOT NULL DEFAULT 0,
    avg_profit_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_performance_summary (performance_year, risk_type)
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
    CONSTRAINT fk_portfolio_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_portfolio_goal FOREIGN KEY (goal_id) REFERENCES investment_goal (goal_id) ON DELETE SET NULL,
    CONSTRAINT fk_portfolio_style FOREIGN KEY (style_id) REFERENCES investment_style (style_id) ON DELETE SET NULL
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
    CONSTRAINT fk_portfolio_asset_target_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id) ON DELETE CASCADE,
    CONSTRAINT fk_portfolio_asset_target_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id),
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
    CONSTRAINT fk_portfolio_asset_current_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id) ON DELETE CASCADE,
    CONSTRAINT fk_portfolio_asset_current_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id),
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
    recommendation_date     DATE           NOT NULL DEFAULT (CURRENT_DATE),
    applied_yn              CHAR(1)        NOT NULL DEFAULT 'N',
    created_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendation_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_recommendation_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id) ON DELETE SET NULL,
    CONSTRAINT fk_recommendation_goal FOREIGN KEY (goal_id) REFERENCES investment_goal (goal_id) ON DELETE SET NULL,
    CONSTRAINT fk_recommendation_style FOREIGN KEY (style_id) REFERENCES investment_style (style_id) ON DELETE SET NULL,
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
    CONSTRAINT fk_recommendation_asset_recommendation FOREIGN KEY (recommendation_id) REFERENCES recommendation (recommendation_id) ON DELETE CASCADE,
    CONSTRAINT fk_recommendation_asset_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id)
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
    CONSTRAINT fk_rebalancing_rule_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id) ON DELETE CASCADE,
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
    CONSTRAINT fk_rebalancing_history_portfolio FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id) ON DELETE CASCADE,
    CONSTRAINT fk_rebalancing_history_rule FOREIGN KEY (rule_id) REFERENCES rebalancing_rule (rule_id) ON DELETE SET NULL
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
    CONSTRAINT fk_rebalancing_detail_rebalance FOREIGN KEY (rebalance_id) REFERENCES rebalancing_history (rebalance_id) ON DELETE CASCADE,
    CONSTRAINT fk_rebalancing_detail_asset FOREIGN KEY (asset_id) REFERENCES asset (asset_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE goal_strategy_result
(
    goal_strategy_result_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id                      BIGINT       NOT NULL,
    goal_name                      VARCHAR(100) NOT NULL,
    current_amount                 BIGINT       NOT NULL,
    monthly_investment             BIGINT       NOT NULL,
    target_amount                  BIGINT       NOT NULL,
    investment_years               INT          NOT NULL,
    rebalance_cycle                VARCHAR(30)  NOT NULL,
    selected_asset_summary         LONGTEXT     NOT NULL,
    success_probability            DOUBLE       NOT NULL,
    average_final_amount           BIGINT       NOT NULL,
    optimistic_amount              BIGINT       NOT NULL,
    median_amount                  BIGINT       NOT NULL,
    pessimistic_amount             BIGINT       NOT NULL,
    var_amount                     BIGINT       NOT NULL,
    worst_case_average_amount      BIGINT       NOT NULL,
    shortage_amount                BIGINT       NOT NULL,
    recommended_monthly_investment BIGINT       NULL,
    strategy_grade                 VARCHAR(10)  NULL,
    strategy_comment               LONGTEXT     NULL,
    what_if_success_probability    DOUBLE       NULL,
    probability_improvement        DOUBLE       NULL,
    created_at                     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_strategy_result_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_goal_strategy_member ON goal_strategy_result (member_id);
CREATE INDEX idx_goal_strategy_created_at ON goal_strategy_result (created_at);

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
    CONSTRAINT fk_notification_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
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
    CONSTRAINT fk_signup_progress_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE SET NULL
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
    CONSTRAINT fk_identity_verification_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_identity_verification_member_status ON identity_verification (member_id, verification_status);

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
    CONSTRAINT fk_member_data_consent_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
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
    CONSTRAINT fk_user_event_log_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_user_event_log_member_time ON user_event_log (member_id, occurred_at);
CREATE INDEX idx_user_event_log_event_type_time ON user_event_log (event_type, occurred_at);

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
    CONSTRAINT fk_conversion_funnel_log_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_conversion_funnel_log_member ON conversion_funnel_log (member_id, funnel_name);
CREATE INDEX idx_conversion_funnel_log_stage ON conversion_funnel_log (funnel_name, stage_name, stage_status);

CREATE TABLE data_sync_history
(
    sync_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_id        BIGINT       NULL,
    source_name      VARCHAR(50)  NULL,
    sync_type        VARCHAR(50)  NULL,
    sync_target      VARCHAR(50)  NULL,
    target_key       VARCHAR(100) NULL,
    sync_status      VARCHAR(20)  NOT NULL DEFAULT 'SUCCESS',
    target_date      DATE         NULL,
    requested_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at       DATETIME     NULL,
    finished_at      DATETIME     NULL,
    ended_at         DATETIME     NULL,
    success_count    INT          NOT NULL DEFAULT 0,
    fail_count       INT          NOT NULL DEFAULT 0,
    records_received INT          NOT NULL DEFAULT 0,
    records_saved    INT          NOT NULL DEFAULT 0,
    error_message    TEXT         NULL,
    CONSTRAINT fk_data_sync_history_source FOREIGN KEY (source_id) REFERENCES external_data_source (source_id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_data_sync_history_source_time ON data_sync_history (source_id, requested_at);
CREATE INDEX idx_data_sync_history_target ON data_sync_history (sync_target, sync_status);

CREATE TABLE community_theme
(
    theme_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    theme_name    VARCHAR(50)  NOT NULL,
    description   VARCHAR(255) NULL,
    display_order INT          NOT NULL DEFAULT 0,
    active_yn     VARCHAR(1)   NOT NULL DEFAULT 'Y',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_community_theme_name UNIQUE (theme_name),
    CONSTRAINT ck_community_theme_active_yn CHECK (active_yn IN ('Y', 'N'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE community_post
(
    post_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id    BIGINT       NOT NULL,
    theme_id     BIGINT       NULL,
    category     VARCHAR(30)  NOT NULL DEFAULT 'GENERAL',
    title        VARCHAR(200) NOT NULL,
    content      LONGTEXT     NOT NULL,
    stock_symbol VARCHAR(30)  NULL,
    stock_name   VARCHAR(100) NULL,
    view_count   BIGINT       NOT NULL DEFAULT 0,
    like_count   INT          NOT NULL DEFAULT 0,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_community_post_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT fk_community_post_theme FOREIGN KEY (theme_id) REFERENCES community_theme (theme_id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_community_post_member ON community_post (member_id);
CREATE INDEX idx_community_post_theme ON community_post (theme_id);
CREATE INDEX idx_community_post_category ON community_post (category);
CREATE INDEX idx_community_post_created_at ON community_post (created_at);
CREATE INDEX idx_community_post_view_count ON community_post (view_count);

CREATE TABLE community_attachment
(
    attachment_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id         BIGINT       NOT NULL,
    attachment_url  VARCHAR(500) NOT NULL,
    attachment_name VARCHAR(255) NOT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_community_attachment_post FOREIGN KEY (post_id) REFERENCES community_post (post_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE community_comment
(
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id    BIGINT   NOT NULL,
    member_id  BIGINT   NOT NULL,
    content    LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_community_comment_post FOREIGN KEY (post_id) REFERENCES community_post (post_id) ON DELETE CASCADE,
    CONSTRAINT fk_community_comment_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_community_comment_post ON community_comment (post_id);
CREATE INDEX idx_community_comment_member ON community_comment (member_id);
CREATE INDEX idx_community_comment_created_at ON community_comment (created_at);

CREATE TABLE community_post_like
(
    post_like_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id      BIGINT   NOT NULL,
    member_id    BIGINT   NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_community_post_like_post FOREIGN KEY (post_id) REFERENCES community_post (post_id) ON DELETE CASCADE,
    CONSTRAINT fk_community_post_like_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE,
    CONSTRAINT uq_community_post_like_member UNIQUE (post_id, member_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_community_post_like_post ON community_post_like (post_id);
CREATE INDEX idx_community_post_like_member ON community_post_like (member_id);

CREATE TABLE faq
(
    faq_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    category   VARCHAR(50)  NOT NULL,
    question   VARCHAR(255) NOT NULL,
    answer     TEXT         NOT NULL,
    view_count INT          NOT NULL DEFAULT 0,
    active_yn  CHAR(1)      NOT NULL DEFAULT 'Y',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE customer_inquiry
(
    inquiry_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id   BIGINT       NOT NULL,
    category    VARCHAR(50)  NOT NULL,
    title       VARCHAR(255) NOT NULL,
    content     TEXT         NOT NULL,
    answer      TEXT         NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'WAITING',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    answered_at DATETIME     NULL,
    CONSTRAINT fk_customer_inquiry_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

INSERT INTO member (login_id, email, name, birth_date, role, signup_status)
VALUES ('test1', 'test1@test.com', '홍길동', '1995-01-01', 'USER', 'ACTIVE'),
       ('masteradmin', 'masteradmin@moneymate.com', '최고관리자', NULL, 'ADMIN', 'ACTIVE');

INSERT INTO member_auth (member_id, password_hash, last_login_at, login_fail_count, account_locked_yn)
SELECT member_id, '1234', NOW(), 0, 'N'
FROM member
WHERE login_id = 'test1';

INSERT INTO member_auth (member_id, password_hash, last_login_at, login_fail_count, account_locked_yn)
SELECT member_id, 'admin1234', NOW(), 0, 'N'
FROM member
WHERE login_id = 'masteradmin';

INSERT INTO financial_profile (member_id, monthly_income, monthly_fixed_expense, monthly_variable_expense,
                               total_asset, total_liability, cash_asset, investable_amount,
                               net_asset, total_expense, expense_ratio, saving_ratio, diagnosis_grade)
SELECT member_id,
       3000000,
       800000,
       500000,
       10000000,
       2000000,
       3000000,
       450000,
       8000000,
       1300000,
       43.33,
       15.00,
       'GOOD'
FROM member
WHERE login_id = 'test1';

INSERT INTO spending_category (category_name, parent_category, essential_yn)
VALUES ('월세', '주거', 'Y'),
       ('보험', '고정지출', 'Y'),
       ('식비', '생활비', 'Y'),
       ('쇼핑', '변동지출', 'N');

INSERT INTO external_data_source (source_name, source_type, base_url, auth_method, refresh_cycle, latest_guarantee_rule,
                                  active_yn)
VALUES ('YAHOO_FINANCE', 'MARKET_API', 'https://finance.yahoo.com', NULL, 'DAILY', NULL, 'Y'),
       ('DART', 'FUNDAMENTAL_API', 'https://opendart.fss.or.kr', NULL, 'QUARTERLY', NULL, 'Y');

INSERT INTO faq (category, question, answer, view_count)
VALUES ('투자', '로보어드바이저 추천 포트폴리오는 어떻게 만들어지나요?', '회원님의 투자성향, 재무정보, 목표금액, 투자기간을 바탕으로 ETF와 주식 데이터를 분석하여 추천 포트폴리오를 제공합니다.',
        35),
       ('투자', '투자성향 분석 결과를 다시 받을 수 있나요?', '마이페이지 또는 투자성향 분석 메뉴에서 언제든지 다시 진행할 수 있습니다.', 28),
       ('수익률', '내 투자 수익률은 어떻게 계산되나요?', '매수가, 보유수량, 현재가를 기준으로 평가금액과 수익률을 계산합니다.', 42),
       ('계정', '비밀번호를 변경하고 싶어요.', '마이페이지의 비밀번호 변경 메뉴에서 변경할 수 있습니다.', 22),
       ('데이터', '주식 현재가는 어디서 가져오나요?', 'Yahoo Finance 등 외부 금융 데이터 API를 통해 현재가를 조회합니다.', 31),
       ('문의', '답변은 얼마나 걸리나요?', '문의 접수 후 보통 1~2영업일 이내 답변됩니다.', 18);