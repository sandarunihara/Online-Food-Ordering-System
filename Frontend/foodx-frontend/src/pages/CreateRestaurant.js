import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Image, ArrowLeft } from 'lucide-react';

const CreateRestaurant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisineType: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    contactInformation: {
      email: '',
      mobile: '',
      twitter: '',
      instagram: ''
    },
    openingHours: '',
    images: ['', '']
  });

  const cuisineTypes = [
    'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Thai', 'French', 
    'American', 'Mediterranean', 'Korean', 'Vietnamese', 'Greek', 'Spanish', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // console.log("user", user);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInformation: {
        ...prev.contactInformation,
        [name]: value
      }
    }));
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.cuisineType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.address.street || !formData.address.city || !formData.address.country) {
      toast.error('Please fill in address details');
      return;
    }

    if (!formData.contactInformation.email || !formData.contactInformation.mobile) {
      toast.error('Please provide contact information');
      return;
    }
//           "https://lh3.googleusercontent.com/p/AF1QipNp6GjxMM1rARlSVq6HOijoLBSpxBVeCv92lB6w=s1360-w1360-h1020",
//           "https://lh3.googleusercontent.com/p/AF1QipNFdPCS85C9C7tTaGkH5vD3iqLbC3f1p0uwT1nH=s1360-w1360-h1020",

    try {
      setLoading(true);
      
      // Prepare data with correct field names for backend
      const cleanedData = {
        name: formData.name,
        description: formData.description,
        cuisineType: formData.cuisineType,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          postalCode: formData.address.postalCode,
          country: formData.address.country,
        },
        contactInformation: {
          email: formData.contactInformation.email,
          mobile: formData.contactInformation.mobile,
          twitter: formData.contactInformation.twitter,
          instagram: formData.contactInformation.instagram,
        },
        openingHours: formData.openingHours,
        images: formData.images.filter(img => img.trim() !== ''), // Filter out empty image URLs
      };
      console.log('cleanedData:', cleanedData);
      
      const response = await restaurantAPI.create(cleanedData);
      toast.success('Restaurant created successfully!');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error('Failed to create restaurant. Please try again.');
      if( error.response?.status === 403) {
        toast.error('You do not have permission to create a restaurant.');
      }else if (error.response?.status === 400) {
        toast.error('Bad request. Please check your input.');
      }else if (error.response?.status === 500) {
        if( error.response.data && error.response.data.message) {
          toast.error(error.response.data.message + ' Please try again later.');
        } else {
          toast.error('Internal server error. Please try again later.');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again later.1234');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if user is restaurant owner
  if (!user || user.role !== 'ROLE_RESTAURANT_OWNER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to create a restaurant.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin-dashboard')} 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Restaurant</h1>
          <p className="text-gray-600">Set up your restaurant profile and start receiving orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter restaurant name"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe your restaurant..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type *
                </label>
                <select
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select cuisine type</option>
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Hours
                </label>
                <input
                  type="text"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Mon-Sun: 9:00AM - 9:00PM"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="Enter street address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="Enter state/province"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.address.postalCode}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="Enter postal code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  className="input-field"
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <Phone className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.contactInformation.email}
                    onChange={handleContactChange}
                    className="input-field pl-10"
                    placeholder="restaurant@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.contactInformation.mobile}
                  onChange={handleContactChange}
                  className="input-field"
                  placeholder="0712237230"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter (Optional)
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.contactInformation.twitter}
                  onChange={handleContactChange}
                  className="input-field"
                  placeholder="@restaurant_handle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram (Optional)
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.contactInformation.instagram}
                  onChange={handleContactChange}
                  className="input-field"
                  placeholder="@restaurant_handle"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Image className="w-5 h-5 text-gray-400 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Restaurant Images</h2>
              </div>
              <button
                type="button"
                onClick={addImageField}
                className="btn-outline"
              >
                Add Image
              </button>
            </div>
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter image URL"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="btn-secondary px-3 py-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Add high-quality images of your restaurant to attract more customers.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating Restaurant...' : 'Create Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;
