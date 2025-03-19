
const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a worker name'],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  role: {
    type: String,
    enum: ['Housekeeper', 'Receptionist', 'Manager', 'Maintenance', 'Security'],
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedRooms: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
      },
      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Moderator'
      },
      assignedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      }
    }
  ],
  cleanedRooms: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
      },
      cleanedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', WorkerSchema);
