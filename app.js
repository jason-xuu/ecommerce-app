// app.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const session = require('express-session'); // Import express-session
const passport = require('passport');       // Import Passport
const pool = require('./db');               // Import the pool from db.js
const passportConfig = require('./passport-config'); // Import your passport configuration

// Import route files
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Future addition
const orderRoutes = require('./routes/orderRoutes');     // Future addition

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Initialize session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

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

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the eCommerce app!');
});

// Export the app and pool for use in other files
module.exports = { app, pool };
