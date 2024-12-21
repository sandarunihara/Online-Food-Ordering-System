package com.sandarun.Online.Food.ordering.repository;

import com.sandarun.Online.Food.ordering.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
