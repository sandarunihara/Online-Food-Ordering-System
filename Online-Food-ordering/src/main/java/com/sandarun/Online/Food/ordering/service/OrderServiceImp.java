package com.sandarun.Online.Food.ordering.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sandarun.Online.Food.ordering.model.Address;
import com.sandarun.Online.Food.ordering.model.Cart;
import com.sandarun.Online.Food.ordering.model.CartItem;
import com.sandarun.Online.Food.ordering.model.Order;
import com.sandarun.Online.Food.ordering.model.OrderItem;
import com.sandarun.Online.Food.ordering.model.Restaurant;
import com.sandarun.Online.Food.ordering.model.User;
import com.sandarun.Online.Food.ordering.repository.AddressRepository;
import com.sandarun.Online.Food.ordering.repository.OrderItemRepository;
import com.sandarun.Online.Food.ordering.repository.OrderRepository;
import com.sandarun.Online.Food.ordering.repository.UserRepository;
import com.sandarun.Online.Food.ordering.request.OrderRequest;

@Service
public class OrderServiceImp implements OrderService{

    @Autowired 
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CartService cartService;

    @Override
    public Order createOrder(OrderRequest order, User user)throws Exception{
    
        Address shipAddress=order.getDeliveryAddress();

        Address savedAdress=addressRepository.save(shipAddress);

        if(!user.getAddress().contains(savedAdress)){
            user.getAddress().add(savedAdress);
            userRepository.save(user);
        }

        Restaurant restaurant=restaurantService.findRestaurantById(order.getRestaurantId());

        Order createOrder=new Order();
        createOrder.setCustomer(user);
        createOrder.setCreatedAt(new Date());
        createOrder.setOrderStatus("Pending");
        createOrder.setDeliveruAddress(savedAdress);
        createOrder.setRestaurant(restaurant);

        Cart cart=cartService.findCartByUserId(user.getId());

        List<OrderItem> orderItems=new ArrayList<>();

        for(CartItem cartItem : cart.getItem()){
            OrderItem orderItem=new OrderItem();
            orderItem.setFood(cartItem.getFood());
            orderItem.setIngredients(cartItem.getIngredients());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            OrderItem savedOrderItem=orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);
        }
        Long totalPrice=cartService.calculateCartTotals(cart);

        createOrder.setItems(orderItems);
        createOrder.setTotalPrice(totalPrice);

        Order savedOrder=orderRepository.save(createOrder);
        restaurant.getOrders().add(savedOrder);
        
        return createOrder;
    }

    @Override
    public Order updateOrder(Long orderId, String orderStatus) throws Exception {
    
        Order order=findOrderById(orderId);
        if(orderStatus.equals("OUT_FOR_DELIVERY")||orderStatus.equals("DELIVERED")||orderStatus.equals("COMPLETED")||orderStatus.equals("PENDING")){
            order.setOrderStatus(orderStatus);
            return orderRepository.save(order);
        }
        throw new Exception("Plesse select a valid order status");
    }

    @Override
    public void cancelOrder(Long orderId) throws Exception {
    
        Order order=findOrderById(orderId);
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<Order> getUsersOrder(Long userId) throws Exception {
    
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantOrder(Long restaurantId, String orderStatus) throws Exception {
    
        List<Order> orders=orderRepository.findByRestaurantId(restaurantId);
        if(orderStatus!=null){
            orders=orders.stream().filter(order->order.getOrderStatus().equals(orderStatus)).collect(Collectors.toList());
        }
        return orders;
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
    
        Optional<Order> optionalOrder=orderRepository.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new Exception("order not found");
        }
        return optionalOrder.get();
    }
    
}
