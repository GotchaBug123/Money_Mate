// src/components/Policies/PolicyContents.jsx

import React from 'react';
import styles from './Policy.module.css';

// ─── 서비스 이용약관 공통 내용 ───
export const TermsContent = () => (
    <div className={styles.wrapper}>
        <div className={styles.section}>
            <p className={styles.heading}>제 1 조 (목적)</p>
            <p className={styles.text}>본 약관은 머니메이트(MoneyMate)(이하 "회사"라 함)가 제공하는 자산 진단 및 포트폴리오 시뮬레이션 서비스(이하 "서비스"라 함)의
                이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 2 조 (용어의 정의)</p>
            <ul className={styles.list}>
                <li className={styles.listItem}><strong>"서비스"</strong>란 구현 단말기와 상관없이 회원이 이용할 수 있는 머니메이트의 모든 서비스를 의미합니다.
                </li>
                <li className={styles.listItem}><strong>"회원"</strong>이란 회사와 이용계약을 체결하고 서비스를 이용하는 고객을 말합니다.</li>
                <li className={styles.listItem}><strong>"포트폴리오 시뮬레이션"</strong>이란 과거 시장 데이터를 기반으로 가상의 투자 결과를 도출하여 제공하는
                    정보성 기능을 의미합니다.
                </li>
            </ul>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 3 조 (서비스의 제공 및 변경)</p>
            <p className={styles.text}>회사는 개인 맞춤형 재무 진단, AI 기반 포트폴리오 추천, 가상 자산 리밸런싱 등의 서비스를 제공하며, 서비스 향상을 위해 사전 통지 없이 일부
                변경이나 중단이 가능합니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 4 조 (회원의 의무 및 금지행위)</p>
            <p className={styles.text}>회원은 본 약관 및 관련 법령을 준수하여야 하며, 다음 각 호의 행위를 하여서는 안 됩니다.</p>
            <ul className={styles.list}>
                <li className={styles.listItem}>회원가입 또는 정보 변경 시 허위 내용의 등록 및 타인의 정보 도용</li>
                <li className={styles.listItem}>회사가 게시한 정보의 임의 변경 및 정상적인 서비스 운영을 방해하는 해킹 등의 행위</li>
                <li className={styles.listItem}>회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            </ul>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 5 조 (게시물의 관리 및 저작권)</p>
            <p className={styles.text}>회원이 커뮤니티 등 서비스 내에 게시한 게시물의 저작권은 해당 회원에게 귀속됩니다. 단, 회사는 욕설, 비방, 불법적인 내용, 타인의 권리를
                침해하는 내용이 포함된 게시물에 대해 사전 통지 없이 삭제하거나 임시 조치할 수 있습니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 6 조 (이용계약 해지 및 제한)</p>
            <p className={styles.text}>회원은 언제든지 마이페이지를 통해 이용계약 해지(회원 탈퇴)를 신청할 수 있습니다. 회원이 제4조의 의무를 위반한 경우, 회사는 사전 통지 없이
                이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 7 조 (면책 조항 및 투자 유의사항) <span className={styles.highlight}>[중요]</span></p>
            <p className={styles.text}>본 서비스는 회원의 의사결정을 돕기 위한 <strong>단순 참고용 "모의 정보"</strong>를 제공할 뿐, 투자 권유나 특정 종목의 매수를
                지시하는 서비스가 아닙니다.</p>
            <div className={styles.warning}>
                제공되는 예상 수익률과 분석 정보는 과거 데이터를 기반으로 한 가상 결과이며 미래 수익을 보장하지 않습니다. 실제 투자로 발생하는 원금 손실 등에 대한 모든 법적 책임은 전적으로 투자자
                본인에게 있습니다.
            </div>
        </div>
    </div>
);

// ─── 개인정보처리방침 공통 내용 ───
export const PrivacyContent = () => (
    <div className={styles.wrapper}>
        <div className={styles.section}>
            <p className={styles.heading}>제 1 조 (목적 및 안내) <span className={styles.highlight}>[포트폴리오 안내]</span></p>
            <p className={styles.text}>본 사이트(MoneyMate)는 개발 포트폴리오 목적으로 제작된 가상의 웹 서비스입니다. 입력하시는 모든 개인정보는 <strong>상업적으로
                이용되거나 외부로 유출되지 않으며</strong>, 안전하게 테스트 목적으로만 보관됩니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 2 조 (수집하는 개인정보의 항목 및 수집 방법)</p>
            <ul className={styles.list}>
                <li className={styles.listItem}><strong>필수항목:</strong> 아이디, 비밀번호, 이름, 이메일, 생년월일, 휴대전화번호</li>
                <li className={styles.listItem}><strong>선택항목:</strong> 자산 현황, 월 수입 및 지출, 투자 성향 진단 결과</li>
                <li className={styles.listItem}><strong>수집방법:</strong> 홈페이지 회원가입, 커뮤니티 이용, 고객센터 문의 작성 시 회원이 직접 입력</li>
            </ul>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 3 조 (개인정보의 이용 목적)</p>
            <p className={styles.text}>수집된 개인정보는 회원 관리(본인확인, 불량회원의 부정 이용 방지), 서비스 제공(AI 포트폴리오 시뮬레이션, 진단 리포트 생성), 고객센터 문의
                응대 및 안내사항 전달을 위해서만 활용됩니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 4 조 (개인정보의 제3자 제공 및 처리 위탁)</p>
            <p className={styles.text}>본 서비스는 회원의 사전 동의 없이 개인정보를 외부에 제공하거나 처리 업무를 위탁하지 않습니다. 단, 관련 법령에 의거하여 수사기관의 적법한
                요구가 있는 경우에는 예외로 합니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 5 조 (정보주체의 권리와 그 행사방법)</p>
            <p className={styles.text}>회원은 언제든지 등록되어 있는 자신의 개인정보를 마이페이지를 통해 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보의 삭제 및 처리 정지를
                요청할 수 있습니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 6 조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</p>
            <p className={styles.text}>회사는 이용자에게 빠르고 편리한 웹사이트 사용 환경을 지원하기 위해 로그인 유지 및 세션 관리용으로만 브라우저의 로컬 스토리지(Local
                Storage) 및 쿠키(Cookie)를 최소한으로 운영합니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 7 조 (개인정보의 보유 및 파기 절차)</p>
            <p className={styles.text}>원칙적으로 이용 목적이 달성된 후에는 지체 없이 파기합니다. 단, 테스트 데이터 유지를 위해 탈퇴를 요청하거나 프로젝트가 종료될 때까지 보관되며,
                파기 시 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법으로 안전하게 삭제합니다.</p>
        </div>
        <div className={styles.section}>
            <p className={styles.heading}>제 8 조 (개인정보 보호책임자 및 관련 문의)</p>
            <p className={styles.text}>개인정보와 관련된 문의, 불만 처리, 피해 구제 등에 관한 사항은 아래의 연락처로 문의해 주시기 바랍니다.</p>
            <ul className={styles.list}>
                <li className={styles.listItem}><strong>이메일:</strong> support@moneymate.com</li>
            </ul>
        </div>
    </div>
);