
const mongoose = require('mongoose');

const ModeratorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedHotels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    }
  ],
  permissions: {
    canManageWorkers: {
      type: Boolean,
      default: true
    },
    canManageRooms: {
      type: Boolean,
      default: true
    },
    canViewBookings: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Moderator', ModeratorSchema);
