import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5454';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    // Handle other errors
    if (error.response?.status === 500) {
      console.error('Internal Server Error');
      toast.error('An unexpected error occurred. Please try again later.');
    }else if (error.response?.status === 404) {
      console.error('Resource Not Found');
      toast.error('The requested resource was not found.');
    }else if (error.response?.status === 403) {
      console.error('Access Denied');
      toast.error('You do not have permission to access this resource.');
    }else if (error.response?.status === 400) {
      console.error('Bad Request');
      toast.error('Bad request. Please check your input.');
    }else {
      console.error('API Error:', error);
      toast.error('An error occurred while processing your request.');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/api/users/profile'),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// Restaurant Services
export const restaurantAPI = {
  getAll: () => api.get('/api/restaurants'),
  getById: (id) => api.get(`/api/restaurants/${id}`),
  search: (keyword) => api.get(`/api/restaurants/search?keyword=${keyword}`),
  getByCategory: (category) => api.get(`/api/restaurants/category/${category}`),
  create: (restaurantData) => api.post('/api/admin/restaurants', restaurantData),
  update: (id, restaurantData) => api.put(`/api/admin/restaurants/${id}`, restaurantData),
  updateStatus: (id) => api.put(`/api/admin/restaurants/${id}/status`),
  getByUser: () => api.get('/api/admin/restaurants/user'), // Get restaurant owned by current user
  delete: (id) => api.delete(`/api/admin/restaurants/${id}`),
};

// Food Services
export const foodAPI = {
  getByRestaurant: (restaurantId) => api.get(`/api/food/restaurant/${restaurantId}`),
  search: (keyword, restaurantId) => api.get(`/api/food/search?keyword=${keyword}&restaurantId=${restaurantId}`),
  getByCategory: (categoryId, restaurantId) => api.get(`/api/food/restaurant/${restaurantId}/category/${categoryId}`),
  create: (foodData) => api.post('/api/admin/food', foodData),
  update: (id, foodData) => api.put(`/api/admin/food/${id}`, foodData),
  updateAvailability: (id) => api.put(`/api/admin/food/${id}/availability`),
};

// Category Services
export const categoryAPI = {
  getByRestaurant: (restaurantId) => api.get(`/api/category/restaurant/${restaurantId}`),
  create: (categoryData) => api.post('/api/admin/category', categoryData),
};

// Cart Services
export const cartAPI = {
  get: () => api.get('/api/cart'),
  addItem: (itemData) => api.put('/api/cart/add', itemData),
  updateItem: (itemData) => api.put('/api/cart-item/update', itemData),
  removeItem: (cartItemId) => api.delete(`/api/cart-item/${cartItemId}/remove`),
  clear: () => api.put('/api/cart/clear'),
};

// Order Services
export const orderAPI = {
  create: (orderData) => api.post('/api/order', orderData),
  getUserOrders: () => api.get('/api/order/user'),
  getRestaurantOrders: (restaurantId) => api.get(`/api/admin/order/restaurant/${restaurantId}`),
  updateStatus: (orderId, status) => api.put(`/api/admin/order/${orderId}/${status}`),
};

// User Services
export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (userData) => api.put('/api/users/profile', userData),
  addAddress: (address) => api.post('/api/users/address', address),
  getFavorites: () => api.get('/api/users/favorites'),
  addToFavorites: (restaurantId) => api.put(`/api/restaurants/${restaurantId}/add-favorites`),
  removeFromFavorites: (restaurantId) => api.delete(`/api/restaurants/${restaurantId}/remove-favorites`),
};

export default api;

// Utility functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getAuthUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
