INSERT INTO member (login_id, email, name, birth_date, signup_status, role)
VALUES ('masteradmin', 'masteradmin@moneymate.com', '최고관리자', NULL, 'ACTIVE', 'ADMIN'),
       ('test1', 'test1@test.com', '홍길동', '1995-01-01', 'ACTIVE', 'USER');

INSERT INTO member_auth (member_id, password_hash, last_login_at, login_fail_count, account_locked_yn)
SELECT member_id, 'admin1234', NULL, 0, 'N'
FROM member
WHERE login_id = 'masteradmin';

INSERT INTO member_auth (member_id, password_hash, last_login_at, login_fail_count, account_locked_yn)
SELECT member_id, '1234', NULL, 0, 'N'
FROM member
WHERE login_id = 'test1';

INSERT INTO spending_category (category_name, parent_category, essential_yn)
VALUES ('월세', '주거', 'Y'),
       ('보험', '고정지출', 'Y'),
       ('통신비', '고정지출', 'Y'),
       ('식비', '생활비', 'Y'),
       ('교통', '생활비', 'Y'),
       ('쇼핑', '변동지출', 'N'),
       ('유흥', '변동지출', 'N'),
       ('카페', '변동지출', 'N');

INSERT INTO risk_question (question_text, question_order, active_yn)
VALUES ('투자 기간은 어느 정도로 생각하고 있나요?', 1, 'Y'),
       ('손실이 발생했을 때 감내할 수 있는 수준은 어느 정도인가요?', 2, 'Y'),
       ('투자 경험은 어느 정도인가요?', 3, 'Y');

INSERT INTO risk_question_option (question_id, option_text, score, option_order)
VALUES (1, '1년 미만', 1, 1),
       (1, '1년 ~ 3년', 2, 2),
       (1, '3년 이상', 3, 3),
       (2, '원금 손실이 나면 바로 매도', 1, 1),
       (2, '일부 손실은 감수 가능', 2, 2),
       (2, '큰 손실도 장기적으로 감내 가능', 3, 3),
       (3, '투자 경험 없음', 1, 1),
       (3, '예금/적금, 펀드 정도 경험', 2, 2),
       (3, '주식/ETF 등 적극적 투자 경험', 3, 3);

INSERT INTO external_data_source (source_name, source_type, base_url, auth_method, refresh_cycle, latest_guarantee_rule,
                                  active_yn)
VALUES ('YAHOO_FINANCE', 'MARKET_API', 'https://finance.yahoo.com', 'NONE', 'DAILY', '일별 종가 기준 다음 영업일 내 갱신', 'Y'),
       ('DART', 'FUNDAMENTAL_API', 'https://opendart.fss.or.kr', 'API_KEY', 'QUARTERLY', '분기 보고서 공시 반영 후 갱신', 'Y'),
       ('KRX', 'MARKET_API', 'https://data.krx.co.kr', 'NONE', 'DAILY', '거래일 마감 후 갱신', 'Y');

