import pool from '../db.js';

// PRODUCT CONTROLLERS

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY prod_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ message: 'Failed to get products', error: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE prod_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting product:', err);
    res.status(500).json({ message: 'Failed to get product', error: err.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      name, price, descrp, metal, krt_purt, 
      category, gender, images, weight, discount 
    } = req.body;
    
    // Handle images as string array
    const imageArray = Array.isArray(images) ? images : [images];
    
    const result = await client.query(
      `INSERT INTO products(name, price, descrp, metal, krt_purt, category, gender, images, weight, discount, created_at) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [name, price, descrp, metal, krt_purt, category, gender, imageArray, weight, discount]
    );
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  } finally {
    client.release();
  }
};

// Update product
export const updateProduct = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { 
      name, price, descrp, metal, krt_purt, 
      category, gender, images, weight, discount 
    } = req.body;
    
    // Handle images as string array
    const imageArray = Array.isArray(images) ? images : [images];
    
    const result = await client.query(
      `UPDATE products SET 
        name = $1, 
        price = $2, 
        descrp = $3, 
        metal = $4, 
        krt_purt = $5, 
        category = $6, 
        gender = $7, 
        images = $8, 
        weight = $9, 
        discount = $10
      WHERE prod_id = $11 
      RETURNING *`,
      [name, price, descrp, metal, krt_purt, category, gender, imageArray, weight, discount, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  } finally {
    client.release();
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Check if product exists
    const checkResult = await client.query('SELECT * FROM products WHERE prod_id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete the product
    const result = await client.query('DELETE FROM products WHERE prod_id = $1 RETURNING *', [id]);
    
    await client.query('COMMIT');
    res.json({ message: 'Product deleted successfully', deletedProduct: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  } finally {
    client.release();
  }
};

// ORDER CONTROLLERS

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    // Join with users table to get user details
    const result = await pool.query(`
      SELECT o.*, 
             u.full_name, u.email, u.contact_no, u.address
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.order_date DESC
    `);
    
    // Format the response
    const orders = result.rows.map(row => {
      return {
        order_id: row.order_id,
        order_date: row.order_date,
        order_amt: row.order_amt,
        user_id: row.user_id,
        order_status: row.order_status,
        payment_method: row.payment_method,
        payment_id: row.payment_id,
        user: {
          full_name: row.full_name,
          email: row.email,
          contact_no: row.contact_no,
          address: row.address
        }
      };
    });
    
    res.json(orders);
  } catch (err) {
    console.error('Error getting orders:', err);
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
};

// Get order by ID with items
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order details
    const orderResult = await pool.query(`
      SELECT o.*, 
             u.full_name, u.email, u.contact_no, u.address
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.order_id = $1
    `, [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const orderData = orderResult.rows[0];
    
    // Get order items
    const itemsResult = await pool.query(`
      SELECT oi.*, p.name, p.images
      FROM order_items oi
      JOIN products p ON oi.prod_id = p.prod_id
      WHERE oi.order_id = $1
    `, [id]);
    
    // Format the response
    const order = {
      order_id: orderData.order_id,
      order_date: orderData.order_date,
      order_amt: orderData.order_amt,
      user_id: orderData.user_id,
      order_status: orderData.order_status,
      payment_method: orderData.payment_method,
      payment_id: orderData.payment_id,
      user: {
        full_name: orderData.full_name,
        email: orderData.email,
        contact_no: orderData.contact_no,
        address: orderData.address
      },
      items: itemsResult.rows.map(item => ({
        prod_id: item.prod_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.images
      }))
    };
    
    res.json(order);
  } catch (err) {
    console.error('Error getting order details:', err);
    res.status(500).json({ message: 'Failed to get order details', error: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status', 
        validStatuses 
      });
    }
    
    const result = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};

//Logout admin function
export const logoutAdmin = async (req, res) => {
  try {
    // Clear admin session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Failed to logout', error: err.message });
      }
      
      // Clear the cookie
      res.clearCookie('connect.sid'); // Adjust cookie name if you're using a different one
      
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Failed to logout', error: err.message });
  }
};