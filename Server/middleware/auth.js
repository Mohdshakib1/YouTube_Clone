import jwt from 'jsonwebtoken';
import User from '../Models/Auth.js';

const auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Authorization token required' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // 4. Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ 
      success: false,
      message: error.name === 'TokenExpiredError' 
        ? 'Token expired' 
        : 'Invalid token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default auth;