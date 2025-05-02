// src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create Context for Cart
const CartContext = createContext();

// Custom Hook to use CartContext
export const useCart = () => useContext(CartContext);

// CartProvider component to wrap your app and provide cart state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotal = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};
