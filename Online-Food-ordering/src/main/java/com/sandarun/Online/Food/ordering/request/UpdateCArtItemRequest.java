package com.sandarun.Online.Food.ordering.request;

import lombok.Data;

@Data
public class UpdateCArtItemRequest {
    
    private Long cartItemId;
    private int quantity;
}
