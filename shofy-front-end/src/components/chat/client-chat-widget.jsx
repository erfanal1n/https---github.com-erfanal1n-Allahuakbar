'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const ClientChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

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
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, you would send the message to the server
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="absolute bottom-16 right-0 w-[350px] h-[500px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-[#0989FF] text-white p-4 flex justify-between items-center"
            >
              <h3 className="font-bold text-lg">Chat with us</h3>
              <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                <X size={20} />
              </button>
            </motion.div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {chatStarted ? (
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-[#F6F7F9] rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Hi {formData.name}! How can we help you today?</p>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-[#0989FF] rounded-full mx-auto flex items-center justify-center mb-3">
                      <MessageCircle size={30} className="text-white" />
                    </div>
                    <h4 className="font-bold">Welcome to Shofy Support</h4>
                    <p className="text-sm text-gray-500">Please fill out the form to start a conversation</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Your email address"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm mb-1">How can we help?</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        required
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Type your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0989FF] text-white py-3 rounded-md font-medium"
                    >
                      Start Chat
                    </button>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            {chatStarted && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="p-3 border-t border-gray-200"
              >
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#0989FF] text-white p-2 rounded-md"
                    disabled={!message.trim()}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0989FF] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(9, 137, 255, 0.6)" }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1.5,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "x" : "message"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ClientChatWidget;
