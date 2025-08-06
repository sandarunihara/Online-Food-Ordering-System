# Sample Data Structure for Food Creation

## Updated Frontend to Backend Mapping

### 1. JSON Payload (without images)
```json
{
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza with fresh tomatoes, mozzarella cheese, fresh basil, and olive oil on a thin crust",
  "price": 1299,
  "vegetarian": true,
  "seasional": false,
  "restaurantId": 1,
  "category": {
    "id": 2,
    "name": "Pizza"
  },
  "ingredients": [
    {
      "name": "Pizza Dough",
      "inStoke": true
    },
    {
      "name": "Tomato Sauce",
      "inStoke": true
    },
    {
      "name": "Mozzarella Cheese",
      "inStoke": true
    }
  ],
  "images": []
}
```

### 2. FormData Structure (with images)
```javascript
const foodData = new FormData();

// Basic fields
foodData.append('name', 'Margherita Pizza');
foodData.append('description', 'Classic Italian pizza...');
foodData.append('price', '1299'); // Price in cents
foodData.append('vegetarian', 'true');
foodData.append('seasional', 'false'); // Note: backend typo
foodData.append('restaurantId', '1');

// Category as JSON string
foodData.append('category', JSON.stringify({
  id: 2,
  name: "Pizza"
}));

// Ingredients as JSON string
foodData.append('ingredients', JSON.stringify([
  {
    name: "Pizza Dough",
    inStoke: true
  }
]));

// Image files
foodData.append('images', imageFile1);
foodData.append('images', imageFile2);
```

### Key Changes Made:

1. **Price Conversion**: Frontend now converts price to cents (multiply by 100) to match backend `Long` type
2. **Category Structure**: Sends full Category object instead of just categoryId
3. **Backend Typo**: Uses "seasional" instead of "seasonal" to match backend
4. **Ingredients Structure**: Simplified to only include name field as per IngredientsItems model
5. **API Endpoint**: Fixed category API to use JWT token instead of restaurantId parameter

### Backend Model Compliance:

- ✅ `CreateFoodRequest.java` - All fields match
- ✅ `IngredientsItems.java` - Only using supported fields (id, name, category, restaurant, inStoke)
- ✅ `Category.java` - Full object structure (id, name, restaurant)
