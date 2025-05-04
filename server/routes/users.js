const express = require('express');
const router = express.Router();
const userController = require('../controllers/userscontroller');  // Correctly imported controller

// 📌 Create a new user
router.post('/', async (req, res) => {
  console.log('Received request to create a user:', req.body);

  try {
    await userController.createUser(req, res);
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 📌 Get all users
router.get('/', async (req, res) => {
  console.log('Received request to get all users');

  try {
    await userController.getAllUsers(req, res);
    console.log('Users fetched successfully');
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 📌 Get a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to get user with ID: ${id}`);

  try {
    await userController.getUserById(req, res);
    console.log(`User with ID ${id} fetched successfully`);
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 📌 Update a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to update user with ID: ${id}`, req.body);

  try {
    await userController.updateUser(req, res);
    console.log(`User with ID ${id} updated successfully`);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 📌 Delete a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete user with ID: ${id}`);

  try {
    await userController.deleteUser(req, res);
    console.log(`User with ID ${id} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
