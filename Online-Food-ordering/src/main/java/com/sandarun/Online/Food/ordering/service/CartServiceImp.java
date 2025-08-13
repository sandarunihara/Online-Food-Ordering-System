package com.sandarun.Online.Food.ordering.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sandarun.Online.Food.ordering.model.Cart;
import com.sandarun.Online.Food.ordering.model.CartItem;
import com.sandarun.Online.Food.ordering.model.Food;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.repository.CartItemRepository;
import com.sandarun.Online.Food.ordering.repository.CartRepository;
import com.sandarun.Online.Food.ordering.request.AddCardItemRequest;

@Service
public class CartServiceImp implements CartService{

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserService userService;

    @Autowired 
    private CartItemRepository cartItemRepository;

    @Autowired
    private FoodService foodService;

    @Override
    public CartItem addItemToCart(AddCardItemRequest req, String jwt) throws Exception {
    
        User user=userService.findUserByJwtToken(jwt);

        Food food=foodService.findFoodByID(req.getFoodId());

        Cart cart=cartRepository.findByCustomerId(user.getId());

        // Create a new cart if user doesn't have one
        if(cart == null) {
            cart = new Cart();
            cart.setCustomer(user);
            cart.setTotal(0L);
            cart = cartRepository.save(cart);
        }

        for(CartItem cartItem:cart.getItem()){
            if(cartItem.getFood().equals(food)){
                int newQuantity=cartItem.getQuantity()+req.getQuantity();
                return updateCartItemQuantity(cartItem.getId(),newQuantity);
            }
        }

        CartItem newCartItem=new CartItem();
        newCartItem.setFood(food);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(req.getQuantity());
        newCartItem.setIngredients(req.getIngredients());
        newCartItem.setTotalPrice(req.getQuantity()*food.getPrice());

        CartItem savedCartItem=cartItemRepository.save(newCartItem);
        cart.getItem().add(savedCartItem);

        Long total = cart.getTotal();
        long value = total.longValue(); // This line throws NullPointerException if total is null

        cart.setTotal(value+req.getQuantity());
        cartRepository.save(cart);

        return savedCartItem;
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {
        Optional<CartItem> cartItemOptional=cartItemRepository.findById(cartItemId);
        if(cartItemOptional.isEmpty()){
            throw new Exception("Cart item not found");
        }
        CartItem item=cartItemOptional.get();
        item.setQuantity(quantity);

        item.setTotalPrice(item.getFood().getPrice()*quantity);

        return cartItemRepository.save(item);

    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception {
    
        User user=userService.findUserByJwtToken(jwt);

        Cart cart=cartRepository.findByCustomerId(user.getId());
        
        // Handle case where cart doesn't exist
        if(cart == null) {
            throw new Exception("Cart not found for user");
        }
        
        Optional<CartItem> cartItemOptional=cartItemRepository.findById(cartItemId);
        if(cartItemOptional.isEmpty()){
            throw new Exception("Cart item not found");
        }
        
        CartItem item=cartItemOptional.get();

        cart.getItem().remove(item);

        return cartRepository.save(cart);
    }

    @Override
    public Long calculateCartTotals(Cart cart) throws Exception {
        Long total=0L;

        for(CartItem cartItem:cart.getItem()){
            total+=cartItem.getFood().getPrice()*cartItem.getQuantity();
        }
        return total;

    }

    @Override
    public Cart findCartById(Long id) throws Exception {
    
        Optional<Cart> optionalCart=cartRepository.findById(id);
        if(optionalCart.isEmpty()){
            throw new Exception("cart not found with id"+id);
        }
        return optionalCart.get();
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {
        
        Cart cart = cartRepository.findByCustomerId(userId);
        
        // Create a new empty cart if user doesn't have one
        if(cart == null) {
            cart = new Cart();
            cart.setTotal(0L);
            return cart; // Return a new empty cart (not saved to DB yet)
        }
        
        cart.setTotal(calculateCartTotals(cart));
        return cart;
    }

    @Override
    public Cart clearCart(Long userId) throws Exception {
        

        Cart cart=findCartByUserId(userId);

        cart.getItem().clear();
        return cartRepository.save(cart);
    }
    
}
