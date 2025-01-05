package com.sandarun.Online.Food.ordering.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sandarun.Online.Food.ordering.model.IngredientCategory;
import com.sandarun.Online.Food.ordering.model.IngredientsItems;
import com.sandarun.Online.Food.ordering.request.IngredientCategoryRequest;
import com.sandarun.Online.Food.ordering.request.IngredientRequest;
import com.sandarun.Online.Food.ordering.service.IngredientsService;

@RestController
@RequestMapping("/api/admin/ingredients")
public class IngredientController {
    
    @Autowired 
    private IngredientsService ingredientsService;

    @PostMapping("/category")
    public ResponseEntity<IngredientCategory> createIngredientCategory(@RequestBody IngredientCategoryRequest req)throws Exception{
        IngredientCategory item=ingredientsService.createiIngredientCategory(req.getName(), req.getRestaurantId());
        return new ResponseEntity<>(item,HttpStatus.CREATED);
    }

    @PostMapping()
    public ResponseEntity<IngredientsItems> createIngredientItem(@RequestBody IngredientRequest req)throws Exception{
        IngredientsItems item=ingredientsService.createIngredientsItems(req.getRestaurantId(), req.getName(),req.getCategoryId());
        return new ResponseEntity<>(item,HttpStatus.CREATED);
    }

    @PutMapping("/{id}/stoke")
    public ResponseEntity<IngredientsItems> UpdateIngredientStock(@PathVariable Long id)throws Exception{
        IngredientsItems item=ingredientsService.updateStock(id);
        return new ResponseEntity<>(item,HttpStatus.OK);
    }

    @GetMapping("restaurant/{id}")
    public ResponseEntity<List<IngredientsItems>> getRestaurantIngredient(@PathVariable Long id)throws Exception{
        List<IngredientsItems> items=ingredientsService.findRestaurantIngredients(id);
        return new ResponseEntity<>(items,HttpStatus.OK);
    }

    @GetMapping("restaurant/{id}/category")
    public ResponseEntity<List<IngredientCategory>> getRestaurantIngredientCategory(@PathVariable Long id)throws Exception{
        List<IngredientCategory> items=ingredientsService.findIngredientCategoriesByRestaurantId(id);
        return new ResponseEntity<>(items,HttpStatus.OK);
    }
}
