import {submitRiskSurveyApi, saveRiskProfileApi} from '../api/riskSurveyApi.js';

const STORAGE_KEY = 'pendingInvestmentSurvey';

const toVal = (idx) => (idx != null ? idx + 1 : undefined);

/** 비로그인 진단 답변을 sessionStorage에 저장 */
export const savePendingSurvey = (rawAnswers, selectedThemes) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({rawAnswers, selectedThemes}));
};

/**
 * 저장된 답변을 백엔드에 제출하고 결과를 반환.
 * 로그인 직후 어디서든 호출 가능. 데이터가 없으면 null 반환.
 */
export const submitPendingSurvey = async () => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const {rawAnswers: ra, selectedThemes} = JSON.parse(raw);
    const result = await submitRiskSurveyApi({
        ageGroup:            toVal(ra[0]),
        incomeRange:         toVal(ra[1]),
        investmentPurpose:   toVal(ra[2]),
        investmentHorizon:   toVal(ra[3]),
        experienceLevel:     toVal(ra[4]),
        lossTolerance:       toVal(ra[5]),
        preferredThemes:     selectedThemes,
    });
    saveRiskProfileApi(result.totalScore).catch(console.warn);
    sessionStorage.removeItem(STORAGE_KEY);
    return result;
};
