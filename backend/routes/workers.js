
const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Moderator = require('../models/Moderator');
const { protect, isAdmin, isModerator } = require('../middleware/auth');

// @route   GET /api/workers
// @desc    Get all workers
// @access  Private (Admin or Moderator)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // If user is moderator (not admin), only return workers for their hotels
    if (!req.user.isAdmin && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (!moderator) {
        return res.status(404).json({
          success: false,
          message: 'Moderator not found'
        });
      }
      
      // Only get workers for hotels this moderator manages
      query.hotelId = { $in: moderator.assignedHotels };
    }
    
    const workers = await Worker.find(query)
      .populate('userId', 'username email')
      .populate('hotelId', 'name city')
      .populate({
        path: 'assignedRooms.roomId',
        select: 'title price maxPeople roomNumbers'
      });
    
    res.status(200).json(workers);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/workers/:id
// @desc    Get single worker
// @access  Private (Admin or Moderator)
router.get('/:id', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('hotelId', 'name city')
      .populate({
        path: 'assignedRooms.roomId',
        select: 'title price maxPeople roomNumbers'
      })
      .populate('assignedRooms.assignedBy', 'userId');
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If user is moderator (not admin), verify they manage this worker's hotel
    if (!req.user.isAdmin && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (!moderator) {
        return res.status(404).json({
          success: false,
          message: 'Moderator not found'
        });
      }
      
      const canAccessHotel = moderator.assignedHotels.some(
        hotelId => hotelId.toString() === worker.hotelId.toString()
      );
      
      if (!canAccessHotel) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this worker'
        });
      }
    }
    
    res.status(200).json(worker);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   POST /api/workers
// @desc    Create worker
// @access  Private (Admin or Moderator)
router.post('/', protect, isModerator, async (req, res) => {
  try {
    const { userId, hotelId, name, role, email, phone } = req.body;
    
    // If creating a worker with userId, check if user exists
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No user with the id of ${userId}`
        });
      }
    }
    
    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${hotelId}`
      });
    }
    
    // If user is moderator (not admin), verify they manage this hotel
    if (!req.user.isAdmin && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (!moderator) {
        return res.status(404).json({
          success: false,
          message: 'Moderator not found'
        });
      }
      
      const canAccessHotel = moderator.assignedHotels.some(
        moderatorHotelId => moderatorHotelId.toString() === hotelId
      );
      
      if (!canAccessHotel) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create workers for this hotel'
        });
      }
    }
    
    // Create worker
    const worker = await Worker.create({
      userId: userId || req.user._id,
      hotelId,
      name,
      role,
      email,
      phone,
      isActive: true
    });
    
    // Populate the worker
    const populatedWorker = await Worker.findById(worker._id)
      .populate('userId', 'username email')
      .populate('hotelId', 'name city');
    
    res.status(201).json(populatedWorker);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:id
// @desc    Update worker
// @access  Private (Admin or Moderator)
router.put('/:id', protect, isModerator, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If user is moderator (not admin), verify they manage this worker's hotel
    if (!req.user.isAdmin && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (!moderator) {
        return res.status(404).json({
          success: false,
          message: 'Moderator not found'
        });
      }
      
      const canAccessHotel = moderator.assignedHotels.some(
        hotelId => hotelId.toString() === worker.hotelId.toString()
      );
      
      if (!canAccessHotel) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this worker'
        });
      }
      
      // If changing hotel, verify moderator manages new hotel
      if (req.body.hotelId && req.body.hotelId !== worker.hotelId.toString()) {
        const canAccessNewHotel = moderator.assignedHotels.some(
          hotelId => hotelId.toString() === req.body.hotelId
        );
        
        if (!canAccessNewHotel) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to move worker to this hotel'
          });
        }
      }
    }
    
    // Update worker
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('userId', 'username email')
      .populate('hotelId', 'name city')
      .populate({
        path: 'assignedRooms.roomId',
        select: 'title price maxPeople roomNumbers'
      });
    
    res.status(200).json(updatedWorker);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   DELETE /api/workers/:id
// @desc    Delete worker
// @access  Private (Admin or Moderator)
router.delete('/:id', protect, isModerator, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.id}`
      });
    }
    
    // If user is moderator (not admin), verify they manage this worker's hotel
    if (!req.user.isAdmin && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (!moderator) {
        return res.status(404).json({
          success: false,
          message: 'Moderator not found'
        });
      }
      
      const canAccessHotel = moderator.assignedHotels.some(
        hotelId => hotelId.toString() === worker.hotelId.toString()
      );
      
      if (!canAccessHotel) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this worker'
        });
      }
    }
    
    // Delete worker
    await worker.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Worker deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   GET /api/workers/hotel/:hotelId
// @desc    Get workers for a specific hotel
// @access  Private (Admin or Moderator)
router.get('/hotel/:hotelId', protect, isModerator, async (req, res) => {
  try {
    // Check if hotel exists
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.hotelId}`
      });
    }
    
    // If user is moderator (not admin), verify they manage this hotel
    if (!req.user.isAdmin && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (!moderator) {
        return res.status(404).json({
          success: false,
          message: 'Moderator not found'
        });
      }
      
      const canAccessHotel = moderator.assignedHotels.some(
        hotelId => hotelId.toString() === req.params.hotelId
      );
      
      if (!canAccessHotel) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view workers for this hotel'
        });
      }
    }
    
    const workers = await Worker.find({ hotelId: req.params.hotelId })
      .populate('userId', 'username email')
      .populate('hotelId', 'name city')
      .populate({
        path: 'assignedRooms.roomId',
        select: 'title price maxPeople roomNumbers'
      });
    
    res.status(200).json(workers);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:workerId/assign/:roomId
// @desc    Assign a room to a worker for cleaning
// @access  Private (Admin or Moderator)
router.put('/:workerId/assign/:roomId', protect, isModerator, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.workerId}`
      });
    }
    
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.roomId}`
      });
    }
    
    // If user is moderator (not admin), verify they manage this worker's hotel
    if (!req.user.isAdmin && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (!moderator) {
        return res.status(404).json({
          success: false,
          message: 'Moderator not found'
        });
      }
      
      const canAccessHotel = moderator.assignedHotels.some(
        hotelId => hotelId.toString() === worker.hotelId.toString()
      );
      
      if (!canAccessHotel) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to assign rooms to this worker'
        });
      }
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
      assignedBy: req.user.moderatorDetails ? req.user.moderatorDetails._id : null,
      assignedAt: new Date(),
      status: 'pending'
    });
    
    await worker.save();
    
    // Update room as needing cleaning
    room.needsCleaning = true;
    room.isCleaned = false;
    await room.save();
    
    // Get the updated worker with populated fields
    const updatedWorker = await Worker.findById(req.params.workerId)
      .populate('userId', 'username email')
      .populate('hotelId', 'name city')
      .populate({
        path: 'assignedRooms.roomId',
        select: 'title price maxPeople roomNumbers'
      })
      .populate('assignedRooms.assignedBy', 'userId');
    
    res.status(200).json(updatedWorker);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// @route   PUT /api/workers/:workerId/complete/:roomId
// @desc    Mark a room as cleaned by worker
// @access  Private
router.put('/:workerId/complete/:roomId', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.workerId);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: `No worker with the id of ${req.params.workerId}`
      });
    }
    
    // Verify the user is either the worker, a moderator for this hotel, or an admin
    const isWorker = worker.userId.toString() === req.user._id.toString();
    let hasAccess = req.user.isAdmin || isWorker;
    
    if (!hasAccess && req.user.isModerator) {
      const moderator = await Moderator.findOne({ userId: req.user._id });
      
      if (moderator) {
        const canAccessHotel = moderator.assignedHotels.some(
          hotelId => hotelId.toString() === worker.hotelId.toString()
        );
        
        hasAccess = canAccessHotel;
      }
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this worker\'s assignments'
      });
    }
    
    // Find the assigned room
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `No room with the id of ${req.params.roomId}`
      });
    }
    
    // Find the assignment in worker's assigned rooms
    const assignmentIndex = worker.assignedRooms.findIndex(
      assignment => assignment.roomId.toString() === req.params.roomId
    );
    
    if (assignmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Room is not assigned to this worker'
      });
    }
    
    // Get the assignment and remove it from assigned rooms
    const assignment = worker.assignedRooms[assignmentIndex];
    worker.assignedRooms.splice(assignmentIndex, 1);
    
    // Add room to worker's cleaned rooms
    worker.cleanedRooms.push({
      roomId: req.params.roomId,
      cleanedAt: new Date()
    });
    
    await worker.save();
    
    // Update room status
    room.isCleaned = true;
    room.needsCleaning = false;
    room.lastCleanedAt = new Date();
    room.cleaningHistory.push({
      cleanedBy: req.params.workerId,
      cleanedAt: new Date()
    });
    
    await room.save();
    
    res.status(200).json({
      success: true,
      message: 'Room marked as cleaned successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
