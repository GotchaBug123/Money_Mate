package com.gotchabug.moneymate.home.dto;

import com.gotchabug.moneymate.auth.dto.AuthResponse;
import com.gotchabug.moneymate.financial.dto.FinancialProfileResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HomeResponse {

    private boolean loggedIn;
    private AuthResponse member;
    private FinancialProfileResponse financialProfile;
}
