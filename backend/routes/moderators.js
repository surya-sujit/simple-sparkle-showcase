
const express = require('express');
const router = express.Router();
const Moderator = require('../models/Moderator');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const { protect } = require('../middleware/auth');

// @route   GET /api/moderators
// @desc    Get all moderators
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const moderators = await Moderator.find()
      .populate('userId', 'username email')
      .populate('assignedHotels', 'name city');
    
    res.status(200).json(moderators);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/:id
// @desc    Get single moderator
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const moderator = await Moderator.findById(req.params.id)
      .populate('userId', 'username email country city phone')
      .populate('assignedHotels', 'name city address');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/moderators
// @desc    Create moderator
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, isActive, assignedHotels, permissions } = req.body;
    
    // Check if moderator already exists
    const existingModerator = await Moderator.findOne({ userId });
    
    if (existingModerator) {
      return res.status(400).json({
        success: false,
        message: 'This user is already a moderator'
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
    
    // Check if all hotels exist
    if (assignedHotels && assignedHotels.length > 0) {
      for (const hotelId of assignedHotels) {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
          return res.status(404).json({
            success: false,
            message: `Hotel with id ${hotelId} not found`
          });
        }
      }
    }
    
    const moderator = await Moderator.create({
      userId,
      isActive: isActive !== undefined ? isActive : true,
      assignedHotels: assignedHotels || [],
      permissions
    });
    
    res.status(201).json(moderator);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/moderators/:id
// @desc    Update moderator
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { isActive, assignedHotels, permissions } = req.body;
    
    const moderator = await Moderator.findById(req.params.id);
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }
    
    // Update fields
    if (isActive !== undefined) moderator.isActive = isActive;
    if (assignedHotels) moderator.assignedHotels = assignedHotels;
    if (permissions) moderator.permissions = permissions;
    
    await moderator.save();
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/moderators/:id
// @desc    Delete moderator
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const moderator = await Moderator.findById(req.params.id);
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }
    
    await moderator.remove();
    
    res.status(200).json({
      success: true,
      message: 'Moderator removed'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/user/:userId
// @desc    Get moderator by user id
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const moderator = await Moderator.findOne({ userId: req.params.userId })
      .populate('userId', 'username email country city phone')
      .populate('assignedHotels', 'name city address');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/hotel/:hotelId
// @desc    Get moderators by hotel id
// @access  Private
router.get('/hotel/:hotelId', protect, async (req, res) => {
  try {
    const moderators = await Moderator.find({ assignedHotels: req.params.hotelId })
      .populate('userId', 'username email')
      .populate('assignedHotels', 'name city');
    
    res.status(200).json(moderators);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/moderators/:id/hotels
// @desc    Assign hotels to moderator
// @access  Private
router.put('/:id/hotels', protect, async (req, res) => {
  try {
    const { hotelIds } = req.body;
    
    if (!hotelIds || !Array.isArray(hotelIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of hotel IDs'
      });
    }
    
    const moderator = await Moderator.findById(req.params.id);
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator not found'
      });
    }
    
    // Verify all hotels exist
    for (const hotelId of hotelIds) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: `Hotel with id ${hotelId} not found`
        });
      }
    }
    
    moderator.assignedHotels = hotelIds;
    await moderator.save();
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/moderators/profile/me
// @desc    Get current moderator profile
// @access  Private
router.get('/profile/me', protect, async (req, res) => {
  try {
    const moderator = await Moderator.findOne({ userId: req.user.id })
      .populate('userId', 'username email country city phone')
      .populate('assignedHotels', 'name city address');
    
    if (!moderator) {
      return res.status(404).json({
        success: false,
        message: 'Moderator profile not found'
      });
    }
    
    res.status(200).json(moderator);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
