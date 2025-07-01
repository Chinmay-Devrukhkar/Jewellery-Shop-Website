import pool from '../db.js';

class OrderModel {
  /**
   * Create a new order in the database
   * @param {Object} orderData Order data including user_id, order_amt, etc.
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    const { 
      user_id, 
      order_amt, 
      product_ids, 
      payment_method = 'Razorpay',
      order_status = 'Pending',
      razorpay_order_id
    } = orderData;

    try {
      console.log('Creating order with data:', {
        user_id,
        order_amt,
        product_ids,
        payment_method,
        order_status,
        razorpay_order_id
      });

      // Validate product_ids is an array of integers
      if (!Array.isArray(product_ids)) {
        throw new Error('product_ids must be an array');
      }

      // Ensure all product IDs are integers
      const validProductIds = product_ids.map(id => {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
          throw new Error(`Invalid product ID: ${id}`);
        }
        return parsedId;
      });
      
      const query = `
        INSERT INTO orders (
          user_id, 
          order_amt, 
          product_ids, 
          payment_method, 
          order_status,
          razorpay_order_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
      `;
      
      const values = [user_id, order_amt, validProductIds, payment_method, order_status, razorpay_order_id];
      console.log('Executing query with values:', values);
      
      const result = await pool.query(query, values);
      console.log('Order created successfully:', result.rows[0]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating order in database:', error);
      // Check for specific PostgreSQL errors
      if (error.code === '23505') {
        throw new Error('Duplicate order ID');
      } else if (error.code === '23503') {
        throw new Error('Referenced user or product does not exist');
      } else if (error.code === '22P02') {
        throw new Error('Invalid data type in order data');
      }
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Update an existing order in the database
   * @param {number} orderId ID of the order to update
   * @param {Object} updateData Data to update
   * @returns {Promise<Object>} Updated order
   */
  async updateOrder(orderId, updateData) {
    try {
      console.log(`Updating order ID ${orderId} with data:`, updateData);
      // Build the SET part of the query dynamically based on updateData
      const setFields = [];
      const values = [orderId]; // First value is the order_id for WHERE clause
      let valueIndex = 2; // Start from $2 since $1 is already used for order_id
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setFields.push(`${key} = $${valueIndex}`);
          values.push(value);
          valueIndex++;
        }
      });
      
      if (setFields.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      const query = `
        UPDATE orders 
        SET ${setFields.join(', ')}, 
            updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $1 
        RETURNING *
      `;
      
      console.log('Executing update query with values:', values);
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      
      console.log('Order updated successfully:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error(`Failed to update order: ${error.message}`);
    }
  }

  /**
   * Get an order by ID
   * @param {number} orderId Order ID
   * @returns {Promise<Object>} Order data
   */
  async getOrderById(orderId) {
    try {
      console.log(`Getting order details for ID: ${orderId}`);
      const query = `
        SELECT o.*, u.email, u.full_name, u.contact_no 
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.order_id = $1
      `;
      
      const result = await pool.query(query, [orderId]);
      
      if (result.rows.length === 0) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  /**
   * Get all orders for a user
   * @param {number} userId User ID
   * @returns {Promise<Array>} List of orders
   */
  async getOrdersByUserId(userId) {
    try {
      console.log(`Getting orders for user ID: ${userId}`);
      const query = `
        SELECT * FROM orders
        WHERE user_id = $1
        ORDER BY order_date DESC
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error(`Failed to fetch user orders: ${error.message}`);
    }
  }
}

export default new OrderModel();