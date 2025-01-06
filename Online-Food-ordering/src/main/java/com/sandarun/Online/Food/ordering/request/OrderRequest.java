package com.sandarun.Online.Food.ordering.request;

import com.sandarun.Online.Food.ordering.model.Address;

import lombok.Data;

@Data
public class OrderRequest {
    private Long restaurantId;
    private Address deliveryAddress;
}
