import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay with your API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount, cartItems } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Store product IDs for later use
    const productIds = cartItems.map(item => item.prod_id);

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id.toString(),
        productIds: JSON.stringify(productIds)
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key_id: razorpay.key_id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// Verify Razorpay payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;
    
    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(sign)
      .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Get order details from Razorpay
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    
    let productIds = [];
    try {
      // Try to get from Razorpay notes
      productIds = JSON.parse(razorpayOrder.notes.productIds || '[]');
    } catch (err) {
      console.log('Failed to parse productIds from Razorpay notes, trying orderDetails');
      // Fallback to order details sent from frontend
      if (orderDetails && orderDetails.products) {
        productIds = orderDetails.products;
      }
    }

    // Ensure we have a user ID
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
     // Log information for debugging
     console.log('Inserting order with:');
     console.log('User ID:', userId);
     console.log('Amount:', parseFloat(razorpayOrder.amount / 100));
     console.log('Payment ID:', razorpay_payment_id);
     console.log('Product IDs:', productIds);

    // Create order in the database
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, order_amt, payment_method, payment_id, product_ids)
       VALUES ($1, $2, $3, $4, $5::integer[]) RETURNING *`,
      [
        req.user.id,
        parseFloat(razorpayOrder.amount / 100), // Convert back from paisa to rupees
        'Razorpay',
        razorpay_payment_id,
        productIds
      ]
    );

    const order = orderResult.rows[0];

   // Respond with success message and order details
    res.status(200).json({
      success: true,
      message: 'Payment verified and order created successfully',
      orderId: order.order_id,
      orderDetails: order
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed', 
      error: error.message 
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await razorpay.payments.fetch(id);
    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment' });
  }
};