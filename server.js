// server.js
const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the eCommerce app!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
