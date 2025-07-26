import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(item.id);
    } else {
      await updateCartItem({
        cartItemId: item.id,
        quantity: newQuantity
      });
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src={item.food.images?.[0] || '/api/placeholder/80/80'}
              alt={item.food.name}
              style={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                borderRadius: 8,
                marginRight: 16
              }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                {item.food.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.food.description}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                ${item.food.price} each
              </Typography>
              
              {item.ingredients && item.ingredients.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Ingredients: {item.ingredients.join(', ')}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity - 1)}
              >
                <Remove />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ mx: 2, minWidth: 40, textAlign: 'center' }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                <Add />
              </IconButton>
            </Box>
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              ${item.totalPrice.toFixed(2)}
            </Typography>
            
            <Button
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;
