package com.sandarun.Online.Food.ordering.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sandarun.Online.Food.ordering.model.IngredientsItems;

public interface IngredientItemsRepository extends JpaRepository<IngredientsItems,Long>{
    
    List<IngredientsItems> findByRestaurantId(Long id);
}
