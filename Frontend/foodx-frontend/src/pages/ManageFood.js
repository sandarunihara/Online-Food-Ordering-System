import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { foodAPI, restaurantAPI } from '../services/api';
import toast from 'react-hot-toast';

const ManageFood = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user && user.role === 'ROLE_RESTAURANT_OWNER') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get restaurant owned by current user
      const restaurantResponse = await restaurantAPI.getByUser();
      const restaurantData = restaurantResponse?.data;
      
      if (!restaurantData) {
        toast.error('No restaurant found. Please create your restaurant first.');
        navigate('/create-restaurant');
        return;
      }
      
      setRestaurant(restaurantData);
      
      // Get food items for this restaurant
      const foodResponse = await foodAPI.getByRestaurant(restaurantData.id);
      setFoods(foodResponse.data || []);

      // Extract unique categories from foods
      const uniqueCategories = [...new Set(foodResponse.data?.map(food => food.category?.name).filter(Boolean))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async (foodId) => {
    try {
      await foodAPI.updateAvailability(foodId);
      toast.success('Availability updated successfully!');
      
      // Update the local state
      setFoods(prevFoods => 
        prevFoods.map(food => 
          food.id === foodId 
            ? { ...food, available: !food.available }
            : food
        )
      );
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await foodAPI.delete(itemToDelete.id);
      toast.success('Food item deleted successfully!');
      
      // Remove from local state
      setFoods(prevFoods => prevFoods.filter(food => food.id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast.error('Failed to delete food item');
    }
  };

  const openDeleteModal = (food) => {
    setItemToDelete(food);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Filter foods based on search and filters
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === '' || food.category?.name === filterCategory;
    
    const matchesAvailability = filterAvailability === 'all' ||
                               (filterAvailability === 'available' && food.available) ||
                               (filterAvailability === 'unavailable' && !food.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Access control
  if (!user || user.role !== 'ROLE_RESTAURANT_OWNER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Food Items</h1>
              <p className="text-gray-600">
                View and manage all menu items for {restaurant?.name || 'your restaurant'}
              </p>
            </div>
            <button
              onClick={() => navigate('/add-food')}
              className="btn-primary flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Food
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Items</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                  setFilterAvailability('all');
                }}
                className="btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Food Items Grid */}
        {filteredFoods.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {foods.length === 0 ? 'No Food Items Yet' : 'No Items Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {foods.length === 0 
                ? 'Start building your menu by adding your first food item!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {foods.length === 0 && (
              <button
                onClick={() => navigate('/add-food')}
                className="btn-primary"
              >
                Add Your First Food Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <div key={food.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Food Image */}
                <div className="h-48 bg-gray-200 relative">
                  {food.images && food.images.length > 0 ? (
                    <img
                      src={food.images[0]}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      food.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {food.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{food.name}</h3>
                    <span className="text-lg font-bold text-primary-600">
                      ${typeof food.price === 'number' && food.price > 1000 
                        ? (food.price).toFixed(2)  // Convert from cents if it's a large number
                        : parseFloat(food.price).toFixed(2) // Use as is if it's already in dollars
                      }
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{food.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {food.category?.name || 'No Category'}
                    </span>
                    {food.vegetarian && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        🌱 Vegetarian
                      </span>
                    )}
                    {food.seasonal && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                        🍂 Seasonal
                      </span>
                    )}
                  </div>

                  {/* Ingredients */}
                  {food.ingredients && food.ingredients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
                      <p className="text-sm text-gray-600">
                        {food.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
                        {food.ingredients.length > 3 && ` +${food.ingredients.length - 3} more`}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateAvailability(food.id)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        food.available 
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {food.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    
                    <button
                      onClick={() => navigate(`/edit-food/${food.id}`)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => openDeleteModal(food)}
                      className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Creation Date */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(food.creationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{foods.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {foods.filter(f => f.available).length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {foods.filter(f => !f.available).length}
              </div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-mx">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Food Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFood;
