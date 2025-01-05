package com.sandarun.Online.Food.ordering.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sandarun.Online.Food.ordering.model.IngredientCategory;

public interface IngredientCategoryRepository extends JpaRepository<IngredientCategory,Long>{
    
    List<IngredientCategory> findByRestaurantId(Long id);
}
