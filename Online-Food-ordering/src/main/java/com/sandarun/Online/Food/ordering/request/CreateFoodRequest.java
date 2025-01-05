package com.sandarun.Online.Food.ordering.request;

import java.util.List;

import com.sandarun.Online.Food.ordering.model.Category;
import com.sandarun.Online.Food.ordering.model.IngredientsItems;

import lombok.Data;

@Data
public class CreateFoodRequest {
    
    private String name;
    private String description;
    private Long price;

    private Category category;
    private List<String> images;

    private Long restaurantId;
    private boolean vegetarian;
    private boolean seasional;
    private List<IngredientsItems> ingredients;
}
