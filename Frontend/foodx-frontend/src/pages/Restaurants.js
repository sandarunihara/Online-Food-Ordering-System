import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { Search, Filter, MapPin, Clock, Star, ChevronDown } from 'lucide-react';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const categories = ['All', 'Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Thai', 'Japanese'];
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'rating', label: 'Rating' },
    { value: 'delivery_time', label: 'Delivery Time' },
  ];

  useEffect(() => {
    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || '';
    setSearchQuery(initialSearch);
    setSelectedCategory(initialCategory);
    fetchRestaurants(initialSearch, initialCategory);
  }, [searchParams]);

  const fetchRestaurants = async (search = '', category = '') => {
    try {
      setLoading(true);
      let response;
      
      if (search) {
        response = await restaurantAPI.search(search);
      } else if (category && category !== 'All') {
        response = await restaurantAPI.getByCategory(category);
      } else {
        response = await restaurantAPI.getAll();
      }
      
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(searchQuery, selectedCategory);
    // Update URL without refresh
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const newCategory = category === 'All' ? '' : category;
    fetchRestaurants(searchQuery, newCategory);
    
    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (newCategory) params.set('category', newCategory);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const filteredAndSortedRestaurants = React.useMemo(() => {
    let filtered = [...restaurants];
    
    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return 4.5 - 4.5; // Mock rating sort
        case 'delivery_time':
          return 30 - 30; // Mock delivery time sort
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [restaurants, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your Favorite Restaurant
            </h1>
            <p className="text-xl text-gray-600">
              Discover amazing food from local restaurants
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, or dishes..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-6 bg-primary-600 hover:bg-primary-700 rounded-r-xl text-white font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    (selectedCategory === category) || (selectedCategory === '' && category === 'All')
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? (
              'Loading restaurants...'
            ) : (
              `Found ${filteredAndSortedRestaurants.length} restaurant${filteredAndSortedRestaurants.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
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
        ) : filteredAndSortedRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all restaurants
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                fetchRestaurants('', '');
              }}
              className="btn-primary"
            >
              Show All Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRestaurants.map((restaurant) => (
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
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      restaurant.open 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.open ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.address?.city || 'City'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>30-45 min</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {restaurant.cuisineType || 'Restaurant'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Free delivery
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Filter content would go here */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-primary-600" />
                    <span className="ml-2 text-sm">Free delivery</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-primary-600" />
                    <span className="ml-2 text-sm">Under $2</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-primary-600" />
                    <span className="ml-2 text-sm">Under 30 mins</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-primary-600" />
                    <span className="ml-2 text-sm">30-60 mins</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 btn-secondary"
              >
                Clear
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 btn-primary"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
