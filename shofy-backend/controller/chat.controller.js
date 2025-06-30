
const { validationResult } = require('express-validator');
const { getLinkPreview } = require('link-preview-js');
const fs = require('fs');
const Conversation = require('../model/Conversation');
const Message = require('../model/Message');
const User = require('../model/User');
const Guest = require('../model/Guest');
const Order = require('../model/Order');

// POST /api/chat/initiate - Initialize chat conversation
const initiateChat = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, name, message: initialMessage, sessionId, context } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Check if user exists by email
    let user = await User.findOne({ email });
    let guest = null;
    let isGuest = false;
    let participant = null;
    let senderModel = 'User';

    if (!user) {
      // Create guest user
      guest = new Guest({
        name,
        email,
        sessionId: sessionId || undefined, // Let it auto-generate if not provided
        ipAddress,
        userAgent,
        context: context || {}
      });
      await guest.save();
      participant = guest;
      isGuest = true;
      senderModel = 'Guest';
    } else {
      participant = user;
      senderModel = 'User';
    }

    // Check for existing conversation
    let conversation;
    if (isGuest) {
      conversation = await Conversation.findOne({
        guest: guest._id,
        status: 'active'
      }).populate('guest', 'name email sessionId')
        .populate('assignedAdmin', 'name email role');
    } else {
      conversation = await Conversation.findOne({
        participants: user._id,
        status: 'active'
      }).populate('participants', 'name email role')
        .populate('assignedAdmin', 'name email role');
    }

    if (!conversation) {
      // Create new conversation
      const conversationData = {
        type: isGuest ? 'guest_admin' : 'user_admin',
        status: 'active',
        guestContext: isGuest ? `Guest chat - ${email} (${name})` : null,
        priority: 'medium'
      };

      if (isGuest) {
        conversationData.guest = guest._id;
      } else {
        conversationData.participants = [user._id];
      }

      conversation = new Conversation(conversationData);
      await conversation.save();
      
      // Populate the conversation
      if (isGuest) {
        conversation = await Conversation.findById(conversation._id)
          .populate('guest', 'name email sessionId')
          .populate('assignedAdmin', 'name email role');
      } else {
        conversation = await Conversation.findById(conversation._id)
          .populate('participants', 'name email role')
          .populate('assignedAdmin', 'name email role');
      }
    }

    // Create initial message if provided
    let initialMsg = null;
    if (initialMessage && initialMessage.trim()) {
      initialMsg = new Message({
        conversation: conversation._id,
        sender: participant._id,
        senderModel,
        content: initialMessage,
        contentType: 'text',
        status: 'sent'
      });
      await initialMsg.save();
    }

    // Create welcome system message (from admin perspective)
    const welcomeMessage = new Message({
      conversation: conversation._id,
      sender: participant._id,
      senderModel,
      content: `Thank you for contacting Shofy! 🛍️ ${isGuest ? 'We\'ll connect you with our support team shortly.' : 'Welcome back! How can we help you today?'}`,
      contentType: 'text',
      status: 'delivered',
      metadata: {
        isSystem: true
      }
    });
    await welcomeMessage.save();

    res.status(200).json({
      success: true,
      message: 'Chat conversation initiated successfully',
      data: {
        conversation: {
          _id: conversation._id,
          type: conversation.type,
          status: conversation.status,
          guest: conversation.guest,
          participants: conversation.participants,
          assignedAdmin: conversation.assignedAdmin,
          guestContext: conversation.guestContext,
          createdAt: conversation.createdAt
        },
        participant: {
          _id: participant._id,
          name: participant.name,
          email: participant.email,
          isGuest: isGuest,
          sessionId: isGuest ? participant.sessionId : null
        },
        initialMessage: initialMsg,
        welcomeMessage
      }
    });

  } catch (error) {
    console.error('Error initiating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate chat',
      error: error.message
    });
  }
};

// POST /api/chat/upload - Handle file uploads
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { conversationId } = req.body;
    const { filename, originalname, mimetype, size, path: filePath } = req.file;

    // Validate conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      // Clean up uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Create file URL (adjust according to your static file serving setup)
    const fileUrl = `/uploads/chat/${filename}`;

    // Create message with file metadata
    const message = new Message({
      conversation: conversationId,
      sender: req.user?._id || conversation.participants[0], // Fallback to first participant
      content: `📎 ${originalname}`,
      contentType: 'file',
      status: 'sent',
      metadata: {
        file: {
          filename,
          originalName: originalname,
          mimetype,
          size,
          path: filePath,
          url: fileUrl
        }
      }
    });

    await message.save();

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        message,
        fileUrl
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// GET /api/customer-context/:email - Fetch customer e-commerce data
const getCustomerContext = async (req, res) => {
  try {
    const { email } = req.params;

    // Find user by email
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer's order history
    const orders = await Order.find({ email })
      .populate('products.product', 'title price thumbnail')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate customer stats
    const totalOrders = await Order.countDocuments({ email });
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    // Get favorite categories (based on order history)
    const categoryStats = {};
    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product && item.product.category) {
          categoryStats[item.product.category] = (categoryStats[item.product.category] || 0) + 1;
        }
      });
    });

    const favoriteCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    res.status(200).json({
      success: true,
      message: 'Customer context retrieved successfully',
      data: {
        customer: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt
        },
        orderHistory: orders,
        stats: {
          totalOrders,
          totalSpent,
          lastOrderDate,
          favoriteCategories
        }
      }
    });

  } catch (error) {
    console.error('Error fetching customer context:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer context',
      error: error.message
    });
  }
};

// POST /api/chat/preview-link - Generate link preview
const previewLink = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { url, conversationId } = req.body;

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Validate conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Get link preview
    try {
      const preview = await getLinkPreview(url, {
        timeout: 5000,
        followRedirects: 'follow',
        handleRedirects: (baseURL, forwardedURL) => {
          return true; // Allow redirects
        }
      });

      // Create message with link metadata
      const message = new Message({
        conversation: conversationId,
        sender: req.user?._id || conversation.participants[0],
        content: url,
        contentType: 'link',
        status: 'sent',
        metadata: {
          link: {
            url: preview.url || url,
            title: preview.title || 'Link',
            description: preview.description || '',
            image: preview.images?.[0] || preview.favicons?.[0] || '',
            siteName: preview.siteName || new URL(url).hostname
          }
        }
      });

      await message.save();

      res.status(200).json({
        success: true,
        message: 'Link preview generated successfully',
        data: {
          message,
          preview: message.metadata.link
        }
      });

    } catch (previewError) {
      console.error('Link preview error:', previewError);
      
      // Fallback: create simple link message without preview
      const message = new Message({
        conversation: conversationId,
        sender: req.user?._id || conversation.participants[0],
        content: url,
        contentType: 'link',
        status: 'sent',
        metadata: {
          link: {
            url,
            title: 'Link',
            description: '',
            image: '',
            siteName: new URL(url).hostname
          }
        }
      });

      await message.save();

      res.status(200).json({
        success: true,
        message: 'Link shared (preview unavailable)',
        data: {
          message,
          preview: message.metadata.link
        }
      });
    }

  } catch (error) {
    console.error('Error generating link preview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate link preview',
      error: error.message
    });
  }
};

// GET /api/chat/conversations - Get user's conversations
const getConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name email role')
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Get last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({
          conversation: conv._id
        }).sort({ createdAt: -1 });

        return {
          ...conv.toObject(),
          lastMessage
        };
      })
    );

    const total = await Conversation.countDocuments({
      participants: userId
    });

    res.status(200).json({
      success: true,
      message: 'Conversations retrieved successfully',
      data: {
        conversations: conversationsWithLastMessage,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// GET /api/chat/messages/:conversationId - Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Validate conversation exists and user has access
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({
      conversation: conversationId
    })
    .populate('sender', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      conversation: conversationId
    });

    res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully',
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Admin endpoints

// GET /api/chat/admin/conversations - Get all conversations for admin
const getAdminConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'active', type } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const conversations = await Conversation.find(filter)
      .populate('participants', 'name email role')
      .populate('guest', 'name email sessionId lastActive')
      .populate('assignedAdmin', 'name email role')
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get last message and unread count for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({
          conversation: conv._id
        }).sort({ createdAt: -1 })
          .populate('sender', 'name email');

        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          status: { $ne: 'read' },
          senderModel: conv.type === 'guest_admin' ? 'Guest' : 'User'
        });

        return {
          ...conv.toObject(),
          lastMessage,
          unreadCount
        };
      })
    );

    const total = await Conversation.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Admin conversations retrieved successfully',
      data: {
        conversations: conversationsWithDetails,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// POST /api/chat/admin/assign - Assign conversation to admin
const assignConversation = async (req, res) => {
  try {
    const { conversationId, adminId } = req.body;
    
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Verify admin exists
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin user'
      });
    }

    conversation.assignedAdmin = adminId;
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Conversation assigned successfully',
      data: {
        conversation: await conversation.populate('assignedAdmin', 'name email role')
      }
    });

  } catch (error) {
    console.error('Error assigning conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign conversation',
      error: error.message
    });
  }
};

// PUT /api/chat/admin/conversation/:id/status - Update conversation status
const updateConversationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('participants', 'name email role')
     .populate('guest', 'name email sessionId')
     .populate('assignedAdmin', 'name email role');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation status updated successfully',
      data: { conversation }
    });

  } catch (error) {
    console.error('Error updating conversation status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update conversation status',
      error: error.message
    });
  }
};

// GET /api/chat/admin/stats - Get chat statistics
const getChatStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get various statistics
    const stats = {
      total: {
        conversations: await Conversation.countDocuments(),
        messages: await Message.countDocuments(),
        guests: await Guest.countDocuments(),
        activeConversations: await Conversation.countDocuments({ status: 'active' })
      },
      today: {
        conversations: await Conversation.countDocuments({ createdAt: { $gte: startOfDay } }),
        messages: await Message.countDocuments({ createdAt: { $gte: startOfDay } }),
        guests: await Guest.countDocuments({ createdAt: { $gte: startOfDay } })
      },
      week: {
        conversations: await Conversation.countDocuments({ createdAt: { $gte: startOfWeek } }),
        messages: await Message.countDocuments({ createdAt: { $gte: startOfWeek } }),
        guests: await Guest.countDocuments({ createdAt: { $gte: startOfWeek } })
      },
      month: {
        conversations: await Conversation.countDocuments({ createdAt: { $gte: startOfMonth } }),
        messages: await Message.countDocuments({ createdAt: { $gte: startOfMonth } }),
        guests: await Guest.countDocuments({ createdAt: { $gte: startOfMonth } })
      }
    };

    // Get conversation distribution by type
    const conversationTypes = await Conversation.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get active admins
    const activeAdmins = await User.find({ role: 'admin' }).select('name email');

    res.status(200).json({
      success: true,
      message: 'Chat statistics retrieved successfully',
      data: {
        stats,
        conversationTypes,
        activeAdmins
      }
    });

  } catch (error) {
    console.error('Error fetching chat stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat statistics',
      error: error.message
    });
  }
};

module.exports = {
  initiateChat,
  uploadFile,
  getCustomerContext,
  previewLink,
  getConversations,
  getMessages,
  // Admin endpoints
  getAdminConversations,
  assignConversation,
  updateConversationStatus,
  getChatStats
};
