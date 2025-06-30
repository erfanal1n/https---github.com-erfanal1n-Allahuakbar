"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import ChatWidgetBody from "./chat-widget-body";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (isOpen) {
      controls.start("open");
    } else {
      controls.start("closed");
    }
  }, [isOpen, controls]);

  const toggleWidget = () => {
    // If we're about to open the widget, clear unread count
    if (!isOpen) {
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  // Spring animation configuration for physics-based feel
  // Handler that will be called whenever a new message arrives while the widget
  // is closed. This bubbles up from the ChatConversation component.
  const handleNewMessage = () => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const springConfig = {
    type: "spring",
    damping: 20,
    stiffness: 300,
    mass: 0.8
  };

  return (
    <div className="fixed bottom-5 left-5 z-50" style={{ fontFamily: "'Jost', sans-serif" }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={springConfig}
            className="w-[380px] h-[520px] bg-white rounded-lg shadow-2xl flex flex-col mb-4"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(234, 235, 237, 0.5)',
            }}
          >
            {/* Header with staggered animation */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, ...springConfig }}
              className="text-white p-4 rounded-t-lg flex justify-between items-center"
              style={{
                background: 'var(--tp-theme-primary, #0989FF)',
                fontFamily: "'Jost', sans-serif"
              }}
            >
              <motion.h3 
                className="font-bold text-lg"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                style={{ fontWeight: 700 }}
              >
                Chat with us
              </motion.h3>
              <motion.button 
                onClick={toggleWidget} 
                className="hover:text-gray-300 transition-colors duration-200 p-1 rounded-md"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            {/* Chat body with waterfall animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...springConfig }}
              className="flex-1"
            >
              <ChatWidgetBody isOpen={isOpen} onNewMessage={handleNewMessage} />
            </motion.div>

            {/* Input area with final staggered animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, ...springConfig }}
              className="p-4"
              style={{
                borderTop: '1px solid var(--tp-border-primary, #EAEBED)'
              }}
            >
              <div className="flex items-center gap-3">
                <motion.input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-3 rounded-md transition-all duration-200 outline-none"
                  style={{
                    border: '1px solid var(--tp-border-primary, #EAEBED)',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '14px'
                  }}
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: '0 0 0 3px rgba(9, 137, 255, 0.1)',
                    borderColor: 'var(--tp-theme-primary, #0989FF)'
                  }}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                />
                <motion.button 
                  className="text-white p-3 rounded-md transition-all duration-200 shadow-md"
                  style={{
                    background: 'var(--tp-theme-primary, #0989FF)',
                    fontFamily: "'Jost', sans-serif"
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 6px 20px rgba(9, 137, 255, 0.4)',
                    backgroundColor: 'var(--tp-common-black, #010F1C)'
                  }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Send size={18} />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with enhanced tech cool animations */}
      <motion.button
        onClick={toggleWidget}
        className="text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'var(--tp-theme-primary, #0989FF)',
          fontFamily: "'Jost', sans-serif"
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: [0, -5, 5, 0],
          boxShadow: [
            '0 0 30px rgba(9, 137, 255, 0.8)',
            '0 0 60px rgba(9, 137, 255, 0.6)',
            '0 0 30px rgba(9, 137, 255, 0.8)'
          ],
          backgroundColor: 'var(--tp-common-black, #010F1C)',
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
          className="absolute inset-0 rounded-full"
          style={{
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
          className="absolute inset-1 rounded-full"
          style={{
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
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
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
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "x" : "message"}
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "backOut" }}
            className="relative z-10"
          >
            <motion.div
              whileHover={{
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {isOpen ? <X size={28} /> : <MessageCircle size={28} />}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 bg-red-500 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {unreadCount}
          </motion.div>
        )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatWidget;
