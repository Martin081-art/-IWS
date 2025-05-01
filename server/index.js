const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
const salesRoute = require('./routes/sales'); // Import the new sales route
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');


// Route usage
app.use('/api/products', productsRoute);
app.use('/api/income', incomeRoute);
app.use('/api/queries', queriesRoute);
app.use('/api/users', usersRoute);
app.use('/api/sales', salesRoute); // Add sales route to handle sales-related API requests
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
