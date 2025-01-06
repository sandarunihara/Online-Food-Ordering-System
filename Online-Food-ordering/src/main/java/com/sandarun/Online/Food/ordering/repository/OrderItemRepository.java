package com.sandarun.Online.Food.ordering.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sandarun.Online.Food.ordering.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long>{
    
}
