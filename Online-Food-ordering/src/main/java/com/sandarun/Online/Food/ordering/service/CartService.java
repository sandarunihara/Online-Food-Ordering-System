package com.sandarun.Online.Food.ordering.service;

import com.sandarun.Online.Food.ordering.model.Cart;
import com.sandarun.Online.Food.ordering.model.CartItem;
import com.sandarun.Online.Food.ordering.request.AddCardItemRequest;

public interface CartService {

    public CartItem addItemToCart(AddCardItemRequest req,String jwt)throws Exception;

    public CartItem updateCartItemQuantity(Long cartItemId,int quantity)throws Exception;

    public Cart removeItemFromCart(Long cartItemId,String jwt)throws Exception;

    public Long calculateCartTotals(Cart cart)throws Exception;

    public Cart findCartById(Long id)throws Exception;

    public Cart findCartByUserId(String jwt)throws Exception;

    public Cart clearCart(String jwt)throws Exception;
}
