// src/components/ProtectedRoute.jsx
import React from 'react';
import { Redirect } from 'react-router-dom';  // Make sure to have React Router set up
import { useRole } from '../context/RoleContext';

const ProtectedRoute = ({ roleRequired, children }) => {
  const { role } = useRole();

  if (!role) {
    return <Redirect to="/login" />;  // Redirect to login if the user is not logged in
  }

  if (role !== roleRequired) {
    return <Redirect to="/unauthorized" />;  // Redirect if the user doesn't have the required role
  }

  return children;  // If the role matches, render the protected content
};

export default ProtectedRoute;
