import { createContext, useContext, useState } from 'react';

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object should include user info like { username, role }

  const login = (userData) => {
    console.log('Logging in:', userData); // Log the user data when logging in
    setUser(userData); // Set user state on login
  };

  const logout = () => {
    console.log('Logging out:', user); // Log the user data when logging out
    setUser(null); // Reset user state on logout
  };

  // A helper function to check if the user has a specific role
  const hasRole = (role) => user?.role === role;

  const isSales = hasRole('sales');
  const isAdmin = hasRole('admin');
  const isFinance = hasRole('finance');
  const isDeveloper = hasRole('developer');
  const isInvestor = hasRole('investor');
  const isPartner = hasRole('partner');

  return (
    <AuthContext.Provider value={{ user, login, logout, isSales, isAdmin, isFinance, isDeveloper, isInvestor, isPartner }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
