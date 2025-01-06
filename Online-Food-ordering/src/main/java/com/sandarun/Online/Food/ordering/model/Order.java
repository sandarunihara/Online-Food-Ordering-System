package com.sandarun.Online.Food.ordering.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sandarun.Online.Food.ordering.dto.RestaurantDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "`order`")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private  User customer;

    @JsonIgnore
    @ManyToOne
    private Restaurant restaurant;

    private Long totalAmount;
    private String orderStatus;
    private Date createdAt;

    @ManyToOne
    private Address deliveruAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

//    private Payment payment;

    private  int totalItem;
    private  Long totalPrice;
}
