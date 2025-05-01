const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomecontroller'); // Make sure the path is correct
const {
  checkFinancePermissions,
  limitFinancePersonnel
} = require('../middleware/financeMiddleware'); // Adjust path if necessary

// Create new income statement
router.post('/', incomeController.createIncome);

// Get all income statements
router.get('/', incomeController.getAllIncome);

// Get a specific income statement by ID
router.get('/:id', incomeController.getIncomeById);

// Update income statement
router.put('/:id', incomeController.updateIncome);

// Delete income statement
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
