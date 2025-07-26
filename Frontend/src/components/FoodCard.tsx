import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  LocalFlorist,
  Schedule
} from '@mui/icons-material';
import { Food, AddCartItemRequest } from '../types';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleAddToCart = async () => {
    try {
      const cartItem: AddCartItemRequest = {
        foodId: food.id,
        quantity,
        ingredients: selectedIngredients
      };
      
      await addToCart(cartItem);
      setOpen(false);
      setQuantity(1);
      setSelectedIngredients([]);
      setSpecialInstructions('');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleIngredientChange = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <>
      <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={food.images?.[0] || '/api/placeholder/400/300'}
          alt={food.name}
        />
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography gutterBottom variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {food.name}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${food.price}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {food.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {food.vegetarian && (
              <Chip
                icon={<LocalFlorist />}
                label="Vegetarian"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            {food.seasonal && (
              <Chip
                icon={<Schedule />}
                label="Seasonal"
                size="small"
                color="info"
                variant="outlined"
              />
            )}
            <Chip
              label={food.category?.name || 'General'}
              size="small"
              variant="outlined"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            fullWidth
            onClick={() => setOpen(true)}
            disabled={!food.available}
            sx={{ mt: 'auto' }}
          >
            {food.available ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add to Cart - {food.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <IconButton onClick={decrementQuantity}>
              <Remove />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2, minWidth: 40, textAlign: 'center' }}>
              {quantity}
            </Typography>
            <IconButton onClick={incrementQuantity}>
              <Add />
            </IconButton>
          </Box>

          {food.ingredients && food.ingredients.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Customize Ingredients:
              </Typography>
              {food.ingredients.map((ingredient) => (
                <FormControlLabel
                  key={ingredient.id}
                  control={
                    <Checkbox
                      checked={selectedIngredients.includes(ingredient.name)}
                      onChange={() => handleIngredientChange(ingredient.name)}
                    />
                  }
                  label={ingredient.name}
                />
              ))}
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special requests or modifications..."
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6">
              Total: ${(food.price * quantity).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddToCart} variant="contained">
            Add to Cart (${(food.price * quantity).toFixed(2)})
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FoodCard;
