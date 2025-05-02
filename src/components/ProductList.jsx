import React from 'react';

const ProductList = ({ products, onEdit, onDelete, onAddToCart, isCustomer }) => {
  return (
    <div>
      <h3>Product List</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.product_id} className="flex justify-between items-center">
              <span>{product.name} - {product.category} - ${product.price}</span>
              
              {/* Show Edit and Delete buttons if user is Sales or Admin */}
              {(onEdit || onDelete) && (
                <div className="flex space-x-2">
                  {onEdit && (
                    <button onClick={() => onEdit(product)} className="bg-yellow-500 text-white p-2 rounded">
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(product.product_id)} className="bg-red-500 text-white p-2 rounded">
                      Delete
                    </button>
                  )}
                </div>
              )}

              {/* Show Add to Cart button only for customers */}
              {isCustomer && (
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Add to Cart
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
