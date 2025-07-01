import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

//admin logout route
router.post('/logout', adminController.logoutAdmin); 
    
// All routes protected by admin authentication middleware
router.use(isAdmin);

// Check admin authentication status
router.get('/check-auth', (req, res) => {
    res.status(200).json({ message: 'Authenticated as admin' });
  });

// Product routes
router.get('/products', adminController.getAllProducts);
router.get('/products/:id', adminController.getProductById);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Order routes
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderById);
router.patch('/orders/:id/status', adminController.updateOrderStatus);


export default router;