import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { ShoppingCart, Payment } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

const CartPage: React.FC = () => {
  const { cart, loading, getCartTotal, getCartItemCount, clearCart } = useCart();
  const [clearing, setClearing] = useState(false);
  const navigate = useNavigate();

  const handleClearCart = async () => {
    try {
      setClearing(true);
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleCheckout = () => {
    if (cart && cart.items.length > 0) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Your Cart
      </Typography>

      {!cart || cart.items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some delicious food items to get started
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/restaurants')}
            size="large"
          >
            Browse Restaurants
          </Button>
        </Paper>
      ) : (
        <Box>
          {/* Cart Items */}
          <Box sx={{ mb: 4 }}>
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </Box>

          {/* Cart Summary */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">
                Items ({getCartItemCount()})
              </Typography>
              <Typography variant="body1">
                ${getCartTotal().toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">
                Delivery Fee
              </Typography>
              <Typography variant="body1">
                $2.99
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">
                Tax
              </Typography>
              <Typography variant="body1">
                ${(getCartTotal() * 0.08).toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ${(getCartTotal() + 2.99 + getCartTotal() * 0.08).toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClearCart}
                disabled={clearing}
                sx={{ flex: 1 }}
              >
                {clearing ? 'Clearing...' : 'Clear Cart'}
              </Button>
              <Button
                variant="contained"
                onClick={handleCheckout}
                startIcon={<Payment />}
                sx={{ flex: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Paper>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Free delivery on orders over $25. Your order qualifies for free delivery!
            </Typography>
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
