
const express = require('express');
const router = express.Router();
const Moderator = require('../models/Moderator');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/moderators
// @desc    Get all moderators
// @access  Private (Admin only)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const moderators = await Moderator.find()
      .populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address');
    
    res.status(200).json(moderators);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/:id
// @desc    Get single moderator
// @access  Private (Admin only)
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const moderator = await Moderator.findById(req.params.id)
      .populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: `No moderator with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/moderators
// @desc    Create moderator
// @access  Private (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { userId, assignedHotels, permissions } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user with the id of ${userId}`
      });
    }
    
    // Check if moderator for this user already exists
    let moderator = await Moderator.findOne({ userId });
    
    if (moderator) {
      return res.status(400).json({
        success: false,
        message: 'Moderator with this user already exists'
      });
    }
    
    // Validate hotels
    if (assignedHotels && assignedHotels.length > 0) {
      for (const hotelId of assignedHotels) {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
          return res.status(404).json({
            success: false,
            message: `No hotel with the id of ${hotelId}`
          });
        }
      }
    }
    
    // Create moderator
    moderator = await Moderator.create({
      userId,
      assignedHotels: assignedHotels || [],
      isActive: true,
      permissions: permissions || {
        canManageWorkers: true,
        canManageRooms: true,
        canViewBookings: true
      }
    });
    
    // Populate user and hotels
    const populatedModerator = await Moderator.findById(moderator._id)
      .populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address');
    
    res.status(201).json(populatedModerator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/moderators/:id
// @desc    Update moderator
// @access  Private (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    // Validate hotels if updating
    if (req.body.assignedHotels && req.body.assignedHotels.length > 0) {
      for (const hotelId of req.body.assignedHotels) {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
          return res.status(404).json({
            success: false,
            message: `No hotel with the id of ${hotelId}`
          });
        }
      }
    }
    
    const moderator = await Moderator.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: `No moderator with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/moderators/:id
// @desc    Delete moderator
// @access  Private (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const moderator = await Moderator.findById(req.params.id);
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: `No moderator with the id of ${req.params.id}`
      });
    }
    
    // Delete moderator
    await moderator.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Moderator deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/me
// @desc    Get current moderator profile
// @access  Private (Moderator only)
router.get('/profile/me', protect, async (req, res) => {
  try {
    // If user is not a moderator
    if (!req.user.isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized - not a moderator'
      });
    }
    
    const moderator = await Moderator.findOne({ userId: req.user._id })
      .populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address type photos rating cheapestPrice');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator profile not found'
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/user/:userId
// @desc    Get moderator by user ID
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Check if user is admin or the user themselves
    if (!req.user.isAdmin && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this moderator'
      });
    }
    
    const moderator = await Moderator.findOne({ userId: req.params.userId })
      .populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address type photos rating cheapestPrice');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/hotel/:hotelId
// @desc    Get moderators for a specific hotel
// @access  Private (Admin only)
router.get('/hotel/:hotelId', protect, isAdmin, async (req, res) => {
  try {
    const moderators = await Moderator.find({ 
      assignedHotels: { $in: [req.params.hotelId] } 
    })
      .populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address');
    
    res.status(200).json(moderators);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/moderators/:id/hotels
// @desc    Assign hotels to moderator
// @access  Private (Admin only)
router.put('/:id/hotels', protect, isAdmin, async (req, res) => {
  try {
    const { hotelIds } = req.body;
    
    if (!hotelIds || !Array.isArray(hotelIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of hotel IDs'
      });
    }
    
    // Validate all hotel IDs
    for (const hotelId of hotelIds) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: `No hotel with the id of ${hotelId}`
        });
      }
    }
    
    const moderator = await Moderator.findByIdAndUpdate(
      req.params.id,
      { $set: { assignedHotels: hotelIds } },
      { new: true, runValidators: true }
    ).populate('userId', 'username email phone img')
      .populate('assignedHotels', 'name city address');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: `No moderator with the id of ${req.params.id}`
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
