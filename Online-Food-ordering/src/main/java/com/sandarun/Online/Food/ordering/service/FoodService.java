package com.sandarun.Online.Food.ordering.service;

import java.util.List;

import com.sandarun.Online.Food.ordering.model.Category;
import com.sandarun.Online.Food.ordering.model.Food;
import com.sandarun.Online.Food.ordering.model.Restaurant;
import com.sandarun.Online.Food.ordering.request.CreateFoodRequest;

public interface FoodService {
    
    public Food createFood(CreateFoodRequest req,Category category,Restaurant restaurant);

    void deleteFood(Long foodId) throws Exception;

    public List<Food> getRestaurantsFood(Long restaurantId);

    public List<Food> searchFood(String keyword);

    public Food findFoodByID(Long foodId)throws Exception;

    public Food updateAvailibilityStatus(Long foodId)throws Exception;

    public Food updateFood(Long foodId, CreateFoodRequest req, Category category) throws Exception;

}
