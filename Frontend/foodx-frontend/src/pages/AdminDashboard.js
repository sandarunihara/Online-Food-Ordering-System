import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Simple admin check
  if (!user || user.role !== 'ROLE_RESTAURANT_OWNER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a href="/" className="btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Dashboard</h1>
          <p className="text-gray-600">Manage your restaurant and orders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">124</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                📋
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$3,249</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">+8% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                🍽️
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">5 out of stock</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                ⭐
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">120+ reviews</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <button className="btn-outline">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #{1000 + order}</p>
                    <p className="text-sm text-gray-600">2 items • $24.99</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Preparing
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
              <button className="btn-primary">Add Item</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Chicken Burger</p>
                  <p className="text-sm text-gray-600">$12.99 • Available</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Caesar Salad</p>
                  <p className="text-sm text-gray-600">$8.99 • Available</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Pasta Carbonara</p>
                  <p className="text-sm text-red-600">$15.99 • Out of Stock</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Restaurant Information</h2>
            <button className="btn-outline">Edit Info</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Name:</span> {user?.fullName || 'Restaurant Name'}</p>
                <p><span className="text-gray-600">Cuisine:</span> Italian</p>
                <p><span className="text-gray-600">Status:</span> <span className="text-green-600">Open</span></p>
                <p><span className="text-gray-600">Hours:</span> 10:00 AM - 10:00 PM</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact & Location</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Email:</span> {user?.email}</p>
                <p><span className="text-gray-600">Phone:</span> +1 (555) 123-4567</p>
                <p><span className="text-gray-600">Address:</span> 123 Food Street, City</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
