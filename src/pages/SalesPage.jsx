import React, { useEffect, useState } from 'react';

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products. Please try again.');
        }
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setMessage(`Error fetching products: ${err.message}`));
  }, []);

  // Handle input changes for quantities
  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };


  const handleSell = async (product) => {
    const quantity = parseInt(quantities[product.product_id] || 0);
    if (quantity <= 0 || quantity > product.quantity) {
      return setMessage(`Invalid quantity for "${product.name}". Please enter a valid quantity.`);
    }
  
    const sale = {
      product_id: product.product_id,
      quantity: quantity,
      customer: 'Walk-in', // Example customer name; change as needed
      name: product.name,   // <-- Include name in the payload
      price: product.price, // <-- Include price from the product
    };
  
    try {
      const res = await fetch('http://localhost:5000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(sale)
      });
  
      if (!res.ok) {
        throw new Error('Failed to record sale. Please try again.');
      }
  
      const result = await res.json();
      setMessage(result.message);
  
      // Refresh products
      const updatedProducts = await fetch('http://localhost:5000/api/products').then(res => {
        if (!res.ok) {
          throw new Error('Failed to update product list after sale.');
        }
        return res.json();
      });
      setProducts(updatedProducts);
  
    } catch (err) {
      setMessage(`Error during sale: ${err.message}`);
    }
  };
  

  return (
    <div>
      <h2>Sales Page</h2>
      <p>{message}</p>
      <ul>
        {products.map(product => (
          <li key={product.product_id}>
            <strong>{product.name}</strong> - Stock: {product.quantity}
            <input
              type="number"
              placeholder="Qty"
              min="1"
              value={quantities[product.product_id] || ''}
              onChange={e => handleQuantityChange(product.product_id, e.target.value)}
            />
            <button onClick={() => handleSell(product)}>Sell</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesPage;
