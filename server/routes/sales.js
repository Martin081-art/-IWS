const express = require('express');
const { createSale, getAllSales } = require('../controllers/saleController');
const router = express.Router();

// 🔒 Simulated auth middleware (for testing - replace with real auth in production)
router.use((req, res, next) => {
  req.user = { role: 'sales', id: 6 }; // Simulate a sales role and userId
  console.log('Simulated user logged in:', req.user);
  next();
});

// ✅ Middleware: Check if the user is a sales personnel
const checkPermissions = (req, res, next) => {
  const userRole = req.user?.role;
  console.log('Checking user role:', userRole);

  if (userRole !== 'sales') {
    console.log('Permission denied: User is not a sales personnel');
    return res.status(403).json({ message: 'Forbidden: You do not have access.' });
  }

  console.log('Permission granted: User is a sales personnel');
  next();
};

// 📌 Routes: Create and View Sales

// Create a sale
router.post('/', checkPermissions, async (req, res) => {
  console.log('Received request to create a sale:', req.body);

  try {
    await createSale(req, res);
    console.log('Sale created successfully');
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all sales
router.get('/', checkPermissions, async (req, res) => {
  console.log('Received request to get all sales');

  try {
    await getAllSales(req, res);
    console.log('Sales fetched successfully');
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
