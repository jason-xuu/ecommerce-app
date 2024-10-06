// controllers/orderController.js
const pool = require('../server'); // Import the pool connection

// Controller to get all orders
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller to get order by ID
const getOrderById = async (req, res) => {
  const orderId = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (result.rows.length === 0) {
      return res.status(404).send('Order not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller to create a new order
const createOrder = async (req, res) => {
  const { user_id, total_amount, order_status, payment_status, delivery_address } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, total_amount, order_status, payment_status, delivery_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, total_amount, order_status, payment_status, delivery_address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = { getAllOrders, getOrderById, createOrder };
