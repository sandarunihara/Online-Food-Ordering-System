package com.sandarun.Online.Food.ordering.service;

import java.util.List;

import com.sandarun.Online.Food.ordering.model.Order;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.request.OrderRequest;

public interface OrderService {
    public Order createOrder(OrderRequest order,User user)throws Exception;

    public Order updateOrder(Long orderId,String orderStatus)throws Exception;

    public void cancelOrder(Long orderId)throws Exception;

    public List<Order> getUsersOrder(Long userId)throws Exception;

    public List<Order> getRestaurantOrder(Long restaurantId,String orderSttatus)throws Exception;

    public Order findOrderById(Long orderId)throws Exception;
}
