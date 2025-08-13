package com.sandarun.Online.Food.ordering.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sandarun.Online.Food.ordering.model.Category;
import com.sandarun.Online.Food.ordering.model.Food;
import com.sandarun.Online.Food.ordering.model.Restaurant;
import com.sandarun.Online.Food.ordering.model.IngredientsItems;
import com.sandarun.Online.Food.ordering.repository.FoodRepository;
import com.sandarun.Online.Food.ordering.repository.IngredientItemsRepository;
import com.sandarun.Online.Food.ordering.request.CreateFoodRequest;

@Service
public class FoodServiceImp implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private IngredientItemsRepository ingredientItemsRepository;

    @Override
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) {

        Food food = new Food();
        food.setCategory(category);
        food.setRestaurant(restaurant);
        food.setDescription(req.getDescription());
        food.setImages(req.getImages());
        food.setName(req.getName());
        food.setPrice(req.getPrice());
        food.setSeasonal(req.isSeasional());
        food.setVegetarian(req.isVegetarian());
        food.setCreationDate(LocalDateTime.now());
        food.setRes_id(restaurant.getId());

        // Handle ingredients - save them first if they don't exist
        List<IngredientsItems> savedIngredients = new ArrayList<>();
        if (req.getIngredients() != null) {
            for (IngredientsItems ingredient : req.getIngredients()) {
                // Set the restaurant reference for new ingredients
                ingredient.setRestaurant(restaurant);
                
                // Check if ingredient already exists by name and restaurant
                List<IngredientsItems> existingIngredients = ingredientItemsRepository.findByRestaurantId(restaurant.getId());
                IngredientsItems existingIngredient = existingIngredients.stream()
                    .filter(ing -> ing.getName().equalsIgnoreCase(ingredient.getName()))
                    .findFirst()
                    .orElse(null);
                
                if (existingIngredient != null) {
                    // Use existing ingredient
                    savedIngredients.add(existingIngredient);
                } else {
                    // Save new ingredient
                    IngredientsItems savedIngredient = ingredientItemsRepository.save(ingredient);
                    savedIngredients.add(savedIngredient);
                }
            }
        }
        
        food.setIngredients(savedIngredients);

        Food savedFood = foodRepository.save(food);
        restaurant.getFoods().add(savedFood);
        return savedFood;
    }

    @Override
    public void deleteFood(Long foodId) throws Exception {

        Food food = findFoodByID(foodId);
        food.setRestaurant(null);
        foodRepository.save(food);

    }

    @Override
    public List<Food> getRestaurantsFood(Long restaurantId) {

        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

//        if (isVegitarian) {
//            foods = filterByVegitarian(foods, isVegitarian);
//        }
//        if (isNonveg) {
//            foods = filterByNonveg(foods, isNonveg);
//        }
//        if (isSeasonal) {
//            foods = filterBySeasonal(foods, isSeasonal);
//        }
//        if (foodCategory != null && !foodCategory.equals("")) {
//            foods = filterByCategory(foods, foodCategory);
//        }

        return foods;
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
        return foods.stream().filter(food->{
            if(food.getCategory()!=null){
                return food.getCategory().getName().equals(foodCategory);
            }
            return false;
        }).collect(Collectors.toList());
    }

    private List<Food> filterBySeasonal(List<Food> foods, boolean isSeasonal) {
        return foods.stream().filter(food->food.isSeasonal()==isSeasonal).collect(Collectors.toList());
    }

    private List<Food> filterByNonveg(List<Food> foods, boolean isNonveg) {
        return foods.stream().filter(food->food.isVegetarian()==false).collect(Collectors.toList());
    }

    private List<Food> filterByVegitarian(List<Food> foods, boolean isVegitarian) {
        return foods.stream().filter(food->food.isVegetarian()==isVegitarian).collect(Collectors.toList());
    }

    @Override
    public List<Food> searchFood(String keyword) {
        return foodRepository.searchFood(keyword);
    }

    @Override
    public Food findFoodByID(Long foodId) throws Exception {
        Optional<Food> optionalFood=foodRepository.findById(foodId);

        if(optionalFood.isEmpty()){
            throw new Exception("Food not exist...");
        }
        return optionalFood.get();
    }

    @Override
    public Food updateAvailibilityStatus(Long foodId) throws Exception {
        Food food=findFoodByID(foodId);
        food.setAvailable(!food.isAvailable());
        return foodRepository.save(food);
    }

    @Override
    public Food updateFood(Long foodId, CreateFoodRequest req, Category category) throws Exception {
        Food food = findFoodByID(foodId);
        
        // Update basic food information
        if (req.getName() != null && !req.getName().trim().isEmpty()) {
            food.setName(req.getName());
        }
        if (req.getDescription() != null && !req.getDescription().trim().isEmpty()) {
            food.setDescription(req.getDescription());
        }
        if (req.getPrice() != null) {
            food.setPrice(req.getPrice());
        }
        if (category != null) {
            food.setCategory(category);
        }
        if (req.getImages() != null) {
            food.setImages(req.getImages());
        }
        
        // Update boolean fields
        food.setVegetarian(req.isVegetarian());
        food.setSeasonal(req.isSeasional());
        
        // Handle ingredients update - similar to create logic
        if (req.getIngredients() != null) {
            List<IngredientsItems> savedIngredients = new ArrayList<>();
            for (IngredientsItems ingredient : req.getIngredients()) {
                // Set the restaurant reference for new ingredients
                ingredient.setRestaurant(food.getRestaurant());
                
                // Check if ingredient already exists by name and restaurant
                List<IngredientsItems> existingIngredients = ingredientItemsRepository.findByRestaurantId(food.getRestaurant().getId());
                IngredientsItems existingIngredient = existingIngredients.stream()
                    .filter(ing -> ing.getName().equalsIgnoreCase(ingredient.getName()))
                    .findFirst()
                    .orElse(null);
                
                if (existingIngredient != null) {
                    // Use existing ingredient
                    savedIngredients.add(existingIngredient);
                } else {
                    // Save new ingredient
                    IngredientsItems savedIngredient = ingredientItemsRepository.save(ingredient);
                    savedIngredients.add(savedIngredient);
                }
            }
            food.setIngredients(savedIngredients);
        }
        
        return foodRepository.save(food);
    }

}
