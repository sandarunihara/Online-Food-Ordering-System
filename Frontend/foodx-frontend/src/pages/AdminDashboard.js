import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI, orderAPI, foodAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    menuItems: 0,
    rating: 0
  });

  useEffect(() => {
    if (user && user.role === 'ROLE_RESTAURANT_OWNER') {
      fetchRestaurantData();
    }
  }, [user]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      console.log("dsffaf");
      // Get restaurant owned by current user
      const restaurantResponse = await restaurantAPI.getByUser();
      // const restaurantResponse={}
      
      const restaurantData = restaurantResponse?.data;
      console.log("Restaurant Data:", restaurantData);
      
      if ( !restaurantData || !restaurantData) {
        toast.error('No restaurant found for this user');
      }
      setRestaurant(restaurantData);

      if (restaurantData && restaurantData.id) {

        // console.log(restaurantData.id);
        
        const food=await foodAPI.getByRestaurant(restaurantData.id);
        // console.log(food.data);
        setRestaurant(prev => ({
          ...prev,
          foods: food.data || []
        }));
        

        // Get orders for this restaurant
        const ordersResponse = await orderAPI.getRestaurantOrders(restaurantData.id);
        setOrders(ordersResponse.data || []);

        // Calculate stats
        const ordersList = ordersResponse.data || [];
        const totalOrders = ordersList.length;
        const revenue = ordersList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        setStats({
          totalOrders,
          revenue,
          menuItems: restaurantData.foods ? restaurantData.foods.length : 0,
          rating: restaurantData.rating || 0
        });
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      if (error.response?.status === 404) {
        toast.error('No restaurant found. Please create your restaurant first.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access this resource.');
      }else if (error.response?.status === 500) {
        if( error.response.data && error.response.data.message && error.response.data.message =="Restaurant not found for this user"){
          console.error(error.response.data.message);
          // toast.error('No restaurant found. Please create your restaurant first.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading dashboard...</span>
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
          <p className="text-gray-600">
            {restaurant ? `Managing ${restaurant.name}` : 'Manage your restaurant and orders'}
          </p>
        </div>

        {!restaurant ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No Restaurant Found</h2>
            <p className="text-gray-600 mb-6">You need to create a restaurant first to access the dashboard.</p>
            <button 
              onClick={() => navigate('/create-restaurant')}
              className="btn-primary"
            >
              Create Restaurant
            </button>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
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
                    <p className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{stats.menuItems}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    🍽️
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Active items</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    ⭐
                  </div>
                </div>
                <p className="text-sm text-green-600 mt-2">Customer rating</p>
              </div>
            </div>

            {/* Quick Actions */}
            {(!restaurant?.foods || restaurant.foods.length === 0) && (
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200 p-6 mb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">
                      🚀 Get Started with Your Menu
                    </h3>
                    <p className="text-primary-700 mb-4">
                      You haven't added any food items yet. Let's get your menu set up!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate('/add-category')}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        1. Create Categories
                      </button>
                      <button
                        onClick={() => navigate('/add-food')}
                        className="bg-white hover:bg-primary-50 text-primary-600 border border-primary-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        2. Add Food Items
                      </button>
                    </div>
                  </div>
                  <div className="ml-4 text-4xl">
                    🍴
                  </div>
                </div>
              </div>
            )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <button className="btn-outline">View All</button>
            </div>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order, index) => (
                <div key={order.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id || (1000 + index)}</p>
                    <p className="text-sm text-gray-600">{order.totalItem || 'N/A'} items • ${order.totalAmount || '0.00'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'PREPARING' ? 'bg-orange-100 text-orange-800' :
                    order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.orderStatus || 'Preparing'}
                  </span>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No orders yet
                </div>
              )}
            </div>
          </div>

          {/* Menu Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/add-category')}
                  className="btn-outline text-sm"
                >
                  Manage Categories
                </button>
                <button 
                  onClick={() => navigate('/manage-food')}
                  className="btn-outline text-sm"
                >
                  View All Food
                </button>
                <button 
                  onClick={() => navigate('/add-food')}
                  className="btn-primary"
                >
                  Add Item
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {restaurant?.foods && restaurant.foods.length > 0 ? (
                restaurant.foods.slice(0, 3).map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{food.name}</p>
                      <p className="text-sm text-gray-600">
                        ${(food.price / 100).toFixed(2)} • {food.available ? 'Available' : 'Out of Stock'}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/manage-food')}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No menu items yet</p>
                  <button 
                    onClick={() => navigate('/add-food')}
                    className="btn-primary text-sm"
                  >
                    Add Your First Item
                  </button>
                </div>
              )}
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
                <p><span className="text-gray-600">Name:</span> {restaurant?.name || 'Restaurant Name'}</p>
                <p><span className="text-gray-600">Cuisine:</span> {restaurant?.cuisineType || 'Italian'}</p>
                <p><span className="text-gray-600">Status:</span> <span className="text-green-600">{restaurant?.open === false ?  'Closed' : 'Open'}</span></p>
                <p><span className="text-gray-600">Hours:</span> {restaurant?.openingHours || '10:00 AM - 10:00 PM'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact & Location</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Email:</span> {restaurant.contactInformation?.email || 'N/A'}</p>
                <p><span className="text-gray-600">Phone:</span> {restaurant.contactInformation?.mobile || 'N/A'}</p>
                <p><span className="text-gray-600">Address:</span> {restaurant.address?.street || 'N/A'}, {restaurant.address?.city || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
