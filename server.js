// server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');  // Add this line to import Pool from pg
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Setup PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the eCommerce app!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
