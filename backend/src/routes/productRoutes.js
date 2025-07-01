import express from 'express';
import {query} from '../db.js';


const router = express.Router();


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await query('SELECT * FROM products');
        res.json(products.rows);
    } catch (err) {
        console.log("Database error:",err);
        res.status(500).json({ error: err.message });
    }
});

// Get product by category
router.get('/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const product = await query('SELECT * FROM products WHERE category = $1', [category]);
        
        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product.rows);
    } catch (err) {
        console.log("Database error:",err);
        res.status(500).json({ error: err.message });
    }
});

// Add new product
router.post('/', async (req, res) => {
    try {
        const { name, description, price, category, stock_quantity, image_url } = req.body;
        const newProduct = await query(
            'INSERT INTO products (name, description, price, category, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, category, stock_quantity, image_url]
        );
        
        res.json(newProduct.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export { router as default };  