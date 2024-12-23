package com.sandarun.Online.Food.ordering.controller;

import com.sandarun.Online.Food.ordering.model.Restaurant;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.request.CreateRestaurantRequest;
import com.sandarun.Online.Food.ordering.response.MessageResponse;
import com.sandarun.Online.Food.ordering.service.RestaurantService;
import com.sandarun.Online.Food.ordering.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminRestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @PostMapping()
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody CreateRestaurantRequest req , @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurant =restaurantService.createRestaurant(req,user);
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@RequestBody CreateRestaurantRequest req , @RequestHeader("Authorization") String jwt , @PathVariable Long id) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurant=restaurantService.updateRestaurant(id,req);
        return  new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRestaurant(@PathVariable Long id) throws Exception {

        restaurantService.deleteRestaurant(id);

        MessageResponse response=new MessageResponse();
        response.setMessage("Restaurant deleted successfully");

        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus( @RequestHeader("Authorization") String jwt , @PathVariable Long id) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurant=restaurantService.updateRestaurantStatus(id);
        return  new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<Restaurant> findRestaurantByUserId( @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurant=restaurantService.findRestaurantByUserId(user.getId());
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

}
