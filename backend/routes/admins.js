
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/admins
// @desc    Get all admins
// @access  Private (Admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const admins = await Admin.find()
      .populate('userId', 'username email phone img');
    
    res.status(200).json(admins);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/admins/:id
// @desc    Get single admin
// @access  Private (Admin only)
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .populate('userId', 'username email phone img');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: `No admin with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/admins
// @desc    Create admin
// @access  Private (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { userId, superAdmin, permissions } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${userId}`
      });
    }
    
    // Check if admin for this user already exists
    let admin = await Admin.findOne({ userId });
    
    if (admin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this user already exists'
      });
    }
    
    // Create admin
    admin = await Admin.create({
      userId,
      superAdmin: superAdmin || false,
      permissions: permissions || {
        manageUsers: true,
        manageHotels: true,
        manageModerators: true,
        viewReports: true
      }
    });
    
    // Populate user
    const populatedAdmin = await Admin.findById(admin._id)
      .populate('userId', 'username email phone img');
    
    res.status(201).json(populatedAdmin);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/admins/:id
// @desc    Update admin
// @access  Private (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    // Prevent non-super admins from modifying super admins
    if (!req.user.adminDetails.superAdmin) {
      const admin = await Admin.findById(req.params.id);
      if (admin && admin.superAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only super admins can modify other super admins'
        });
      }
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'username email phone img');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: `No admin with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/admins/:id
// @desc    Delete admin
// @access  Private (Super Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    // Only super admins can delete other admins
    if (!req.user.adminDetails.superAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can delete admins'
      });
    }
    
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: `No admin with the id of ${req.params.id}`
      });
    }
    
    // Prevent deleting yourself
    if (admin.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admins cannot delete themselves'
      });
    }
    
    // Delete admin
    await admin.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/admins/me
// @desc    Get current admin profile
// @access  Private (Admin only)
router.get('/profile/me', protect, isAdmin, async (req, res) => {
  try {
    const admin = await Admin.findOne({ userId: req.user._id })
      .populate('userId', 'username email phone img');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }
    
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
