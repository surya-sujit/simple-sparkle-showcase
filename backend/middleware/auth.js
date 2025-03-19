
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

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Check if user is an admin
    const admin = await Admin.findOne({ userId: user._id });
    
    // Check if user is a moderator
    const moderator = await Moderator.findOne({ userId: user._id });
    
    // Check if user is a worker
    const worker = await Worker.findOne({ userId: user._id });
    
    // Add user roles to request object
    user.isAdmin = !!admin;
    user.isModerator = !!moderator;
    user.isWorker = !!worker;
    
    // If user is an admin, add admin object to request
    if (admin) {
      user.adminDetails = admin;
    }
    
    // If user is a moderator, add moderator object to request
    if (moderator) {
      user.moderatorDetails = moderator;
    }
    
    // If user is a worker, add worker object to request
    if (worker) {
      user.workerDetails = worker;
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Admin middleware
exports.isAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin only',
    });
  }
  next();
};

// Moderator middleware
exports.isModerator = async (req, res, next) => {
  if (!req.user.isModerator && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Moderator or Admin only',
    });
  }
  next();
};

// Worker middleware
exports.isWorker = async (req, res, next) => {
  if (!req.user.isWorker && !req.user.isModerator && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Worker, Moderator or Admin only',
    });
  }
  next();
};
