
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admins
// @desc    Get all admins
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const admins = await Admin.find().populate('userId', 'username email');
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/admins/:id
// @desc    Get single admin
// @access  Private/Admin
router.get('/:id', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('userId', 'username email country city phone');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/admins
// @desc    Create admin
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    const { userId, superAdmin, permissions } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ userId });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'This user is already an admin'
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const admin = await Admin.create({
      userId,
      superAdmin: superAdmin || false,
      permissions
    });
    
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/admins/:id
// @desc    Update admin
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const { superAdmin, permissions } = req.body;
    
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    // Update fields
    if (superAdmin !== undefined) admin.superAdmin = superAdmin;
    if (permissions) admin.permissions = permissions;
    
    await admin.save();
    
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/admins/:id
// @desc    Delete admin
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    await admin.remove();
    
    res.status(200).json({
      success: true,
      message: 'Admin removed'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/admins/profile/me
// @desc    Get current admin profile
// @access  Private/Admin
router.get('/profile/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findOne({ userId: req.user.id }).populate('userId', 'username email country city phone');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }
    
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
