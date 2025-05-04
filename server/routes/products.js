const express = require('express');
const router = express.Router();
const productController = require('../controllers/productscontroller');

// Log when the route is registered
console.log('Registering product routes: /api/products');

// Create a new product
router.post('/', (req, res, next) => {
  console.log('Received request to create a new product:', req.body);
  next();  // Proceed to the controller
}, productController.createProduct);

// Get all products
router.get('/', (req, res, next) => {
  console.log('Received request to get all products');
  next();  // Proceed to the controller
}, productController.getAllProducts);

// Get a specific product by ID
router.get('/:id', (req, res, next) => {
  console.log('Received request to get product with ID:', req.params.id);
  next();  // Proceed to the controller
}, productController.getProductById);

// Update a product by ID
router.put('/:id', (req, res, next) => {
  console.log('Received request to update product with ID:', req.params.id, 'with data:', req.body);
  next();  // Proceed to the controller
}, productController.updateProduct);

// Delete a product by ID
router.delete('/:id', (req, res, next) => {
  console.log('Received request to delete product with ID:', req.params.id);
  next();  // Proceed to the controller
}, productController.deleteProduct);

module.exports = router;
