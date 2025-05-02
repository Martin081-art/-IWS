// src/context/RoleContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create a context for user roles
const RoleContext = createContext();

// Create a provider component
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);  // Role can be 'sales', 'finance', 'developer', etc.

  const setUserRole = (role) => {
    setRole(role);
  };

  return (
    <RoleContext.Provider value={{ role, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use the role context
export const useRole = () => {
  return useContext(RoleContext);
};
