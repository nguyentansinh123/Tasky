import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { authUser, isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && (!authUser.roles || !authUser.roles.includes('ADMIN'))) {
    console.log('User without ADMIN role attempting to access admin route');
  }
  
  return children;
};

export default ProtectedRoute;