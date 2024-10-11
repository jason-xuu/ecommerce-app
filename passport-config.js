const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./db'); // Adjust the path as necessary

// Configure the local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Query the database to find the user
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      // Compare the password with the hash stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      // Successful login
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.user_id); // Store user ID in session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    const user = result.rows[0];
    done(null, user); // Attach user to request
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
