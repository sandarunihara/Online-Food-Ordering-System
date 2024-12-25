package com.sandarun.Online.Food.ordering.controller;

import com.sandarun.Online.Food.ordering.dto.RestaurantDto;
import com.sandarun.Online.Food.ordering.model.Restaurant;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.service.RestaurantService;
import com.sandarun.Online.Food.ordering.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantCotroller {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;


    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurant(@RequestHeader("Authorization") String jwt, @RequestParam String keyword)throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        List<Restaurant> restaurants=restaurantService.searchRestaurant(keyword);
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Restaurant>> getAllRestaurant(@RequestHeader("Authorization") String jwt)throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        List<Restaurant> restaurants=restaurantService.getAllRestaurant();
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> findRestaurantById(@RequestHeader("Authorization") String jwt,@PathVariable Long id)throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurants=restaurantService.findRestaurantById(id);
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }

    @PutMapping("/{id}/add-favorites")
    public ResponseEntity<RestaurantDto> addToFavorites(@RequestHeader("Authorization") String jwt, @PathVariable Long id)throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        RestaurantDto restaurants=restaurantService.addToFavorites(id,user);
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }
}
