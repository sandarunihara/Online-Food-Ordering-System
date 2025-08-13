package com.sandarun.Online.Food.ordering.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sandarun.Online.Food.ordering.model.CartItem;
import com.sandarun.Online.Food.ordering.model.Order;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.request.AddCardItemRequest;
import com.sandarun.Online.Food.ordering.request.OrderRequest;
import com.sandarun.Online.Food.ordering.service.OrderService;
import com.sandarun.Online.Food.ordering.service.UserService;

@RestController
@RequestMapping("/api")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestHeader ("Authorization") String jwt , @RequestBody OrderRequest req)throws Exception{
        
        User user=userService.findUserByJwtToken(jwt);
        System.out.println("\n"+req+"\n");
        Order order=orderService.createOrder(req, user);
        return new ResponseEntity<>(order,HttpStatus.OK);
    }

    @GetMapping("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(@RequestHeader ("Authorization") String jwt)throws Exception{
        
        User user=userService.findUserByJwtToken(jwt);
        List<Order> orders=orderService.getUsersOrder(user.getId());
        return new ResponseEntity<>(orders,HttpStatus.OK);
    }
}
