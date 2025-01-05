package com.sandarun.Online.Food.ordering.service;

import java.util.List;

import com.sandarun.Online.Food.ordering.model.IngredientCategory;
import com.sandarun.Online.Food.ordering.model.IngredientsItems;

public interface IngredientsService {
    public IngredientCategory createiIngredientCategory(String name,Long restaurantId)throws Exception;
    
    public IngredientCategory findIngredientCategoryById(Long id)throws Exception;

    public List<IngredientCategory> findIngredientCategoriesByRestaurantId(Long Id)throws Exception;

    public IngredientsItems createIngredientsItems(Long restaurantId,String ingredientName,Long categoryId)throws Exception;

    public List<IngredientsItems> findRestaurantIngredients(Long restaurantId);

    public IngredientsItems updateStock(Long Id)throws Exception;
}
