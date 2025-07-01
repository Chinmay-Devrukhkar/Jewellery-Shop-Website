import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy } from 'passport-local';
import { body, validationResult } from 'express-validator';
import pool,{query} from '../db.js';

const router = express.Router();
const saltRounds = 10;

// Simple authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Use it to protect routes
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, full_name, contact_no,address FROM users WHERE id = $1', 
      [req.session.user.id]
    );
    
    if (result.rows.length > 0) {
      return res.status(200).json({ user: result.rows[0] });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//auth status 
router.get('/auth-status', async (req, res) => {
  try {
    
    if (req.session && req.session.user) {
      // Optionally re-validate user exists in database
      let userCheck;
      if (req.session.user.isAdmin) {
        userCheck = await query('SELECT * FROM admin WHERE id = $1', [req.session.user.id]);
      } else {
        userCheck = await query('SELECT * FROM users WHERE id = $1', [req.session.user.id]);
      }

      if (userCheck.rows.length > 0) {
        return res.json({
          isAuthenticated: true,
          user: req.session.user,
          isAdmin: req.session.user.isAdmin || false
        });
      }
    }

    // If no valid session
    return res.json({ 
      isAuthenticated: false, 
      user: null, 
      isAdmin: false 
    });
  } catch (error) {
    console.error('Auth Status Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});


//login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check regular users first
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      
      if (match) {
        req.session.user = {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          contactNo: user.contact_no,
          isAdmin: false
        };
        req.session.isAuthenticated = true;

        return req.session.save(err => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: "Session error", error: err.message });
          }
          
          const userData = { ...user };
          delete userData.password_hash;
          
          return res.status(200).json({
            message: "Login successful!",
            user: userData,
            isAdmin: false
          });
        });
      }
    }

    // Check admin if user not found
    const adminResult = await query('SELECT * FROM admin WHERE username = $1', [email]);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      const match = await bcrypt.compare(password, admin.hash_password);
      
      if (match) {
        req.session.user = {
          id: admin.id,
          username: admin.username,
          isAdmin: true
        };
        req.session.isAuthenticated = true;

        return req.session.save(err => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: "Session error", error: err.message });
          }
          
          const adminData = { ...admin };
          delete adminData.hash_password;
          
          return res.status(200).json({
            message: "Admin login successful!",
            user: adminData,
            isAdmin: true
          });
        });
      }
    }

    // If no match found in either table
    return res.status(404).json({ message: "Invalid credentials" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Signup route
router.post('/signup', [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, full_name, phone } = req.body;

  try {
    const checkResult = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      
      const result = await query(
        "INSERT INTO users (email, password_hash, full_name, contact_no) VALUES ($1, $2, $3, $4) RETURNING *",
        [email, hash, full_name, phone]
      );
      
      const user = result.rows[0];
      
      // Set up session after successful signup
      req.session.user = {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        contactNo: user.contact_no
      };
      req.session.isAuthenticated = true;
      
      // Remove password hash before sending response
      delete user.password_hash;
      
      return res.status(201).json({
        message: "Signup successful!",
        user
      });
    }
  } catch (err) {
    console.error("Detailed error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put('/update-profile', isAuthenticated, [
  body("email").isEmail().withMessage("Invalid email"),
  body("full_name").notEmpty().withMessage("Name is required"),
  body("contact_no").matches(/^\d{10}$/).withMessage("Please enter a valid 10-digit phone number"),
  body("address").notEmpty().withMessage("Address is required"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { full_name, contact_no, email, address } = req.body;
  const userId = req.session.user.id;

  try {
    // If email is being changed, check if new email already exists for another user
    if (email !== req.session.user.email) {
      const checkResult = await query(
        "SELECT * FROM users WHERE email = $1 AND id != $2", 
        [email, userId]
      );

      if (checkResult.rows.length > 0) {
        return res.status(409).json({ message: "Email already in use by another account" });
      }
    }

    // Update user data
    const result = await query(
      `UPDATE users 
       SET full_name = $1, contact_no = $2, email = $3, address = $4 
       WHERE id = $5 
       RETURNING id, email, full_name, contact_no, address`,
      [full_name, contact_no, email, address, userId]
    );

    if (result.rows.length > 0) {
      const updatedUser = result.rows[0];
      
      // Update session data
      req.session.user = {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.full_name,
        contactNo: updatedUser.contact_no,
        address: updatedUser.address,
        isAdmin: req.session.user.isAdmin || false
      };

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    return res.status(200).json({ message: 'Logout successful' });
  });
});

export default router;