package com.gotchabug.moneymate.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindIdRequest {
    private String name;
    private String email;
}