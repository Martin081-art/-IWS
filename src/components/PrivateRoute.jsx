import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if the requiredRole is an array or a single string
  const isAllowed = Array.isArray(requiredRole)
    ? requiredRole.some(role => role === user.role || (role === 'admin' && user.role === 'developer') || (role === 'developer' && user.role === 'admin')) // Allow access to 'admin' or 'developer' for the same set of roles
    : user.role === requiredRole || (requiredRole === 'admin' && user.role === 'developer') || (requiredRole === 'developer' && user.role === 'admin');

  // If the user doesn't have the required role, show access denied message
  if (!isAllowed) {
    return <div className="p-4 text-red-500">Access Denied</div>;
  }

  return children; // If the user is allowed, render the children components
};

export default PrivateRoute;
