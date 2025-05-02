import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import the CartContext to use cart functionality

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  // Destructure the role-based checks from AuthContext
  const { user } = useAuth();
  const { addToCart } = useCart(); // Use addToCart function from CartContext
  const isSales = user?.role === 'sales';
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer'; // Assuming 'customer' is a role for customers

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (product) => {
    await createProduct(product);
    loadProducts();
  };

  const handleUpdate = async (product) => {
    await updateProduct(product.product_id, product);
    setEditing(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product); // Add the selected product to the cart
  };

  return (
    <div>
      <h2>Products</h2>

      {/* Only allow adding/updating products if user is Sales or Admin */}
      {(isSales || isAdmin) && (
        <ProductForm
          onSubmit={editing ? handleUpdate : handleCreate}
          initialData={editing}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="product-list">
        <ProductList
          products={products}
          onEdit={isSales || isAdmin ? setEditing : null}
          onDelete={isSales || isAdmin ? handleDelete : null}
          onAddToCart={isCustomer ? handleAddToCart : null} // Show 'Add to Cart' button for customers only
        />
      </div>
    </div>
  );
};

export default ProductsPage;
