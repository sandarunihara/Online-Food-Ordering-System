import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, foodAPI, categoryAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Phone, 
  Plus, 
  Minus,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, foodsRes, categoriesRes] = await Promise.all([
        restaurantAPI.getById(id),
        foodAPI.getByRestaurant(id),
        categoryAPI.getByRestaurant(id)
      ]);
      
      setRestaurant(restaurantRes.data);
      setFoods(foodsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (food) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const quantity = quantities[food.id] || 1;
    const result = await addToCart(food.id, quantity);
    
    if (result.success) {
      setQuantities(prev => ({ ...prev, [food.id]: 1 }));
    }
  };

  const updateQuantity = (foodId, change) => {
    setQuantities(prev => ({
      ...prev,
      [foodId]: Math.max(1, (prev[foodId] || 1) + change)
    }));
  };

  const filteredFoods = foods.filter(food => {
    const matchesCategory = !selectedCategory || food.category?.id === selectedCategory;
    const matchesSearch = !searchQuery || 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h2>
          <button onClick={() => navigate('/restaurants')} className="btn-primary">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg text-gray-200 mb-4">{restaurant.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.openingHours || 'Daily 10:00 AM - 10:00 PM'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.5 (120+ reviews)</span>
              </div>
              {restaurant.contactInformation?.mobile && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{restaurant.contactInformation.mobile}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info & Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Section */}
          <div className="flex-1">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      !selectedCategory 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredFoods.map((food) => (
                  <div key={food.id} className="food-card flex flex-col md:flex-row">
                    <div className="md:w-32 h-32 flex-shrink-0">
                      <img
                        src={food.images?.[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'}
                        alt={food.name}
                        className="w-full h-full object-cover rounded-lg md:rounded-l-lg md:rounded-r-none"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{food.name}</h3>
                        <div className="flex items-center space-x-2">
                          {food.isVegetarian && (
                            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                          )}
                          {!food.available && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{food.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary-600">
                          ${(food.price / 100).toFixed(2)}
                        </span>
                        {food.available ? (
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(food.id, -1)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {quantities[food.id] || 1}
                              </span>
                              <button
                                onClick={() => updateQuantity(food.id, 1)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleAddToCart(food)}
                              className="btn-primary px-4 py-2"
                            >
                              Add to Cart
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 font-medium">Not Available</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Restaurant Info Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-20 space-y-6">
              {/* Restaurant Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Restaurant Info</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    restaurant.open 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.open ? 'Open' : 'Closed'}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Delivery: 30-45 min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Free delivery on orders over $25</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>4.5 rating • 120+ reviews</span>
                  </div>
                </div>
              </div>

              {/* Cuisine Type */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-lg mb-3">Cuisine</h3>
                <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {restaurant.cuisineType}
                </span>
              </div>

              {/* Contact Info */}
              {restaurant.contactInformation && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-lg mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    {restaurant.contactInformation.mobile && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{restaurant.contactInformation.mobile}</span>
                      </div>
                    )}
                    {restaurant.contactInformation.email && (
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 text-gray-400">@</span>
                        <span>{restaurant.contactInformation.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full btn-outline flex items-center justify-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Add to Favorites</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
