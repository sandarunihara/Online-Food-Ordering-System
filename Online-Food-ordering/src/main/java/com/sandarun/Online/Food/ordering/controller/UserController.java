package com.sandarun.Online.Food.ordering.controller;

import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.request.UpdateUserRequest;
import com.sandarun.Online.Food.ordering.response.MessageResponse;
import com.sandarun.Online.Food.ordering.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader("Authorization") String jwt) throws Exception {
//        System.out.println("\nsadasd\n");
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@RequestBody UpdateUserRequest request, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        User updatedUser = userService.updateUser(user.getId(), request);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PostMapping("/address")
    public ResponseEntity<User> addAddress(@RequestBody UpdateUserRequest request, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        User updatedUser=userService.updateUser(user.getId(), request);
        
        MessageResponse response = new MessageResponse();
        response.setMessage("Address added successfully");
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
}
