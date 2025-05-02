// src/pages/CustomerShopPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';

const CustomerShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shop Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.product_id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{product.name}</h3>
            <p>{product.category}</p>
            <p>${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerShopPage;
