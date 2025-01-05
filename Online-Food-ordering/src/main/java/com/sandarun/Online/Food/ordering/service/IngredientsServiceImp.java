package com.sandarun.Online.Food.ordering.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sandarun.Online.Food.ordering.model.IngredientCategory;
import com.sandarun.Online.Food.ordering.model.IngredientsItems;
import com.sandarun.Online.Food.ordering.model.Restaurant;
import com.sandarun.Online.Food.ordering.repository.IngredientCategoryRepository;
import com.sandarun.Online.Food.ordering.repository.IngredientItemsRepository;

@Service
public class IngredientsServiceImp implements IngredientsService{

    @Autowired
    private IngredientItemsRepository ingredientItemsRepository;

    @Autowired
    private IngredientCategoryRepository ingredientCategoryRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Override
    public IngredientCategory createiIngredientCategory(String name, Long restaurantId) throws Exception {
    
        Restaurant restaurant=restaurantService.findRestaurantById(restaurantId);

        IngredientCategory category=new IngredientCategory();
        category.setRestaurant(restaurant);
        category.setName(name);

        return ingredientCategoryRepository.save(category);
    }

    @Override
    public IngredientCategory findIngredientCategoryById(Long id) throws Exception {
    
        Optional<IngredientCategory> opt=ingredientCategoryRepository.findById(id);

        if(opt.isEmpty()){
            throw new Exception("Ingredient category not found");
        }
        return opt.get();

    }

    @Override
    public List<IngredientCategory> findIngredientCategoriesByRestaurantId(Long Id) throws Exception {
        
        restaurantService.findRestaurantById(Id);
        return ingredientCategoryRepository.findByRestaurantId(Id);
    }

    @Override
    public IngredientsItems createIngredientsItems(Long restaurantId, String ingredientName, Long categoryId)throws Exception {
    
        Restaurant restaurant=restaurantService.findRestaurantById(restaurantId);
        IngredientCategory category=findIngredientCategoryById(categoryId);

        IngredientsItems item=new IngredientsItems();
        item.setName(ingredientName);
        item.setRestaurant(restaurant);
        item.setCategory(category);

        IngredientsItems ingredient=ingredientItemsRepository.save(item);
        category.getIngredients().add(ingredient);

        return ingredient;
    }

    @Override
    public List<IngredientsItems> findRestaurantIngredients(Long restaurantId) {
    
        return ingredientItemsRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public IngredientsItems updateStock(Long Id) throws Exception {
    
        Optional<IngredientsItems> optionalIngredientsItem=ingredientItemsRepository.findById(Id);
        if(optionalIngredientsItem.isEmpty()){
            throw new Exception("Ingredian Not Found");
        }
        IngredientsItems ingredientsItems=optionalIngredientsItem.get();
        ingredientsItems.setInStoke(!ingredientsItems.isInStoke());
        return ingredientItemsRepository.save(ingredientsItems);
    }
    
}
