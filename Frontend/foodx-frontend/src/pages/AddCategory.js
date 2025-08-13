import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, restaurantAPI } from '../services/api';
import toast from 'react-hot-toast';

const AddCategory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (user && user.role === 'ROLE_RESTAURANT_OWNER') {
      fetchRestaurantData();
    }
  }, [user]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Get restaurant owned by current user
      const restaurantResponse = await restaurantAPI.getByUser();
      const restaurantData = restaurantResponse?.data;
       console.log("Restaurant Data1234:", restaurantData);

      if (restaurantData === null) {
        toast.error('No restaurant found. Please create your restaurant first.');
        navigate('/create-restaurant');
        return;
      }
      
      setRestaurant(restaurantData);
      
      // Get existing categories for this restaurant
      if (restaurantData.id) {
        const categoriesResponse = await categoryAPI.getByRestaurant(restaurantData.id);
        console.log("Categories Response:", categoriesResponse);

        if(!categoriesResponse){
            if (categoriesResponse.status === 404) {
              toast.error('No categories found for this restaurant.');
            }
        }
        setCategories(categoriesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      if (error.response?.status === 404) {
        toast.error('No categories found. Please create your categories first.');
        // navigate('/create-restaurant');
      } else {
        toast.error('Failed to load restaurant data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurant || !restaurant.id) {
      toast.error('Restaurant not found');
      return;
    }

    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      setLoading(true);

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        restaurantId: restaurant.id
      };

      await categoryAPI.create(categoryData);
      toast.success('Category added successfully!');
      
      // Reset form
      setFormData({ name: '', description: '' });
      
      // Refresh categories list
      const categoriesResponse = await categoryAPI.getByRestaurant(restaurant.id);
      setCategories(categoriesResponse.data || []);
      
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading && !restaurant) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Categories</h1>
          <p className="text-gray-600">
            Add and manage categories for {restaurant?.name || 'your restaurant'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Category Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Category</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter category name (e.g., Appetizers, Main Course)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Optional description for this category"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
                  {loading ? 'Adding...' : 'Add Category'}
                </button>
              </form>
            </div>
          </div>

          {/* Existing Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Categories</h2>
              
              <div className="space-y-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        )}
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No categories yet</p>
                    <p className="text-sm">Add your first category to organize your menu items</p>
                  </div>
                )}
              </div>

              {categories.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => navigate('/add-food')}
                    className="w-full btn-outline"
                  >
                    Add Food Items
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
