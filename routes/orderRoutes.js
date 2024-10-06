// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Define the routes
router.get('/', orderController.getAllOrders);          // Get all orders
router.get('/:id', orderController.getOrderById);       // Get an order by ID
router.post('/', orderController.createOrder);          // Create a new order

module.exports = router;
