const mongoose = require('mongoose');
const validator = require('validator');

const guestSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters.'],
    maxLength: [100, 'Name is too large'],
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Provide a valid Email'],
    trim: true,
    lowercase: true,
    required: [true, 'Email address is required'],
  },
  sessionId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  // Store additional context about the guest
  context: {
    referrer: String,
    currentPage: String,
    device: String,
    browser: String,
    location: {
      country: String,
      city: String,
      timezone: String
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
guestSchema.index({ email: 1 });
guestSchema.index({ sessionId: 1 });
guestSchema.index({ isActive: 1 });
guestSchema.index({ lastActive: -1 });

// Update lastActive on save
guestSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Virtual for display name
guestSchema.virtual('displayName').get(function() {
  return `${this.name} (Guest)`;
});

// Method to mark as inactive
guestSchema.methods.markInactive = function() {
  this.isActive = false;
  return this.save();
};

// Static method to cleanup old inactive guests
guestSchema.statics.cleanupOldGuests = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    isActive: false,
    lastActive: { $lt: thirtyDaysAgo }
  });
};

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
