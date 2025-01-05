package com.sandarun.Online.Food.ordering.request;

import java.util.List;

import lombok.Data;

@Data
public class AddCardItemRequest {
    
    private Long foodId;
    private int quantity;
    private List<String> ingredients;
}
