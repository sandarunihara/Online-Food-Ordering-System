package com.sandarun.Online.Food.ordering.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private  Long id;

    @ManyToOne
    private  Food food;

    private int quantity;
    private Long totalPrice;

    @ElementCollection
    private  List<String> ingredients;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "order_id", nullable = false) // Explicit join
    private Order order; 

}
