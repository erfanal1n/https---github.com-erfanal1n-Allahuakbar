const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Guest']
  },
  content: {
    type: String,
    required: function() {
      return this.contentType === 'text';
    }
  },
  contentType: {
    type: String,
    enum: ['text', 'file', 'link'],
    default: 'text',
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  metadata: {
    // For file type messages
    file: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
      url: String
    },
    // For link type messages
    link: {
      url: String,
      title: String,
      description: String,
      image: String,
      siteName: String
    },
    // For system messages
    isSystem: {
      type: Boolean,
      default: false
    },
    // Additional metadata
    edited: {
      type: Boolean,
      default: false
    },
    editedAt: Date,
    deletedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ status: 1 });

// Virtual for formatted timestamp
MessageSchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
});

// Pre-save middleware to update updatedAt
MessageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Message', MessageSchema);
