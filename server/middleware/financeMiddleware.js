const db = require('../models');

// Middleware to check permissions
const checkFinancePermissions = (req, res, next) => {
  const userRole = req.user.role; // Assume user role is determined via authentication

  // Check if the user's role is 'finance', 'developer', or 'admin'
  if (userRole === 'finance' || userRole === 'developer' || userRole === 'admin') {
    next();  // Allow access if the role is one of these
  } else {
    return res.status(403).json({ message: 'Permission denied: You do not have the required role.' });
  }
};

// Middleware to limit access to three finance personnel
const limitFinancePersonnel = async (req, res, next) => {
  try {
    const financePersonnelCount = await db.FinancePersonnel.count({
      where: { role: 'finance' }
    });

    if (financePersonnelCount >= 3) {
      return res.status(403).json({ message: 'Access denied: Maximum number of finance personnel reached.' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { checkFinancePermissions, limitFinancePersonnel };