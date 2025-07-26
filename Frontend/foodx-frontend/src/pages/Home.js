import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, ChefHat, Utensils, Coffee, Pizza } from 'lucide-react';
import { restaurantAPI } from '../services/api';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      const restaurantsData = response.data;
      setRestaurants(restaurantsData);
      // Get featured restaurants (first 6)
      setFeaturedRestaurants(restaurantsData.slice(0, 6));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to restaurants page with search query
      window.location.href = `/restaurants?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { name: 'Fast Food', icon: Pizza, color: 'bg-red-100 text-red-600' },
    { name: 'Italian', icon: Utensils, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Asian', icon: ChefHat, color: 'bg-orange-100 text-orange-600' },
    { name: 'Desserts', icon: Coffee, color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Delicious Food
              <span className="block text-accent-200">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
              Order from your favorite restaurants and get it delivered to your doorstep
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-slide-up">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  className="w-full pl-10 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 text-lg"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-6 bg-accent-500 hover:bg-accent-600 rounded-r-xl text-white font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="w-full h-20 text-white" viewBox="0 0 1440 100" fill="currentColor">
            <path d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Explore different cuisines and food types
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={index}
                  to={`/restaurants?category=${category.name}`}
                  className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Restaurants
              </h2>
              <p className="text-xl text-gray-600">
                Popular restaurants in your area
              </p>
            </div>
            <Link
              to="/restaurants"
              className="btn-outline hidden md:inline-flex"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="restaurant-card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurant/${restaurant.id}`}
                  className="restaurant-card group"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        restaurant.open 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.open ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.address?.city || 'City'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.openingHours || '30-45 min'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium text-primary-600">
                        {restaurant.cuisineType}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/restaurants" className="btn-primary">
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FoodX?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make food delivery simple, fast, and enjoyable for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your favorite food delivered in 30 minutes or less with our efficient delivery network.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors">
                <Star className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Food</h3>
              <p className="text-gray-600">
                We partner with the best restaurants to ensure you get fresh, delicious meals every time.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wide Coverage</h3>
              <p className="text-gray-600">
                Available in multiple cities with thousands of restaurants to choose from.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers and experience the best food delivery service
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-lg"
          >
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
