package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.financial.FinancialDiagnosisResponse;

public interface FinancialDiagnosisService {

    FinancialDiagnosisResponse diagnose(Long memberId);
}