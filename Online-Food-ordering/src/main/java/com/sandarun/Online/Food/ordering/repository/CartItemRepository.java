package com.sandarun.Online.Food.ordering.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sandarun.Online.Food.ordering.model.CartItem;

public interface CartItemRepository  extends JpaRepository<CartItem,Long>{
    
}
