import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthDebug from './components/AuthDebug';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import CreateRestaurant from './pages/CreateRestaurant';
import AddFood from './pages/AddFood';
import AddCategory from './pages/AddCategory';
import ManageFood from './pages/ManageFood';
import EditFood from './pages/EditFood';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/create-restaurant" element={
                  <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
                    <CreateRestaurant />
                  </ProtectedRoute>
                } />
                <Route path="/add-food" element={
                  <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
                    <AddFood />
                  </ProtectedRoute>
                } />
                <Route path="/add-category" element={
                  <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
                    <AddCategory />
                  </ProtectedRoute>
                } />
                <Route path="/manage-food" element={
                  <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
                    <ManageFood />
                  </ProtectedRoute>
                } />
                <Route path="/edit-food/:id" element={
                  <ProtectedRoute requiredRole="ROLE_RESTAURANT_OWNER">
                    <EditFood />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
            {/* <AuthDebug /> */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
