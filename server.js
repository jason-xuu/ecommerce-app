// server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const pool = require('./db'); // Import the pool from db.js
const app = express();

// Import route files
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Future addition
const orderRoutes = require('./routes/orderRoutes');     // Future addition

// Middleware to parse JSON requests
app.use(express.json());

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});

// Use routes
app.use('/users', userRoutes);
app.use('/products', productRoutes); // For products endpoints
app.use('/orders', orderRoutes);     // For orders endpoints

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the eCommerce app!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export pool for use in other files (optional)
module.exports = pool;
