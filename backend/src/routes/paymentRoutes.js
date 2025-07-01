import express from 'express';
import { createOrder, verifyPayment, getPaymentById } from '../controllers/paymentController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);

// Create a Razorpay order
router.post('/create-order', createOrder);

// Verify payment and create order
router.post('/verify', verifyPayment);

// Get payment by ID
router.get('/:id', getPaymentById);

export default router;