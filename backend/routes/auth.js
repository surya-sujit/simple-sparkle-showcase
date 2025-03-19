
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const Moderator = require('../models/Moderator');
const Worker = require('../models/Worker');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, country, city, phone } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    user = await User.create({
      username,
      email,
      password,
      country,
      city,
      phone
    });

    // Create token
    const token = user.getSignedJwtToken();

    // Don't send the password back
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is an admin
    const admin = await Admin.findOne({ userId: user._id });
    
    // Check if user is a moderator
    const moderator = await Moderator.findOne({ userId: user._id });
    
    // Check if user is a worker
    const worker = await Worker.findOne({ userId: user._id });
    
    // Create user object to send back (without password)
    const userObject = user.toObject();
    delete userObject.password;
    
    // Add role information
    userObject.isAdmin = !!admin;
    userObject.isModerator = !!moderator;
    userObject.isWorker = !!worker;
    
    // Add details if applicable
    if (admin) userObject.adminDetails = admin;
    if (moderator) userObject.moderatorDetails = moderator;
    if (worker) userObject.workerDetails = worker;

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: userObject
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user is an admin
    const admin = await Admin.findOne({ userId: user._id });
    
    // Check if user is a moderator
    const moderator = await Moderator.findOne({ userId: user._id });
    
    // Check if user is a worker
    const worker = await Worker.findOne({ userId: user._id });
    
    // Create user object to send back
    const userObject = user.toObject();
    
    // Add role information
    userObject.isAdmin = !!admin;
    userObject.isModerator = !!moderator;
    userObject.isWorker = !!worker;
    
    // Add details if applicable
    if (admin) userObject.adminDetails = admin;
    if (moderator) userObject.moderatorDetails = moderator;
    if (worker) userObject.workerDetails = worker;

    res.status(200).json(userObject);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Log user out / clear cookie
// @access  Private
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

module.exports = router;
