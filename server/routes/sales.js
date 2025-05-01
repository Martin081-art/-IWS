const express = require('express');
const { createSale, getAllSales } = require('../controllers/saleController');
const router = express.Router();

// 🔒 Simulated auth middleware (for testing - replace with real auth in production)
router.use((req, res, next) => {
  req.user = { role: 'sales', id: 6 }; // Simulate a sales role and userId
  next();
});

// ✅ Middleware: Check if the user is a sales personnel
const checkPermissions = (req, res, next) => {
  const userRole = req.user?.role;
  if (userRole !== 'sales') {
    return res.status(403).json({ message: 'Forbidden: You do not have access.' });
  }
  next();
};

// 📌 Routes: Create and View Sales
router.post('/', checkPermissions, createSale);
router.get('/', checkPermissions, getAllSales);

module.exports = router;
