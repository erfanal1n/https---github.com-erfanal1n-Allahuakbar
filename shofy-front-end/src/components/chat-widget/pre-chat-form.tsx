"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Send, MessageCircle } from "lucide-react";

interface PreChatFormProps {
  onStartChat: () => void;
}

const PreChatForm = ({ onStartChat }: PreChatFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartChat();
  };

  // Enhanced staggered animation for form elements
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    show: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 0.8
      }
    },
  };

  return (
    <div 
      className="p-6 h-full overflow-y-auto"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* Enhanced header section */}
        <motion.div variants={item} className="text-center mb-8">
          <motion.div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 text-white"
            style={{
              background: 'var(--tp-theme-primary, #0989FF)'
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 8px 25px rgba(9, 137, 255, 0.4)",
              backgroundColor: 'var(--tp-common-black, #010F1C)'
            }}
            animate={{
              boxShadow: [
                '0 4px 20px rgba(9, 137, 255, 0.2)',
                '0 8px 30px rgba(9, 137, 255, 0.4)',
                '0 4px 20px rgba(9, 137, 255, 0.2)'
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
            <MessageCircle size={36} />
          </motion.div>
          <motion.h4 
            className="text-xl font-bold mb-2"
            style={{
              color: 'var(--tp-heading-primary, #010F1C)',
              fontWeight: 700,
              fontFamily: "'Jost', sans-serif"
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Welcome to Shofy Support
          </motion.h4>
          <motion.p 
            className="text-sm leading-relaxed"
            style={{
              color: 'var(--tp-text-body, #55585B)',
              fontFamily: "'Jost', sans-serif"
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Please fill out the form to start a conversation with our team
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field with enhanced styling */}
          <motion.div variants={item}>
            <label 
              htmlFor="name" 
              className="block mb-2 text-sm font-medium"
              style={{
                color: 'var(--tp-heading-primary, #010F1C)',
                fontFamily: "'Jost', sans-serif"
              }}
            >
              Your Name *
            </label>
            <div className="relative">
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md py-3 px-4 pr-12 outline-none transition-all duration-200"
                style={{
                  border: '1px solid var(--tp-border-primary, #EAEBED)',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '14px'
                }}
                placeholder="Enter your full name"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: '0 0 0 3px rgba(9, 137, 255, 0.1)',
                  borderColor: 'var(--tp-theme-primary, #0989FF)'
                }}
              />
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--tp-text-5, #888A8C)' }}
                whileHover={{ 
                  color: 'var(--tp-theme-primary, #0989FF)',
                  scale: 1.1
                }}
              >
                <User size={18} />
              </motion.div>
            </div>
          </motion.div>

          {/* Email field with enhanced styling */}
          <motion.div variants={item}>
            <label 
              htmlFor="email" 
              className="block mb-2 text-sm font-medium"
              style={{
                color: 'var(--tp-heading-primary, #010F1C)',
                fontFamily: "'Jost', sans-serif"
              }}
            >
              Email Address *
            </label>
            <div className="relative">
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md py-3 px-4 pr-12 outline-none transition-all duration-200"
                style={{
                  border: '1px solid var(--tp-border-primary, #EAEBED)',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '14px'
                }}
                placeholder="Enter your email address"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: '0 0 0 3px rgba(9, 137, 255, 0.1)',
                  borderColor: 'var(--tp-theme-primary, #0989FF)'
                }}
              />
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--tp-text-5, #888A8C)' }}
                whileHover={{ 
                  color: 'var(--tp-theme-primary, #0989FF)',
                  scale: 1.1
                }}
              >
                <Mail size={18} />
              </motion.div>
            </div>
          </motion.div>

          {/* Message field with enhanced styling */}
          <motion.div variants={item}>
            <label 
              htmlFor="message" 
              className="block mb-2 text-sm font-medium"
              style={{
                color: 'var(--tp-heading-primary, #010F1C)',
                fontFamily: "'Jost', sans-serif"
              }}
            >
              How can we help you? *
            </label>
            <motion.textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              required
              className="w-full rounded-md py-3 px-4 outline-none transition-all duration-200 resize-none"
              style={{
                border: '1px solid var(--tp-border-primary, #EAEBED)',
                fontFamily: "'Jost', sans-serif",
                fontSize: '14px'
              }}
              placeholder="Describe your question or issue..."
              whileFocus={{
                scale: 1.02,
                boxShadow: '0 0 0 3px rgba(9, 137, 255, 0.1)',
                borderColor: 'var(--tp-theme-primary, #0989FF)'
              }}
            />
          </motion.div>

          {/* Enhanced submit button */}
          <motion.button
            variants={item}
            type="submit"
            className="w-full py-3 px-6 rounded-md font-medium text-white flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: 'var(--tp-theme-primary, #0989FF)',
              fontFamily: "'Jost', sans-serif",
              fontSize: '16px',
              fontWeight: 500
            }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: '0 6px 20px rgba(9, 137, 255, 0.4)',
              backgroundColor: 'var(--tp-common-black, #010F1C)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              whileHover={{ x: -2 }}
            >
              Start Chat
            </motion.span>
            <motion.div
              whileHover={{
                x: 2,
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 0.3 }}
            >
              <Send size={18} />
            </motion.div>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default PreChatForm;
