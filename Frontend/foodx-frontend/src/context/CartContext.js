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
  // console.log('CartReducer - action:', action.type, 'payload:', action.payload);
  
  switch (action.type) {
    case 'SET_CART':
      const newState = {
        ...state,
        items: action.payload.item || [],
        total: action.payload.total || 0,
        loading: false,
      };
      // console.log('CartReducer SET_CART - new state:', newState);
      return newState;
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
  const { isAuthenticated, user, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);
  
  // Also try to fetch cart on initial load if already authenticated
  useEffect(() => {
    // console.log('CartProvider initial load useEffect');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user && isAuthenticated) {
      fetchCart();
    }
  }, []); // Empty dependency array for initial load only

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // console.log('Fetching cart data...');
      const response = await cartAPI.get();
      
      // Handle different possible response structures
      let cartData = response.data;
      
      // If response.data is the cart object directly
      if (cartData && typeof cartData === 'object') {
        // Check if it has items array
        if (Array.isArray(cartData.item)) {
          dispatch({ type: 'SET_CART', payload: cartData });
        }
        // Check if the response itself is an array (items directly)
        else if (Array.isArray(cartData)) {
          dispatch({ type: 'SET_CART', payload: { items: cartData, total: 0 } });
        }
        // Check if it has cartItems instead of items
        else if (Array.isArray(cartData.cartItems)) {
          dispatch({ type: 'SET_CART', payload: { items: cartData.cartItems, total: cartData.total || 0 } });
        }
        // Default case - assume empty cart
        else {
          // console.log('Unexpected cart data structure:11111111', cartData);
          dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } });
        }
      } else {
        // console.log('No cart data or invalid response');
        dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      console.error('Error details:', error.response);
      dispatch({ type: 'SET_LOADING', payload: false });
      // Set empty cart on error
      dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } });
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
      // toast.success('Cart cleared');
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
