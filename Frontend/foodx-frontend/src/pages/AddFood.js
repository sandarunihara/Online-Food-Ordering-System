import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { foodAPI, categoryAPI, restaurantAPI } from '../services/api';
import toast from 'react-hot-toast';

const AddFood = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([{ name: '' }]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    vegetarian: false,
    seasonal: false,
    ingredients: [],
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [dragOver, setDragOver] = useState(false);

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
      
      if (!restaurantData) {
        toast.error('No restaurant found. Please create your restaurant first.');
        navigate('/create-restaurant');
        return;
      }
      
      setRestaurant(restaurantData);
      
      // Get categories for this restaurant
      if (restaurantData.id) {
        const categoriesResponse = await categoryAPI.getByRestaurant();
        setCategories(categoriesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      if (error.response?.status === 404) {
        toast.error('No restaurant found. Please create your restaurant first.');
        navigate('/create-restaurant');
      } else {
        toast.error('Failed to load restaurant data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '' }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const updatedIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(updatedIngredients);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    processImageFiles(files);
  };

  const processImageFiles = (files) => {
    // Validate and filter files
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPEG, PNG, GIF, and WebP images are allowed.`);
        return;
      }
      
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        return;
      }
      
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      // Combine with existing files (limit to 5 total images)
      const combinedFiles = [...imageFiles, ...validFiles].slice(0, 5);
      setImageFiles(combinedFiles);
      
      // Clean up old preview URLs
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      // Create new preview URLs
      const previewUrls = combinedFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(previewUrls);

      if (validFiles.length < files.length) {
        toast.warning('Some files were skipped due to invalid format or size.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      processImageFiles(imageFiles);
    } else {
      toast.error('Please drop only image files.');
    }
  };

  const removeImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviewUrls.filter((_, i) => i !== index);
    
    setImageFiles(updatedFiles);
    setImagePreviewUrls(updatedPreviews);
    
    // Clean up URL
    URL.revokeObjectURL(imagePreviewUrls[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurant || !restaurant.id) {
      toast.error('Restaurant not found');
      return;
    }

    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate ingredients
    const validIngredients = ingredients.filter(ing => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    try {
      setLoading(true);

      // Find the selected category object
      const selectedCategory = categories.find(c => c.id === parseInt(formData.category));
      if (!selectedCategory) {
        toast.error('Please select a valid category');
        return;
      }

      // Prepare ingredients in the format backend expects
      const backendIngredients = validIngredients.map(ing => ({
        name: ing.name,
        inStoke: true
        // Don't send null values for id, category, restaurant - let backend handle them
      }));

      // Prepare food data for submission
      const foodDataPayload = {
        name: formData.name,
        description: formData.description,
        price: Math.round(parseFloat(formData.price)), // Convert to cents
        vegetarian: formData.vegetarian,
        seasional: formData.seasonal, // Note: backend has typo "seasional"
        restaurantId: restaurant.id,
        category: {
          id: selectedCategory.id,
          name: selectedCategory.name
          // Don't send null restaurant - let backend handle it
        },
        ingredients: backendIngredients,
        images: [] // Will be populated with uploaded image URLs by backend
      };

      // If we have images, use FormData, otherwise send JSON
      if (imageFiles.length > 0) {
        // Create FormData for multipart upload with images
        const formData = new FormData();
        
        // Append food data as JSON blob
        formData.append('food', new Blob([JSON.stringify(foodDataPayload)], {
          type: 'application/json'
        }));
        
        // Append each image file (already validated in processImageFiles)
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
        
        // Upload with images using multipart/form-data
        await foodAPI.create(formData);
        toast.success('Food item added successfully with images!');
      } else {
        // Send as JSON if no images
        await foodAPI.createWithoutImages(foodDataPayload);
        toast.success('Food item added successfully!');
      }
      navigate('/admin');
      
    } catch (error) {
      console.error('Error creating food item:', error);
      toast.error(error.response?.data?.message || 'Failed to create food item');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Food Item</h1>
          <p className="text-gray-600">
            Add a new menu item to {restaurant?.name || 'your restaurant'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter food name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your food item..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">
                    No categories found. You need to create categories first to organize your menu items.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/add-category')}
                    className="text-sm text-yellow-700 hover:text-yellow-900 font-medium underline"
                  >
                    Create Categories First
                  </button>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="vegetarian"
                  checked={formData.vegetarian}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="seasonal"
                  checked={formData.seasonal}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Seasonal</span>
              </label>
            </div>

            {/* Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients *
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="btn-outline text-sm"
                >
                  Add Ingredient
                </button>
              </div>
              
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="Ingredient name (e.g., Tomatoes, Cheese, etc.)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                        className="px-3 py-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Images
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragOver 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="food-images"
                />
                <label
                  htmlFor="food-images"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 10MB each (max 5 images)</p>
                  {dragOver && (
                    <p className="text-xs text-primary-600 mt-2 font-medium">Drop images here</p>
                  )}
                </label>
              </div>
              
              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Previews:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                )}
                {loading ? 'Adding...' : 'Add Food Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
