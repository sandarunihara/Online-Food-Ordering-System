package com.sandarun.Online.Food.ordering.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sandarun.Online.Food.ordering.model.Cart;
import com.sandarun.Online.Food.ordering.model.CartItem;
import com.sandarun.Online.Food.ordering.request.AddCardItemRequest;
import com.sandarun.Online.Food.ordering.request.UpdateCArtItemRequest;
import com.sandarun.Online.Food.ordering.service.CartService;

@RestController
@RequestMapping("/api")
public class CartController {
    
    @Autowired
    private CartService cartService;

    @PutMapping("/cart/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestHeader ("Authorization") String jwt , @RequestBody AddCardItemRequest req)throws Exception{
        CartItem cartItem=cartService.addItemToCart(req, jwt);
        return new ResponseEntity<>(cartItem,HttpStatus.OK);
    }

    @PutMapping("/cart-item/update")
    public ResponseEntity<CartItem> updateCartItemQuantity(@RequestHeader ("Authorization") String jwt , @RequestBody UpdateCArtItemRequest req)throws Exception{
        CartItem cartItem=cartService.updateCartItemQuantity(req.getCartItemId(), req.getQuantity());
        return new ResponseEntity<>(cartItem,HttpStatus.OK);
    }

    @DeleteMapping("/cart-item/{id}/remove")
    public ResponseEntity<Cart> removeCartItem(@RequestHeader ("Authorization") String jwt , @PathVariable Long id)throws Exception{
        Cart cart=cartService.removeItemFromCart(id, jwt);
        return new ResponseEntity<>(cart,HttpStatus.OK);
    }

    @PutMapping("/cart/clear")
    public ResponseEntity<Cart> clearCart(@RequestHeader ("Authorization") String jwt )throws Exception{
        Cart cart=cartService.clearCart(jwt);
        return new ResponseEntity<>(cart,HttpStatus.OK);
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> findUserCart(@RequestHeader ("Authorization") String jwt )throws Exception{
        Cart cart=cartService.findCartByUserId(jwt);
        return new ResponseEntity<>(cart,HttpStatus.OK);
    }
}
