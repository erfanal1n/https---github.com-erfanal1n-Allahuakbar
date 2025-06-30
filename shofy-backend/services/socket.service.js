const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Conversation = require('../model/Conversation');
const Message = require('../model/Message');
const User = require('../model/User');
const { secret } = require('../config/secret');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // Map to store user connections
  }

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['polling', 'websocket']
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    
    console.log('Socket.IO service initialized');
    return this.io;
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
        
        if (!token) {
          // Allow guest connections for chat widget
          socket.user = { isGuest: true };
          return next();
        }

        const decoded = jwt.verify(token, secret.jwt);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.user = user;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        // Still allow connection for guests
        socket.user = { isGuest: true };
        next();
      }
    });

    // Rate limiting middleware
    this.io.use((socket, next) => {
      socket.messageCount = 0;
      socket.lastMessageTime = 0;
      next();
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`, socket.user?.email || 'Guest');

      // Store user connection
      if (socket.user && !socket.user.isGuest) {
        this.connectedUsers.set(socket.user._id.toString(), {
          socketId: socket.id,
          user: socket.user,
          connectedAt: new Date()
        });
      }

      // Join conversation room
      socket.on('joinConversation', async (data) => {
        try {
          const { conversationId } = data;
          
          if (!conversationId) {
            socket.emit('error', { message: 'Conversation ID is required' });
            return;
          }

          // Validate conversation exists
          const conversation = await Conversation.findById(conversationId);
          if (!conversation) {
            socket.emit('error', { message: 'Conversation not found' });
            return;
          }

          // Leave previous rooms
          socket.rooms.forEach(room => {
            if (room !== socket.id) {
              socket.leave(room);
            }
          });

          // Join conversation room
          socket.join(conversationId);
          socket.currentConversation = conversationId;
          
          console.log(`User ${socket.user?.email || 'Guest'} joined conversation: ${conversationId}`);
          
          // Notify others in the room about user joining
          socket.to(conversationId).emit('userJoined', {
            user: socket.user?.name || 'Guest',
            timestamp: new Date()
          });

          socket.emit('conversationJoined', {
            conversationId,
            message: 'Successfully joined conversation'
          });

        } catch (error) {
          console.error('Error joining conversation:', error);
          socket.emit('error', { message: 'Failed to join conversation' });
        }
      });

      // Send message
      socket.on('sendMessage', async (data) => {
        try {
          // Basic rate limiting
          const now = Date.now();
          if (now - socket.lastMessageTime < 1000) { // 1 second between messages
            socket.emit('error', { message: 'Please wait before sending another message' });
            return;
          }
          socket.lastMessageTime = now;

          const { conversationId, content, contentType = 'text', metadata = {} } = data;

          if (!conversationId || !content) {
            socket.emit('error', { message: 'Conversation ID and content are required' });
            return;
          }

          // Validate conversation exists
          const conversation = await Conversation.findById(conversationId);
          if (!conversation) {
            socket.emit('error', { message: 'Conversation not found' });
            return;
          }

          // Get sender ID (could be guest or authenticated user)
          let senderId = socket.user?._id || conversation.participants[0];

          // Create message
          const message = new Message({
            conversation: conversationId,
            sender: senderId,
            content,
            contentType,
            status: 'sent',
            metadata
          });

          await message.save();

          // Populate sender info
          await message.populate('sender', 'name email role');

          // Broadcast message to all users in the conversation
          this.io.to(conversationId).emit('newMessage', {
            message: {
              _id: message._id,
              conversation: message.conversation,
              sender: message.sender,
              content: message.content,
              contentType: message.contentType,
              status: message.status,
              metadata: message.metadata,
              createdAt: message.createdAt,
              formattedTime: message.formattedTime
            }
          });

          // Update message status to delivered
          message.status = 'delivered';
          await message.save();

          // Broadcast status update
          this.io.to(conversationId).emit('messageStatusUpdated', {
            messageId: message._id,
            status: 'delivered',
            timestamp: new Date()
          });

          console.log(`Message sent in conversation ${conversationId}:`, content);

        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Typing indicator
      socket.on('typing', (data) => {
        try {
          const { conversationId } = data;
          
          if (!conversationId || socket.currentConversation !== conversationId) {
            return;
          }

          socket.to(conversationId).emit('userTyping', {
            userId: socket.user?._id,
            userName: socket.user?.name || 'Guest',
            timestamp: new Date()
          });

        } catch (error) {
          console.error('Error handling typing:', error);
        }
      });

      // Stop typing indicator
      socket.on('stopTyping', (data) => {
        try {
          const { conversationId } = data;
          
          if (!conversationId || socket.currentConversation !== conversationId) {
            return;
          }

          socket.to(conversationId).emit('userStoppedTyping', {
            userId: socket.user?._id,
            userName: socket.user?.name || 'Guest',
            timestamp: new Date()
          });

        } catch (error) {
          console.error('Error handling stop typing:', error);
        }
      });

      // Mark message as read
      socket.on('messageRead', async (data) => {
        try {
          const { messageId, conversationId } = data;

          if (!messageId || !conversationId) {
            socket.emit('error', { message: 'Message ID and conversation ID are required' });
            return;
          }

          // Update message status
          const message = await Message.findByIdAndUpdate(
            messageId,
            { status: 'read' },
            { new: true }
          );

          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          // Broadcast status update to all users in conversation
          this.io.to(conversationId).emit('messageStatusUpdated', {
            messageId: message._id,
            status: 'read',
            readBy: socket.user?._id,
            timestamp: new Date()
          });

          console.log(`Message ${messageId} marked as read by ${socket.user?.email || 'Guest'}`);

        } catch (error) {
          console.error('Error marking message as read:', error);
          socket.emit('error', { message: 'Failed to mark message as read' });
        }
      });

      // Handle disconnect
      socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}`, reason);

        // Remove from connected users
        if (socket.user && !socket.user.isGuest) {
          this.connectedUsers.delete(socket.user._id.toString());
        }

        // Notify others in the current conversation
        if (socket.currentConversation) {
          socket.to(socket.currentConversation).emit('userLeft', {
            user: socket.user?.name || 'Guest',
            timestamp: new Date()
          });
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
        socket.emit('error', { message: 'An error occurred' });
      });
    });
  }

  // Method to send message to specific user
  sendToUser(userId, event, data) {
    const userConnection = this.connectedUsers.get(userId.toString());
    if (userConnection) {
      this.io.to(userConnection.socketId).emit(event, data);
      return true;
    }
    return false;
  }

  // Method to send message to conversation
  sendToConversation(conversationId, event, data) {
    this.io.to(conversationId).emit(event, data);
  }

  // Method to get online users in a conversation
  getOnlineUsersInConversation(conversationId) {
    const room = this.io.sockets.adapter.rooms.get(conversationId);
    if (!room) return [];

    const onlineUsers = [];
    room.forEach(socketId => {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket?.user && !socket.user.isGuest) {
        onlineUsers.push({
          id: socket.user._id,
          name: socket.user.name,
          email: socket.user.email
        });
      }
    });

    return onlineUsers;
  }

  // Method to get all connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }
}

module.exports = new SocketService();
