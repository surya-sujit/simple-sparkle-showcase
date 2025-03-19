
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Moderator = require('../models/Moderator');
const Worker = require('../models/Worker');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Check if user is an admin
      const admin = await Admin.findOne({ userId: req.user.id });
      if (admin && roles.includes('admin')) {
        return next();
      }

      // Check if user is a moderator
      const moderator = await Moderator.findOne({ userId: req.user.id });
      if (moderator && roles.includes('moderator')) {
        return next();
      }

      // Check if user is a worker
      const worker = await Worker.findOne({ userId: req.user.id });
      if (worker && roles.includes('worker')) {
        return next();
      }

      // If user doesn't have any of the required roles
      if (roles.includes('user')) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `User role not authorized to access this route`
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };
};
