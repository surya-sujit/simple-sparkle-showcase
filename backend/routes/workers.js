
const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');

// @route   GET /api/workers
// @desc    Get all workers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate('userId', 'username email')
      .populate('hotelId', 'name city');
    
    res.status(200).json(workers);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/workers/:id
// @desc    Get single worker
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'username email country city phone')
      .populate('hotelId', 'name city address')
      .populate({
        path: 'assignedRooms.roomId',
        select: 'title desc roomNumbers price',
      })
      .populate({
        path: 'cleanedRooms.roomId',
        select: 'title desc roomNumbers price',
      });
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }
    
    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/workers
// @desc    Create worker
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, userId, hotelId, role, email, phone, isActive } = req.body;
    
    // Check if worker already exists
    const existingWorker = await Worker.findOne({ userId });
    
    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: 'This user is already a worker'
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
    
    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    const worker = await Worker.create({
      name,
      userId,
      hotelId,
      role,
      email,
      phone,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:id
// @desc    Update worker
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, role, email, phone, isActive, hotelId } = req.body;
    
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }
    
    // Check if hotel exists if changing hotel
    if (hotelId && hotelId !== worker.hotelId.toString()) {
      const hotel = await Hotel.findById(hotelId);
      
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found'
        });
      }
    }
    
    // Update fields
    if (name) worker.name = name;
    if (role) worker.role = role;
    if (email) worker.email = email;
    if (phone) worker.phone = phone;
    if (isActive !== undefined) worker.isActive = isActive;
    if (hotelId) worker.hotelId = hotelId;
    
    await worker.save();
    
    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/workers/:id
// @desc    Delete worker
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }
    
    await worker.remove();
    
    res.status(200).json({
      success: true,
      message: 'Worker removed'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/workers/hotel/:hotelId
// @desc    Get workers by hotel id
// @access  Private
router.get('/hotel/:hotelId', protect, async (req, res) => {
  try {
    const workers = await Worker.find({ hotelId: req.params.hotelId })
      .populate('userId', 'username email')
      .populate('hotelId', 'name city');
    
    res.status(200).json(workers);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:id/assign/:roomId
// @desc    Assign room to worker
// @access  Private
router.put('/:id/assign/:roomId', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }
    
    // Check if room exists
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if room belongs to worker's hotel
    if (room.hotelId.toString() !== worker.hotelId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Room does not belong to worker\'s hotel'
      });
    }
    
    // Check if room is already assigned to this worker
    const alreadyAssigned = worker.assignedRooms.some(
      assignment => assignment.roomId.toString() === req.params.roomId
    );
    
    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Room is already assigned to this worker'
      });
    }
    
    // Add room to worker's assigned rooms
    worker.assignedRooms.push({
      roomId: req.params.roomId,
      assignedBy: req.user.id,
      assignedAt: new Date(),
      status: 'pending'
    });
    
    // Update room cleaning status
    room.needsCleaning = true;
    
    await Promise.all([
      worker.save(),
      room.save()
    ]);
    
    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:id/complete/:roomId
// @desc    Mark room as cleaned by worker
// @access  Private
router.put('/:id/complete/:roomId', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }
    
    // Check if room exists
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if room is assigned to worker
    const assignmentIndex = worker.assignedRooms.findIndex(
      assignment => assignment.roomId.toString() === req.params.roomId
    );
    
    if (assignmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Room is not assigned to this worker'
      });
    }
    
    // Remove room from assigned rooms
    worker.assignedRooms.splice(assignmentIndex, 1);
    
    // Add to cleaned rooms
    worker.cleanedRooms.push({
      roomId: req.params.roomId,
      cleanedAt: new Date()
    });
    
    // Update room cleaning status
    room.isCleaned = true;
    room.needsCleaning = false;
    room.lastCleanedAt = new Date();
    room.cleaningHistory.push({
      cleanedBy: worker._id,
      cleanedAt: new Date()
    });
    
    await Promise.all([
      worker.save(),
      room.save()
    ]);
    
    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
