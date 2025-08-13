# Food Update API Documentation

## Backend Implementation

### Service Layer
- **Interface**: `FoodService.updateFood(Long foodId, CreateFoodRequest req, Category category)`
- **Implementation**: `FoodServiceImp.updateFood()` - Updates food details while preserving existing data and properly handling ingredient relationships

### Controller Layer
- **Endpoint**: `PUT /api/admin/food/{id}/update`
- **Authentication**: Requires JWT token in Authorization header
- **Authorization**: Only restaurant owners can update their own food items
- **Request Body**: Same as `CreateFoodRequest` format

### Security Features
- Validates that the user owns the restaurant that contains the food item
- Prevents unauthorized updates to other restaurants' food items

## Frontend Implementation

### API Service
```javascript
foodAPI.update(id, foodData) // PUT /api/admin/food/{id}/update
foodAPI.getById(id) // GET /api/food/{id}
```

### Component
- **EditFood.js** - Pre-existing component that fetches food data and allows editing
- Uses `useParams()` to get food ID from URL
- Pre-populates form with existing food data
- Handles price conversion between cents and dollars

## Sample Update Request

### JSON Structure
```json
{
  "name": "Updated Pizza Name",
  "description": "Updated pizza description with new toppings",
  "price": 1499,
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
      "name": "Updated Tomato Sauce",
      "inStoke": true
    },
    {
      "name": "Extra Cheese",
      "inStoke": true
    }
  ],
  "images": []
}
```

### Key Features
1. **Partial Updates**: Only non-null/non-empty fields are updated
2. **Ingredient Management**: New ingredients are created, existing ones are reused
3. **Price Conversion**: Frontend converts dollars to cents automatically
4. **Category Validation**: Ensures selected category exists
5. **Authorization**: Restaurant owners can only update their own food items

## Usage Example

### From Admin Dashboard
1. Navigate to food management page
2. Click "Edit" button on any food item
3. Update form fields as needed
4. Submit to save changes

### URL Pattern
```
/edit-food/{foodId}
```

The EditFood component will:
1. Fetch existing food data using `foodAPI.getById(id)`
2. Pre-populate the form with current values
3. Allow editing all fields
4. Submit updates using `foodAPI.update(id, updatedData)`
