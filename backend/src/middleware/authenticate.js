const authenticate = (req, res, next) => {
    // Check if user is logged in
    if (!req.session.user) {
      console.log('Authentication failed: No user in session');
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    // Add user to request object for convenience
    req.user = req.session.user;
    console.log('User authenticated:', req.user.id);
    // User is authenticated
    next();
  };
 export default authenticate;