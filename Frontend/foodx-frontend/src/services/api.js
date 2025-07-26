import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/api/users/profile'),
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
