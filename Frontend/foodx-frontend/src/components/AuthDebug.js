import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuthToken, getAuthUser } from '../services/api';

const AuthDebug = () => {
  const { user, token, isAuthenticated, loading } = useAuth();
  const storageToken = getAuthToken();
  const storageUser = getAuthUser();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">Auth Debug Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</div>
        <div><strong>Context Token:</strong> {token ? `${token.substring(0, 20)}...` : 'null'}</div>
        <div><strong>Storage Token:</strong> {storageToken ? `${storageToken.substring(0, 20)}...` : 'null'}</div>
        <div><strong>Context User:</strong> {user ? user.email : 'null'}</div>
        <div><strong>Storage User:</strong> {storageUser ? storageUser.email : 'null'}</div>
        <div><strong>User Role:</strong> {user?.role || storageUser?.role || 'null'}</div>
      </div>
    </div>
  );
};

export default AuthDebug;
