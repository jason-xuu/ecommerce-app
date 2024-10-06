// controllers/productController.js
const pool = require('../server'); // Import the pool connection

// Controller to get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller to get product by ID
const getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [productId]);
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller to create a new product
const createProduct = async (req, res) => {
  const { name, description, price, size, color, material, category_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, size, color, material, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, size, color, material, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = { getAllProducts, getProductById, createProduct };
