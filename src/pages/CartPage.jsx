import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, getTotal } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      // Loop through cart and log each as a sale (fake API call for now)
      for (const product of cart) {
        await fetch('http://localhost:5000/api/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            customer: user?.username,  // Send username of logged-in customer
          }),
        });
      }

      alert('Purchase completed!');
      window.location.href = '/products'; // Redirect after checkout
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Try again later.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="mb-4">
            {cart.map((item, index) => (
              <li key={index} className="mb-2 flex justify-between items-center">
                <span>{item.name} - ${item.price}</span>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mb-4 font-bold">Total: ${getTotal()}</div>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
