// TypeScript definitions for the Online Food Ordering System

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT_OWNER' | 'ROLE_ADMIN';
  addresses: Address[];
  favorites: RestaurantDto[];
}

export interface Address {
  id: number;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisineType: string;
  address: Address;
  contactInformation: ContactInformation;
  openingHours: string;
  images: string[];
  registrationDate: string;
  open: boolean;
  foods: Food[];
}

export interface RestaurantDto {
  id: number;
  title: string;
  images: string[];
  description: string;
}

export interface ContactInformation {
  email: string;
  mobile: string;
  twitter: string;
  instagram: string;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  available: boolean;
  restaurant: Restaurant;
  vegetarian: boolean;
  seasonal: boolean;
  ingredients: IngredientsItem[];
  creationDate: string;
}

export interface Category {
  id: number;
  name: string;
  restaurant: Restaurant;
}

export interface IngredientsItem {
  id: number;
  name: string;
  category: IngredientCategory;
  restaurant: Restaurant;
  inStock: boolean;
}

export interface IngredientCategory {
  id: number;
  name: string;
  restaurant: Restaurant;
}

export interface Cart {
  id: number;
  customer: User;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  id: number;
  food: Food;
  quantity: number;
  ingredients: string[];
  totalPrice: number;
}

export interface Order {
  id: number;
  customer: User;
  restaurant: Restaurant;
  totalAmount: number;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  deliveryAddress: Address;
  items: OrderItem[];
  totalItems: number;
}

export interface OrderItem {
  id: number;
  food: Food;
  quantity: number;
  totalPrice: number;
  ingredients: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  message: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT_OWNER' | 'ROLE_ADMIN';
}

export interface AddCartItemRequest {
  foodId: number;
  quantity: number;
  ingredients: string[];
}

export interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}

export interface OrderRequest {
  restaurantId: number;
  deliveryAddress: Address;
}

export interface CreateFoodRequest {
  name: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  restaurantId: number;
  vegetarian: boolean;
  seasonal: boolean;
  ingredients: IngredientsItem[];
}
