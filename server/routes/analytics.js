const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Log when the route is registered
console.log('Registering route: /api/analytics');

// Define the route and log each time it is hit
router.get('/', (req, res, next) => {
  console.log('Received a request for analytics data');
  next();  // Proceed to the controller
}, analyticsController.getAnalytics);

module.exports = router;
