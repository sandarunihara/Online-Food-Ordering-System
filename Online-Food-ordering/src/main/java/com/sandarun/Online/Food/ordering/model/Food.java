package com.sandarun.Online.Food.ordering.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private  Long id;

    private  String name;
    private  String description;
    private  Long price;

    @ManyToOne
    private  Category category;

    @Column(length = 1000)
    @ElementCollection
    private List<String> images;

    private  boolean available;

    @JsonIgnore
    @ManyToOne
    private  Restaurant restaurant;

    private Long res_id;

    private  boolean isVegetarian;
    private  boolean isSeasonal;

    @ManyToMany
    private  List<IngredientsItems> ingredients =new ArrayList<>();

    private LocalDateTime creationDate;
}
