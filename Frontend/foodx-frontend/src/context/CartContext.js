import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  loading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        loading: false,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (foodId, quantity = 1, ingredients = []) => {
    try {
      const response = await cartAPI.addItem({
        foodId,
        quantity,
        ingredients,
      });
      dispatch({ type: 'SET_CART', payload: response.data });
      toast.success('Item added to cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await cartAPI.updateItem({
        cartItemId,
        quantity,
      });
      dispatch({ type: 'SET_CART', payload: response.data });
      toast.success('Cart updated');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      await fetchCart(); // Refresh cart
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return { success: false, message };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getItemCount,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
