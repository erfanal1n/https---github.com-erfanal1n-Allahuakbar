const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  // Regular user participants
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Guest participant (only one guest per conversation)
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: false
  },
  // Type of conversation
  type: {
    type: String,
    enum: ['user_admin', 'guest_admin', 'user_user'],
    default: 'guest_admin'
  },
  // Status of conversation
  status: {
    type: String,
    enum: ['active', 'closed', 'pending'],
    default: 'active'
  },
  // Admin assigned to this conversation
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Guest context information
  guestContext: {
    type: String,
    trim: true,
  },
  // Last activity timestamp
  lastActivity: {
    type: Date,
    default: Date.now
  },
  // Tags for categorizing conversations
  tags: [{
    type: String,
    trim: true
  }],
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for efficient queries
ConversationSchema.index({ status: 1 });
ConversationSchema.index({ type: 1 });
ConversationSchema.index({ assignedAdmin: 1 });
ConversationSchema.index({ guest: 1 });
ConversationSchema.index({ lastActivity: -1 });
ConversationSchema.index({ priority: 1 });

// Update lastActivity on save
ConversationSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Virtual to get participant count
ConversationSchema.virtual('participantCount').get(function() {
  let count = this.participants.length;
  if (this.guest) count += 1;
  return count;
});

// Method to assign admin
ConversationSchema.methods.assignToAdmin = function(adminId) {
  this.assignedAdmin = adminId;
  return this.save();
};

// Method to close conversation
ConversationSchema.methods.close = function() {
  this.status = 'closed';
  return this.save();
};

module.exports = mongoose.model('Conversation', ConversationSchema);
