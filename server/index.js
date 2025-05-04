const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const bcrypt = require('bcryptjs');
const Pattern = require('url-pattern'); // Import url-pattern
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sequelize DB connection
const db = require('./models');
db.sequelize.authenticate()
  .then(() => console.log('Connected to MySQL ✅'))
  .catch(err => console.error('MySQL connection error ❌:', err));

// Optional: Sync database tables
db.sequelize.sync()
  .then(() => console.log('Database synced 🔄'))
  .catch(err => console.error('Failed to sync database:', err));

// Route imports
const productsRoute = require('./routes/products');
const incomeRoute = require('./routes/income');
const queriesRoute = require('./routes/queries');
const usersRoute = require('./routes/users');
const salesRoute = require('./routes/sales');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

// Log incoming requests to trace route hits
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Handle dynamic routes using url-pattern for better flexibility
const productPattern = new Pattern('/api/products/:id');
const incomePattern = new Pattern('/api/income/*');

app.use('/api/products', (req, res, next) => {
  const match = productPattern.match(req.url);
  if (match) {
    console.log('Matched Product Route:', match);
  }
  next();
});

app.use('/api/income', (req, res, next) => {
  const match = incomePattern.match(req.url);
  if (match) {
    console.log('Matched Income Route:', match);
  }
  next();
});

// Define your routes here
app.use('/api/products', productsRoute);
app.use('/api/income', incomeRoute);
app.use('/api/queries', queriesRoute);
app.use('/api/users', usersRoute);
app.use('/api/sales', salesRoute);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Optional: Serve static files (if any) for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Add error handling for unexpected issues
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.message);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
