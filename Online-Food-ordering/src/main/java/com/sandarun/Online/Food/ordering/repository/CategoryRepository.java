package com.sandarun.Online.Food.ordering.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sandarun.Online.Food.ordering.model.Category;

public interface CategoryRepository extends JpaRepository<Category,Long>{
    
    public List<Category> findByRestaurantId(Long id);
}
