package com.sandarun.Online.Food.ordering.response;

import com.sandarun.Online.Food.ordering.model.USER_ROLE;

import lombok.Data;

@Data
public class AuthResponse {

    private  String jwt;
    private  String message;
    private USER_ROLE role;
}
