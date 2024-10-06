// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define the routes
router.get('/', productController.getAllProducts);      // Get all products
router.get('/:id', productController.getProductById);   // Get a product by ID
router.post('/', productController.createProduct);      // Create a new product

module.exports = router;
