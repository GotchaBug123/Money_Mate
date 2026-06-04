package com.gotchabug.moneymate.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMemberUpdateRequest {

    private String name;
    private String email;
    private String role;
    private String signupStatus;
}