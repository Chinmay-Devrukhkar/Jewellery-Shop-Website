import express from 'express';
import { 
  getUserWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../controllers/wishlistController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticateUser);

// Get current user's wishlist
router.get('/', getUserWishlist);

// Add item to wishlist
router.post('/add/:prodId', addToWishlist);

// Remove item from wishlist
router.delete('/remove/:prodId', removeFromWishlist);

export default router;