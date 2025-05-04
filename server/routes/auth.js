const express = require('express');
const bcrypt = require('bcryptjs');  // Use bcryptjs instead of bcrypt
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const router = express.Router();

// Log when the route is registered
console.log('Registering authentication routes: /api/auth');

// Validate required fields
const validateFields = (fields, reqBody) => {
  return fields.every(field => reqBody[field] && reqBody[field].trim() !== '');
};

// LOGIN route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log('Received login request for username:', username);

  if (!validateFields(['username', 'password'], req.body)) {
    console.log('Validation failed for login');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found during login for username:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password using bcryptjs.compare
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    console.log('Login successful for username:', username);
    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// SIGNUP route
router.post('/signup', async (req, res) => {
  const { username, password, role, email } = req.body;

  console.log('Received signup request for username:', username);

  if (!validateFields(['username', 'password', 'role', 'email'], req.body)) {
    console.log('Validation failed for signup');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('Username already taken during signup for username:', username);
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password using bcryptjs.hash
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the salt rounds

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
      email
    });

    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    console.log('Signup successful for username:', username);
    res.status(201).json({ token, username: newUser.username, role: newUser.role });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
