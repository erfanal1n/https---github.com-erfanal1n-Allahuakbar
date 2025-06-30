const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/secret');
const User = require('../model/User');

// Rate limiting for chat endpoints
const chatRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Too many chat requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting for file uploads
const uploadRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 uploads per 5 minutes
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.'
  }
});

// Optional authentication middleware (doesn't require auth but extracts user if available)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, secret.jwt_secret);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail if token is invalid, just proceed without user
    next();
  }
};

// Require admin authentication
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, secret.jwt_secret);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
      error: error.message
    });
  }
};

// Content moderation middleware (basic implementation)
const moderateContent = (req, res, next) => {
  const { message, content } = req.body;
  const textToCheck = message || content || '';
  
  // Basic profanity filter (you can expand this)
  const forbiddenWords = ['spam', 'scam', 'fake', 'fraud'];
  const containsForbiddenWords = forbiddenWords.some(word => 
    textToCheck.toLowerCase().includes(word.toLowerCase())
  );
  
  if (containsForbiddenWords) {
    return res.status(400).json({
      success: false,
      message: 'Message contains inappropriate content.'
    });
  }
  
  next();
};

// File validation middleware
const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded.'
    });
  }
  
  // Additional file validation can be added here
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds 10MB limit.'
    });
  }
  
  next();
};

// IP tracking middleware
const trackIP = (req, res, next) => {
  req.clientIP = req.ip || 
                req.connection.remoteAddress || 
                req.socket.remoteAddress ||
                (req.connection.socket ? req.connection.socket.remoteAddress : null);
  next();
};

// Session tracking middleware for guests
const trackSession = (req, res, next) => {
  // Extract session info from headers or cookies
  req.sessionInfo = {
    userAgent: req.get('User-Agent'),
    referrer: req.get('Referer'),
    ip: req.clientIP
  };
  next();
};

module.exports = {
  chatRateLimit,
  uploadRateLimit,
  optionalAuth,
  requireAdmin,
  moderateContent,
  validateFile,
  trackIP,
  trackSession
};
