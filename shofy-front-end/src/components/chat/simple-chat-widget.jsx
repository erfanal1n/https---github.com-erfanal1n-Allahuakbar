'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Paperclip, Image, FileText, Video } from 'lucide-react';

const SimpleChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [autoReplyStep, setAutoReplyStep] = useState(0);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Auto-reply messages
  const autoReplyMessages = [
    "Thank you for contacting Shofy! 🛍️",
    "We'll reach you ASAP! Our team typically responds within 2-3 minutes.",
    "In the meantime, feel free to browse our latest collections!",
    "Is there anything specific you're looking for today?"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChatStarted(true);
    
    // Add first message after a delay
    setTimeout(() => {
      setIsTyping(true);
      
      // Show typing indicator for 1.5 seconds then add message
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{
          id: Date.now(),
          text: autoReplyMessages[0],
          isBot: true,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
        
        // Start auto-reply sequence
        setAutoReplyStep(1);
      }, 1500);
    }, 1000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowFileOptions(false);
      
      // Create file message
      const fileMsg = {
        id: Date.now(),
        text: `📎 ${file.name}`,
        isBot: false,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        file: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type
        }
      };
      
      setMessages(prev => [...prev, fileMsg]);
      
      // Bot response to file
      setTimeout(() => {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          const botReply = {
            id: Date.now() + 1,
            text: "File received! Our team will review it and get back to you shortly.",
            isBot: true,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };
          
          setMessages(prev => [...prev, botReply]);
        }, 1500);
      }, 500);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message
      const userMsg = {
        id: Date.now(),
        text: message,
        isBot: false,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setMessages(prev => [...prev, userMsg]);
      setMessage('');
      
      // Show typing indicator
      setTimeout(() => {
        setIsTyping(true);
        
        // Add bot response after typing delay
        setTimeout(() => {
          setIsTyping(false);
          // Add custom response based on message content
          const botReply = {
            id: Date.now() + 1,
            text: "Thank you for your message! Our team will get back to you shortly.",
            isBot: true,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };
          
          setMessages(prev => [...prev, botReply]);
        }, 1500);
      }, 500);
    }
  };
  
  // Handle auto-reply sequence
  React.useEffect(() => {
    if (autoReplyStep > 0 && autoReplyStep < autoReplyMessages.length) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: autoReplyMessages[autoReplyStep],
            isBot: true,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }]);
          setAutoReplyStep(prev => prev + 1);
        }, 1500);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [autoReplyStep, autoReplyMessages]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px', // Changed from right to left
      zIndex: 9999
    }}>
      {/* Chat Button */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0989FF',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: [0, -5, 5, 0],
          boxShadow: [
            '0 0 30px rgba(9, 137, 255, 0.8)',
            '0 0 60px rgba(9, 137, 255, 0.6)',
            '0 0 30px rgba(9, 137, 255, 0.8)'
          ],
          backgroundColor: '#010F1C',
          transition: {
            duration: 0.3,
            boxShadow: {
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }}
        whileTap={{ 
          scale: 0.9,
          rotate: 180,
          transition: { duration: 0.2 }
        }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(9, 137, 255, 0.3)',
            '0 8px 30px rgba(9, 137, 255, 0.5)',
            '0 4px 20px rgba(9, 137, 255, 0.3)'
          ],
        }}
        transition={{
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
      >
        {/* Animated ring effects */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent, rgba(9, 137, 255, 0.4), transparent, rgba(9, 137, 255, 0.2), transparent)'
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Secondary rotating ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            background: 'conic-gradient(from 180deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
          }}
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Pulsing dot indicators */}
        {[0, 120, 240].map((angle, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              backgroundColor: 'white',
              borderRadius: '50%',
              top: '8px',
              left: '50%',
              transformOrigin: '0 24px',
              transform: `rotate(${angle}deg)`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        <motion.div
          style={{ position: 'relative', zIndex: 10 }}
          animate={{
            scale: [1, 1.1, 1],
            transition: { duration: 1.5, repeat: Infinity }
          }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'absolute',
              bottom: '70px',
              left: '0',
              width: '350px',
              height: '450px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                backgroundColor: '#0989FF',
                color: 'white',
                padding: '15px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Chat with us</span>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </motion.div>

            {/* Body */}
            <div style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              backgroundColor: '#f6f7f9',
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(9, 137, 255, 0.05) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}>
              {chatStarted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {/* Messages from API */}
                  {messages.map((msg, index) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95, x: msg.isBot ? -20 : 20 }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                      transition={{ 
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                        delay: index * 0.1
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: '8px',
                        flexDirection: msg.isBot ? 'row' : 'row-reverse',
                        justifyContent: msg.isBot ? 'flex-start' : 'flex-end'
                      }}
                    >
                      {/* Avatar */}
                      <motion.div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: `2px solid ${msg.isBot ? '#0989FF' : '#821F40'}`,
                          backgroundImage: msg.isBot 
                            ? `url(https://cdn-icons-png.flaticon.com/512/4149/4149882.png)` 
                            : `url(https://cdn-icons-png.flaticon.com/512/1077/1077114.png)`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: msg.isBot ? [-5, 0, 5, 0] : [5, 0, -5, 0],
                          transition: { 
                            rotate: { repeat: 1, duration: 0.5 }
                          }
                        }}
                      />
                      
                      {/* Message bubble */}
                      <motion.div
                        style={{
                          backgroundColor: msg.isBot ? '#F6F7F9' : '#0989FF',
                          color: msg.isBot ? '#010F1C' : 'white',
                          padding: '12px',
                          borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                          maxWidth: '75%',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          border: msg.isBot ? '1px solid #EAEBED' : 'none',
                          marginLeft: msg.isBot ? '0' : 'auto'
                        }}
                        whileHover={{
                          scale: 1.03,
                          y: -3,
                          x: msg.isBot ? 3 : -3,
                          boxShadow: msg.isBot ? '0 8px 25px rgba(9, 137, 255, 0.15)' : '0 8px 25px rgba(130, 31, 64, 0.15)',
                          transition: { duration: 0.3 }
                        }}
                      >
                        {msg.file ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: msg.isBot ? '#0989FF' : 'rgba(255,255,255,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {msg.file.type.startsWith('image/') ? 
                                <Image size={16} color={msg.isBot ? 'white' : 'white'} /> :
                                msg.file.type.startsWith('video/') ?
                                <Video size={16} color={msg.isBot ? 'white' : 'white'} /> :
                                <FileText size={16} color={msg.isBot ? 'white' : 'white'} />
                              }
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{msg.file.name}</p>
                              <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{msg.file.size}</p>
                            </div>
                          </div>
                        ) : (
                          <p style={{ margin: 0, fontSize: '14px' }}>{msg.text}</p>
                        )}
                        <div style={{ 
                          fontSize: '10px', 
                          marginTop: '5px',
                          opacity: 0.7,
                          textAlign: msg.isBot ? 'left' : 'right',
                          color: msg.isBot ? '#888A8C' : 'rgba(255,255,255,0.8)'
                        }}>
                          {msg.time}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: '8px',
                        flexDirection: 'row',
                        justifyContent: 'flex-start'
                      }}>
                      {/* Bot Avatar */}
                      <motion.div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '2px solid #0989FF',
                          backgroundImage: 'url(https://cdn-icons-png.flaticon.com/512/4149/4149882.png)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        animate={{
                          scale: [1, 1.05, 1],
                          borderWidth: ['2px', '3px', '2px'],
                          boxShadow: [
                            '0 0 0px rgba(9, 137, 255, 0.3)',
                            '0 0 15px rgba(9, 137, 255, 0.5)',
                            '0 0 0px rgba(9, 137, 255, 0.3)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Typing bubble */}
                      <motion.div
                        style={{
                          backgroundColor: '#F6F7F9',
                          backgroundImage: 'linear-gradient(145deg, #f8faff 0%, #f6f7f9 100%)',
                          padding: '10px 15px',
                          borderRadius: '16px 16px 16px 4px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          border: '1px solid #EAEBED',
                        }}
                        animate={{
                          boxShadow: [
                            '0 2px 8px rgba(9, 137, 255, 0.1)',
                            '0 4px 16px rgba(9, 137, 255, 0.2)',
                            '0 2px 8px rgba(9, 137, 255, 0.1)'
                          ]
                        }}
                        transition={{
                          boxShadow: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          {[0, 1, 2].map((index) => (
                            <motion.div
                              key={index}
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0989FF 0%, #0971FF 100%)',
                                boxShadow: '0 2px 5px rgba(9, 137, 255, 0.3)'
                              }}
                              animate={{
                                y: [0, -6, 0],
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.6, 1, 0.6],
                              }}
                              transition={{
                                delay: index * 0.15,
                                repeat: Infinity,
                                duration: 0.8,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ fontSize: '10px', color: '#0989FF', textAlign: 'center', marginTop: '5px' }}>
                          typing...
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <motion.div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#0989FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px auto'
                      }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(9, 137, 255, 0.4)' }}
                    >
                      <MessageCircle size={30} color="white" />
                    </motion.div>
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Welcome to Shofy Support</h4>
                    <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#767A7D' }}>Please fill out the form to start a conversation</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #EAEBED',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                        placeholder="Your name"
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #EAEBED',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                        placeholder="Your email address"
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>How can we help?</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #EAEBED',
                          borderRadius: '6px',
                          fontSize: '14px',
                          resize: 'none'
                        }}
                        placeholder="Type your message here..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#0989FF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      whileHover={{ backgroundColor: '#056ECE', scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Chat <Send size={16} />
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            {chatStarted && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                style={{
                  borderTop: '1px solid #EAEBED',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                {/* File upload options */}
                <AnimatePresence>
                  {showFileOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '12px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid #EAEBED',
                        padding: '8px',
                        display: 'flex',
                        gap: '4px',
                        zIndex: 10
                      }}
                    >
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      <input
                        type="file"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      
                      <motion.button
                        type="button"
                        onClick={() => document.getElementById('image-upload').click()}
                        style={{
                          padding: '8px',
                          backgroundColor: '#f0f9ff',
                          color: '#0989FF',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        whileHover={{ backgroundColor: '#e0f2fe', scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image size={16} />
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        onClick={() => document.getElementById('video-upload').click()}
                        style={{
                          padding: '8px',
                          backgroundColor: '#f0f9ff',
                          color: '#0989FF',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        whileHover={{ backgroundColor: '#e0f2fe', scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Video size={16} />
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        onClick={() => document.getElementById('file-upload').click()}
                        style={{
                          padding: '8px',
                          backgroundColor: '#f0f9ff',
                          color: '#0989FF',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        whileHover={{ backgroundColor: '#e0f2fe', scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FileText size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%', gap: '8px' }}>
                  <motion.button
                    type="button"
                    onClick={() => setShowFileOptions(!showFileOptions)}
                    style={{
                      backgroundColor: showFileOptions ? '#0989FF' : '#f6f7f9',
                      color: showFileOptions ? 'white' : '#0989FF',
                      border: '1px solid #EAEBED',
                      borderRadius: '6px',
                      padding: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    whileHover={{ 
                      backgroundColor: showFileOptions ? '#056ECE' : '#e0f2fe', 
                      scale: 1.05 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Paperclip size={18} />
                  </motion.button>
                  
                  <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #EAEBED',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <motion.button 
                    type="submit"
                    disabled={!message.trim()}
                    style={{
                      backgroundColor: '#0989FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px',
                      cursor: message.trim() ? 'pointer' : 'not-allowed',
                      opacity: message.trim() ? 1 : 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    whileHover={message.trim() ? { backgroundColor: '#056ECE', scale: 1.05 } : {}}
                    whileTap={message.trim() ? { scale: 0.95 } : {}}
                  >
                    <Send size={20} />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleChatWidget;
