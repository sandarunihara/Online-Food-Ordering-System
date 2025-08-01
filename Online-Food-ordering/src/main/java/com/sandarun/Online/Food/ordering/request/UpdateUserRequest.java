package com.sandarun.Online.Food.ordering.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String fullName;
    private String email;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
