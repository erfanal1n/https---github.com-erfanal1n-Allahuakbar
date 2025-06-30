const express = require('express');
const multer = require('multer');
const { body, param } = require('express-validator');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const {
  initiateChat,
  uploadFile,
  getCustomerContext,
  previewLink,
  getConversations,
  getMessages,
  getAdminConversations,
  assignConversation,
  updateConversationStatus,
  getChatStats
} = require('../controller/chat.controller');

const {
  chatRateLimit,
  uploadRateLimit,
  optionalAuth,
  requireAdmin,
  moderateContent,
  validateFile
} = require('../middleware/chat.middleware');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads/chat');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `chat-${uniqueSuffix}${ext}`);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    // Videos
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'video/x-msvideo'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

// Validation middleware
const initiateValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('name')
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Name must be between 2 and 50 characters'),
  body('message')
    .optional()
    .isLength({ max: 1000 })
    .trim()
    .withMessage('Message cannot exceed 1000 characters')
];

const linkPreviewValidation = [
  body('url')
    .isURL()
    .withMessage('Valid URL is required'),
  body('conversationId')
    .isMongoId()
    .withMessage('Valid conversation ID is required')
];

const customerContextValidation = [
  param('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
];

// Routes

// POST /api/chat/initiate - Initialize chat conversation
router.post('/initiate', chatRateLimit, optionalAuth, initiateValidation, moderateContent, initiateChat);

// POST /api/chat/upload - Handle file uploads
router.post('/upload', uploadRateLimit, optionalAuth, upload.single('file'), validateFile, uploadFile);

// GET /api/customer-context/:email - Fetch customer e-commerce data
router.get('/customer-context/:email', customerContextValidation, getCustomerContext);

// POST /api/chat/preview-link - Generate link preview
router.post('/preview-link', chatRateLimit, optionalAuth, linkPreviewValidation, previewLink);

// GET /api/chat/conversations - Get user's conversations (requires auth)
router.get('/conversations', optionalAuth, getConversations);

// GET /api/chat/messages/:conversationId - Get messages for a conversation
router.get('/messages/:conversationId', optionalAuth, getMessages);

// Admin Routes
// GET /api/chat/admin/conversations - Get all conversations for admin
router.get('/admin/conversations', requireAdmin, getAdminConversations);

// POST /api/chat/admin/assign - Assign conversation to admin
router.post('/admin/assign', requireAdmin, assignConversation);

// PUT /api/chat/admin/conversation/:id/status - Update conversation status
router.put('/admin/conversation/:id/status', requireAdmin, updateConversationStatus);

// GET /api/chat/admin/stats - Get chat statistics
router.get('/admin/stats', requireAdmin, getChatStats);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed per upload.'
      });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router;
