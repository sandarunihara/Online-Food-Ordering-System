package com.sandarun.Online.Food.ordering.service;

import java.util.List;

import com.sandarun.Online.Food.ordering.model.Category;

public interface CategoryService {
    public Category createCategory(String name,Long userId)throws Exception;

    public List<Category> findCategoryByRestaurantId(Long id)throws Exception;

    public Category findCategoryById(Long id)throws Exception;
}
