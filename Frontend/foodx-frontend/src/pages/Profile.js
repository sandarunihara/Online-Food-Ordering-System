import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddresses(user.address || []);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async () => {
    try {
      await userAPI.addAddress(newAddress);
      toast.success('Address added successfully');
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      });
      setShowAddressForm(false);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.fullName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {user?.role === 'ROLE_CUSTOMER' ? 'Customer' : 'Restaurant Owner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Delivery Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="btn-primary"
                >
                  Add Address
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        placeholder="Street Address"
                        className="input-field"
                      />
                    </div>
                    <input
                      type="text"
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      className="input-field"
                    />
                    <input
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      className="input-field"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleAddressChange}
                      placeholder="Postal Code"
                      className="input-field"
                    />
                    <input
                      type="text"
                      name="country"
                      value={newAddress.country}
                      onChange={handleAddressChange}
                      placeholder="Country"
                      className="input-field"
                    />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button onClick={handleAddAddress} className="btn-primary">
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No addresses added yet. Add your first delivery address above.
                  </p>
                ) : (
                  addresses.map((address, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {address.street}
                          </p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          {address.country && (
                            <p className="text-gray-600">{address.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {user?.fullName || 'User'}
                </h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Member since {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/orders"
                  className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      📋
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">View Orders</p>
                      <p className="text-sm text-gray-500">Check your order history</p>
                    </div>
                  </div>
                </a>
                <a
                  href="/restaurants"
                  className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      🍽️
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Browse Restaurants</p>
                      <p className="text-sm text-gray-500">Discover new places</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add extra security</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
