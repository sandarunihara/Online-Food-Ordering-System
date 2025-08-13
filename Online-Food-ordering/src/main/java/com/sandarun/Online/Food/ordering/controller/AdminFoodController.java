package com.sandarun.Online.Food.ordering.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sandarun.Online.Food.ordering.model.Food;
import com.sandarun.Online.Food.ordering.model.Restaurant;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.request.CreateFoodRequest;
import com.sandarun.Online.Food.ordering.response.MessageResponse;
import com.sandarun.Online.Food.ordering.service.FoodService;
import com.sandarun.Online.Food.ordering.service.RestaurantService;
import com.sandarun.Online.Food.ordering.service.UserService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/admin/food")
public class AdminFoodController {
    
    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody CreateFoodRequest req,@RequestHeader("Authorization") String jwt)throws Exception{
        
        User user=userService.findUserByJwtToken(jwt);
        Restaurant restaurant=restaurantService.findRestaurantById(req.getRestaurantId());
        Food food=foodService.createFood(req, req.getCategory(), restaurant);

        return new ResponseEntity<>(food,HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFood(@PathVariable Long id,@RequestHeader("Authorization") String jwt)throws Exception{
        
        User user=userService.findUserByJwtToken(jwt);
        foodService.deleteFood(id);

        MessageResponse res=new MessageResponse();
        res.setMessage("Food deleted successfully");


        return new ResponseEntity<>(res,HttpStatus.OK);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody CreateFoodRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
        
        User user = userService.findUserByJwtToken(jwt);
        
        // Validate that the user owns the restaurant that contains this food
        Food existingFood = foodService.findFoodByID(id);
        if (!existingFood.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new Exception("You are not authorized to update this food item");
        }
        
        Food updatedFood = foodService.updateFood(id, req, req.getCategory());
        
        return new ResponseEntity<>(updatedFood, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFoodAvalibilityStatus(@PathVariable Long id,@RequestHeader("Authorization") String jwt)throws Exception{
        
        User user=userService.findUserByJwtToken(jwt);

        Food food=foodService.updateAvailibilityStatus(id);

        return new ResponseEntity<>(food,HttpStatus.OK);
    }
}
