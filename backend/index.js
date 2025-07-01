import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './src/routes/productRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import cartRoutes from './src/controllers/cartController.js'
// import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { isAdmin } from './src/middleware/authMiddleware.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend url
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Session config
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Helps protect against XSS attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));



// // Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin',isAdmin, adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Debug middleware for session tracking
app.use((req, res, next) => {
  console.log('Session ID:', req.session.id);
  console.log('User in session:', req.session.user);
  next();
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});