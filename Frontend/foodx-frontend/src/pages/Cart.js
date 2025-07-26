import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    total, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    refreshCart 
  } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    refreshCart();
  }, []);

  const handleUpdateQuantity = async (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    
    await updateCartItem(cartItemId, newQuantity);
  };

  const handleRemoveItem = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    try {
      setIsCheckingOut(true);
      const orderData = {
        deliveryAddress: {
          street: deliveryAddress,
          city: 'Default City',
          state: 'Default State',
          postalCode: '12345',
          country: 'Default Country'
        }
      };

      await orderAPI.create(orderData);
      toast.success('Order placed successfully!');
      await clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/restaurants" className="btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deliveryFee = total >= 2500 ? 0 : 299; // Free delivery over $25
  const totalWithDelivery = total + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start space-x-4">
                  {/* Food Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.food?.images?.[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'}
                      alt={item.food?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.food?.name}</h3>
                        <p className="text-sm text-gray-500">{item.food?.restaurant?.name}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ingredients */}
                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          Ingredients: {item.ingredients.map(ing => ing.name).join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${((item.totalPrice || 0) / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${((item.food?.price || 0) / 100).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Clear All Items
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${(deliveryFee / 100).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${(totalWithDelivery / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  rows="3"
                />
              </div>

              {/* Free Delivery Notice */}
              {total < 2500 && (
                <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-lg">
                  <p className="text-sm text-accent-800">
                    Add ${((2500 - total) / 100).toFixed(2)} more for free delivery!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || !deliveryAddress.trim()}
                className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </>
                )}
              </button>

              {/* Payment Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secure payment powered by FoodX
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
