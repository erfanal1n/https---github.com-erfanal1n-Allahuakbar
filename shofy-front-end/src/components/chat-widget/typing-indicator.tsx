"use client";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const TypingIndicator = () => {
  // Enhanced variants for container animation
  const container = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24
      },
    },
  };

  // Enhanced variants for dot animation with wave effect
  const dot = {
    hidden: { y: 0, scale: 0.8, opacity: 0.5 },
    show: {
      y: [0, -8, 0],
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 0.9,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, x: -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 15, x: -10 }}
      className="flex items-start gap-3 p-3"
      style={{ fontFamily: "'Jost', sans-serif" }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Avatar with animated effects */}
      <motion.div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 overflow-hidden border-2"
        style={{
          borderColor: 'var(--tp-theme-primary, #0989FF)',
          backgroundImage: 'url(https://i.pravatar.cc/100?img=68)',
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

      {/* Enhanced Typing bubble with gradient and animation */}
      <motion.div 
        className="px-4 py-3 rounded-2xl shadow-sm max-w-[120px] relative"
        style={{
          background: 'var(--tp-grey-1, #F6F7F9)',
          border: '1px solid var(--tp-border-primary, #EAEBED)',
          borderRadius: '16px 16px 16px 4px',
          backgroundImage: 'linear-gradient(145deg, #f8faff 0%, #f6f7f9 100%)',
        }}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          boxShadow: [
            '0 2px 8px rgba(9, 137, 255, 0.1)',
            '0 4px 16px rgba(9, 137, 255, 0.2)',
            '0 2px 8px rgba(9, 137, 255, 0.1)'
          ]
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.25, 1, 0.5, 1],
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{
          scale: 1.08,
          rotate: [-1, 1, -1],
          boxShadow: '0 6px 20px rgba(9, 137, 255, 0.15)',
          transition: {
            rotate: {
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }}
      >
        {/* Animated dots with improved wave effect */}
        <motion.div
          className="flex items-center justify-center gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #0989FF 0%, #0971FF 100%)',
                boxShadow: '0 2px 5px rgba(9, 137, 255, 0.3)'
              }}
              variants={dot}
              animate={{
                y: [0, -8, 0],
                scale: [0.8, 1.3, 0.8],
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
        </motion.div>
        
        {/* Improved typing text with glow effect */}
        <motion.div 
          className="text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            y: [0, -2, 0]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.span 
            className="text-[10px] font-medium relative inline-block"
            style={{
              color: 'var(--tp-theme-primary, #0989FF)',
              fontFamily: "'Jost', sans-serif",
              textShadow: '0 0 5px rgba(9, 137, 255, 0.2)'
            }}
            animate={{
              textShadow: [
                '0 0 3px rgba(9, 137, 255, 0.1)',
                '0 0 6px rgba(9, 137, 255, 0.3)',
                '0 0 3px rgba(9, 137, 255, 0.1)'
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            typing...
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TypingIndicator;
