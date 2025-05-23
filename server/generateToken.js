// generateToken.js
require('dotenv').config(); // To use your .env file
const jwt = require('jsonwebtoken');

// Set test user details (you can adjust these)
const testUser = {
  userId: 12,
  username: 'admin',
  role: 'admin ' // Must match the role used in your auth middleware
};

// Generate token
const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('✅ Generated Token:\n');
console.log(token);
