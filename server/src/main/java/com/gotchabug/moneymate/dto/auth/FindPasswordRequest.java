package com.gotchabug.moneymate.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPasswordRequest {
    private String loginId;
    private String email;
    private String newPassword;
}