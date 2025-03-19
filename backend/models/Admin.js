
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  superAdmin: {
    type: Boolean,
    default: false
  },
  permissions: {
    manageUsers: {
      type: Boolean,
      default: true
    },
    manageHotels: {
      type: Boolean,
      default: true
    },
    manageModerators: {
      type: Boolean,
      default: true
    },
    viewReports: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', AdminSchema);
