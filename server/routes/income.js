const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomecontroller'); // Make sure the path is correct
const {
  checkFinancePermissions,
  limitFinancePersonnel
} = require('../middleware/financeMiddleware'); // Adjust path if necessary

// Log when the route is registered
console.log('Registering income routes: /api/income');

// Create new income statement
router.post('/', (req, res, next) => {
  console.log('Received request to create a new income statement');
  next();  // Proceed to the controller
}, incomeController.createIncome);

// Get all income statements
router.get('/', (req, res, next) => {
  console.log('Received request to get all income statements');
  next();  // Proceed to the controller
}, incomeController.getAllIncome);

// Get a specific income statement by ID
router.get('/:id', (req, res, next) => {
  console.log('Received request to get income statement with ID:', req.params.id);
  next();  // Proceed to the controller
}, incomeController.getIncomeById);

// Update income statement
router.put('/:id', (req, res, next) => {
  console.log('Received request to update income statement with ID:', req.params.id);
  next();  // Proceed to the controller
}, incomeController.updateIncome);

// Delete income statement
router.delete('/:id', (req, res, next) => {
  console.log('Received request to delete income statement with ID:', req.params.id);
  next();  // Proceed to the controller
}, incomeController.deleteIncome);

module.exports = router;
