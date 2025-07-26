import api from './api';
import {
  Restaurant,
  Food,
  Cart,
  CartItem,
  Order,
  AddCartItemRequest,
  UpdateCartItemRequest,
  OrderRequest,
  Category
} from '../types';

// Restaurant Service
export const restaurantService = {
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    const response = await api.get('/api/restaurants');
    return response.data;
  },

  getRestaurantById: async (id: number): Promise<Restaurant> => {
    const response = await api.get(`/api/restaurants/${id}`);
    return response.data;
  },

  searchRestaurants: async (keyword: string): Promise<Restaurant[]> => {
    const response = await api.get(`/api/restaurants/search?keyword=${keyword}`);
    return response.data;
  },

  addToFavorites: async (restaurantId: number): Promise<any> => {
    const response = await api.put(`/api/restaurants/${restaurantId}/add-favorites`);
    return response.data;
  }
};

// Food Service
export const foodService = {
  searchFood: async (name: string): Promise<Food[]> => {
    const response = await api.get(`/api/food/search?name=${name}`);
    return response.data;
  },

  getRestaurantFood: async (
    restaurantId: number,
    vegetarian: boolean = false,
    nonveg: boolean = false,
    seasonal: boolean = false,
    category?: string
  ): Promise<Food[]> => {
    const params = new URLSearchParams({
      vegetarian: vegetarian.toString(),
      nonveg: nonveg.toString(),
      seasional: seasonal.toString()
    });

    if (category) {
      params.append('food_category', category);
    }

    const response = await api.get(`/api/food/restaurant/${restaurantId}?${params}`);
    return response.data;
  }
};

// Cart Service
export const cartService = {
  addItemToCart: async (request: AddCartItemRequest): Promise<CartItem> => {
    const response = await api.put('/api/cart/add', request);
    return response.data;
  },

  getCart: async (): Promise<Cart> => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  updateCartItemQuantity: async (request: UpdateCartItemRequest): Promise<CartItem> => {
    const response = await api.put('/api/cart-item/update', request);
    return response.data;
  },

  removeCartItem: async (cartItemId: number): Promise<Cart> => {
    const response = await api.delete(`/api/cart-item/${cartItemId}/remove`);
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.put('/api/cart/clear');
    return response.data;
  }
};

// Order Service
export const orderService = {
  createOrder: async (orderRequest: OrderRequest): Promise<Order> => {
    const response = await api.post('/api/order', orderRequest);
    return response.data;
  },

  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get('/api/order/user');
    return response.data;
  }
};

// Category Service
export const categoryService = {
  getRestaurantCategories: async (restaurantId: number): Promise<Category[]> => {
    const response = await api.get(`/api/category/restaurant/${restaurantId}`);
    return response.data;
  }
};
