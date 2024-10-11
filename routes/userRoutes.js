const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Database pool
const router = express.Router();

// GET route to render the register form
router.get('/register', (req, res) => {
  res.send(`
    <form action="/users/register" method="POST">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  `);
});

// POST route to handle user registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// GET route to render the login form
router.get('/login', (req, res) => {
  res.send(`
    <form action="/users/login" method="POST">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  `);
});

// POST route to handle login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/users/dashboard',  // Redirect to dashboard if successful
  failureRedirect: '/users/login',      // Redirect back to login if failed
  failureMessage: 'Invalid username or password'
}));

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Protected route (for example, a dashboard)
router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Welcome to your dashboard', user: req.user });
  } else {
    res.status(401).json({ message: 'Please log in to view this page' });
  }
});

// Route to handle GET /users with privacy considerations
router.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // Retrieve a list of users from the database
      const users = await pool.query('SELECT username FROM users');
      res.status(200).json(users.rows); // Send the list of users as JSON
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving users', error: err });
    }
  } else {
    // If the user is not authenticated, prompt them to log in
    res.status(401).json({ message: 'Please log in to view the list of users.' });
  }
});

module.exports = router;
