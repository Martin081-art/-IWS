const express = require('express');
const router = express.Router();
const productController = require('../controllers/productscontroller');

// Create a new product
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);  // Changed /products to /


router.get('/:id', productController.getProductById);  // Changed /products/:id to :id

// Update a product by ID
router.put('/:id', productController.updateProduct);  // Changed /products/:id to :id

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);  // Changed /products/:id to :id

module.exports = router;
