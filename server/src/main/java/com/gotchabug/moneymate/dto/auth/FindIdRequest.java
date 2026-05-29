package com.gotchabug.moneymate.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindIdRequest {
    private String name;
    private String email;
}