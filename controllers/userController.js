// controllers/userController.js
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const pool = require('../db'); // Import the pool connection

// Controller to get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller to get user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller to create a new user
const createUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  // Validate input
  if (!username || !password || !email || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists (by username or email)
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, email, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller for user registration
const registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  // Ensure all fields are provided
  if (!username || !password || !email || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, email, role]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if both fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // Passwords match, log in the user (create a session, if using sessions)
      req.login(user, (err) => {
        if (err) {
          return res.status(500).send('Server Error');
        }
        return res.status(200).json({
          message: 'Login successful',
          user: { id: user.user_id, username: user.username, email: user.email, role: user.role }
        });
      });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = { getAllUsers, getUserById, createUser, registerUser, loginUser };
