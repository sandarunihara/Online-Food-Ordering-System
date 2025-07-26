import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { Clock, MapPin, Check, X, Eye } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <Check className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">Track your recent orders and view order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              When you place your first order, it will appear here.
            </p>
            <a href="/restaurants" className="btn-primary">
              Start Ordering
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus?.replace('_', ' ') || 'Pending'}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{order.restaurant?.name}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>${((order.totalAmount || 0) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{selectedOrder === order.id ? 'Hide Details' : 'View Details'}</span>
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                {selectedOrder === order.id && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                              <img
                                src={item.food?.images?.[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'}
                                alt={item.food?.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.food?.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-gray-900">
                                ${((item.totalPrice || 0) / 100).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
                        <div className="bg-white rounded-lg p-4 space-y-3">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Delivery Address</p>
                              <p className="text-sm text-gray-600">
                                {order.deliveryAddress?.street}<br />
                                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.postalCode}
                              </p>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Subtotal</span>
                              <span>${((order.totalAmount || 0) / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Delivery Fee</span>
                              <span>$2.99</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Total</span>
                              <span>${(((order.totalAmount || 0) + 299) / 100).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Status Timeline */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Order Timeline</h4>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Order Placed</span>
                          </div>
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              ['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.orderStatus?.toLowerCase()) 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className="text-sm font-medium">Confirmed</span>
                          </div>
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              ['preparing', 'out_for_delivery', 'delivered'].includes(order.orderStatus?.toLowerCase()) 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className="text-sm font-medium">Preparing</span>
                          </div>
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              ['out_for_delivery', 'delivered'].includes(order.orderStatus?.toLowerCase()) 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className="text-sm font-medium">Out for Delivery</span>
                          </div>
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              order.orderStatus?.toLowerCase() === 'delivered' 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className="text-sm font-medium">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
