import pool from '../db.js';

// Get all orders for the logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY order_date DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE order_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Update order status (for admin use)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const result = await pool.query(
      `UPDATE orders 
       SET order_status = $1 
       WHERE order_id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

// Cancel an order (user can cancel their own orders)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First check if the order exists and belongs to the user
    const checkResult = await pool.query(
      `SELECT * FROM orders 
       WHERE order_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if the order can be cancelled (not delivered or already cancelled)
    const order = checkResult.rows[0];
    if (order.order_status === 'Delivered' || order.order_status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.order_status}`
      });
    }

    // Update the order status to 'Cancelled'
    const result = await pool.query(
      `UPDATE orders 
       SET order_status = 'Cancelled' 
       WHERE order_id = $1 
       RETURNING *`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};