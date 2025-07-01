// Session-based middleware to check if user is authenticated and is an admin
export const isAdmin = (req, res, next) => {  
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    // Check if user is an admin
    if (!req.session.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    // User is authenticated and is an admin
    next();
  };