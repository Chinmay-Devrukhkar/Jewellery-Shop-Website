import express from 'express';
import pkg from 'pg';

const {Pool} = pkg;
const router = express.Router();

// Database configuration (use your existing pool)
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: parseInt(process.env.DB_PORT)
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Get user's cart
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Fetch cart items with product details
    const result = await pool.query(`
      SELECT 
        c.cart_id, 
        c.user_id, 
        c.prod_id, 
        p.name, 
        p.price, 
        p.discount, 
        p.metal, 
        p.krt_purt, 
        p.images
      FROM 
        cart c
      JOIN 
        products p ON c.prod_id = p.prod_id
      WHERE 
        c.user_id = $1
    `, [userId]);
    
    // Transform to match the format used by the frontend
    const cartItems = result.rows.map(item => ({
      prod_id: item.prod_id,
      name: item.name,
      price: parseFloat(item.price),
      discount: parseFloat(item.discount),
      metal: item.metal,
      krt_purt: item.krt_purt,
      images: item.images
    }));
    
    res.status(200).json({ cart: cartItems });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user's cart (replace entire cart)
router.post('/', isAuthenticated, async (req, res) => {
  const { cart } = req.body;
  const userId = req.session.user.id;
  
  // Begin transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Delete existing cart items
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    
    // Insert new cart items
    if (cart && cart.length > 0) {
      // Handle the UNIQUE constraint on prod_id
      for (const item of cart) {
        try {
          await client.query(
            'INSERT INTO cart (user_id, prod_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)',
            [userId, item.prod_id]
          );
        } catch (insertErr) {
          // If it's a unique constraint violation, skip this item
          if (insertErr.code === '23505') { // PostgreSQL unique violation code
            console.warn(`Product ${item.prod_id} already exists in someone's cart, skipping`);
            continue;
          }
          throw insertErr; // Re-throw other errors
        }
      }
    }
    
    await client.query('COMMIT');
    
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    client.release();
  }
});

// Merge local cart with server cart
router.post('/merge', isAuthenticated, async (req, res) => {
  const { localCart } = req.body;
  const userId = req.session.user.id;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get existing cart items
    const existingCartResult = await client.query(
      'SELECT prod_id FROM cart WHERE user_id = $1',
      [userId]
    );
    
    const existingProductIds = existingCartResult.rows.map(row => row.prod_id);
    
    // Filter out duplicates from local cart
    const newItems = localCart.filter(item => !existingProductIds.includes(item.prod_id));
    
    // Insert new items
    if (newItems.length > 0) {
      for (const item of newItems) {
        try {
          await client.query(
            'INSERT INTO cart (user_id, prod_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)',
            [userId, item.prod_id]
          );
        } catch (insertErr) {
          // If it's a unique constraint violation, skip this item
          if (insertErr.code === '23505') {
            console.warn(`Product ${item.prod_id} already exists in someone's cart, skipping`);
            continue;
          }
          throw insertErr; // Re-throw other errors
        }
      }
    }
    
    // Get updated cart
    const updatedCartResult = await client.query(`
      SELECT 
        c.cart_id, 
        c.user_id, 
        c.prod_id, 
        p.name, 
        p.price, 
        p.discount, 
        p.metal, 
        p.krt_purt, 
        p.images
      FROM 
        cart c
      JOIN 
        products p ON c.prod_id = p.prod_id
      WHERE 
        c.user_id = $1
    `, [userId]);
    
    // Transform to match frontend format
    const cartItems = updatedCartResult.rows.map(item => ({
      prod_id: item.prod_id,
      name: item.name,
      price: parseFloat(item.price),
      discount: parseFloat(item.discount),
      metal: item.metal,
      krt_purt: item.krt_purt,
      images: item.images
    }));
    
    await client.query('COMMIT');
    
    res.status(200).json({ 
      message: 'Carts merged successfully', 
      cart: cartItems 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error merging carts:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    client.release();
  }
});

// Clear user's cart
router.delete('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add item to cart (individual item)
router.post('/item', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.session.user.id;

    console.log('Adding item to cart - User ID:', userId, 'Product ID:', productId);
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Check if product exists first
    const productCheck = await pool.query('SELECT prod_id FROM products WHERE prod_id = $1', [productId]);
    
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if item already exists
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND prod_id = $2',
      [userId, productId]
    );
    
    console.log('Existing item check result:', existingItem.rows);

    if (existingItem.rows.length === 0) {
      try {
        console.log('Attempting to insert new cart item');
        // Add item if it doesn't exist
        const insertResult = await pool.query(
          'INSERT INTO cart (user_id, prod_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *',
          [userId, productId]
        );
        console.log('Insert result:', insertResult.rows[0]);
        
        return res.status(201).json({ 
          message: 'Item added to cart',
          item: insertResult.rows[0]
        });
      } catch (insertErr) {
        console.error('Insert error details:', insertErr);

        // Handle unique constraint violation
        if (insertErr.code === '23505') {
          return res.status(409).json({ 
            message: 'This product is already in your cart or cannot be added due to a constraint' 
          });
        }
        throw insertErr;
      }
    } else {
      return res.status(200).json({ 
        message: 'Item already in cart',
        item: existingItem.rows[0]
      });
    }
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Remove item from cart
router.delete('/item/:productId', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.session.user.id;
    
    await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND prod_id = $2',
      [userId, productId]
    );
    
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing item from cart:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;