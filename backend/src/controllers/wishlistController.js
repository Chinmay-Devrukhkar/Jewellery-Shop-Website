import pool from '../db.js';

/**
 * Get the current user's wishlist
 * @route GET /api/wishlist
 * @access Private
 */
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    // Join with products table to get product details
    const query = `
      SELECT w.id, w.user_id, w.prod_id, w.added_at,
             p.name, p.price, p.description, p.image_url
      FROM wishlist w
      JOIN products p ON w.prod_id = p.prod_id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
};

/**
 * Add a product to user's wishlist
 * @route POST /api/wishlist/add/:prodId
 * @access Private
 */
export const addToWishlist = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const prodId = parseInt(req.params.prodId);
    
    // Check if product exists
    const productCheck = await client.query(
      'SELECT prod_id FROM products WHERE prod_id = $1',
      [prodId]
    );
    
    if (productCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if item is already in wishlist
    const existingItem = await client.query(
      'SELECT id FROM wishlist WHERE user_id = $1 AND prod_id = $2',
      [userId, prodId]
    );
    
    if (existingItem.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }
    
    // Add to wishlist
    const insertQuery = `
      INSERT INTO wishlist (user_id, prod_id)
      VALUES ($1, $2)
      RETURNING id, user_id, prod_id, added_at
    `;
    
    const { rows } = await client.query(insertQuery, [userId, prodId]);
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist'
    });
  } finally {
    client.release();
  }
};

/**
 * Remove a product from user's wishlist
 * @route DELETE /api/wishlist/remove/:prodId
 * @access Private
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const prodId = parseInt(req.params.prodId);
    
    const query = `
      DELETE FROM wishlist
      WHERE user_id = $1 AND prod_id = $2
      RETURNING id
    `;
    
    const { rows } = await pool.query(query, [userId, prodId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: { id: rows[0].id }
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist'
    });
  }
};