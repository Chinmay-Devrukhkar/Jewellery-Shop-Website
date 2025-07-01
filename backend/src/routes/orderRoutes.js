import express from 'express';
import { getUserOrders, getOrderById, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import authenticate from '../middleware/authenticate.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Get all orders for the logged-in user
router.get('/', getUserOrders);

// Get a specific order by ID
router.get('/:id', getOrderById);

// Cancel an order (user can cancel their own orders)
router.put('/:id/cancel', cancelOrder);

// Admin-only routes
router.put('/:id/status', isAdmin, updateOrderStatus);

export default router;