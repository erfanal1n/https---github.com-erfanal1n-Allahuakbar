"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage, { Message } from "./chat-message";
import TypingIndicator from "./typing-indicator";

interface ChatConversationProps {
  isOpen: boolean;
  onNewMessage?: () => void;
}

const ChatConversation = ({ isOpen, onNewMessage }: ChatConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "system",
      content: "Thank you for contacting Shofy! 🛍️",
      timestamp: new Date(Date.now() - 30000).toISOString(),
    },
    {
      id: 2,
      type: "user",
      content: "Hey",
      timestamp: new Date(Date.now() - 25000).toISOString(),
    },
    {
      id: 3,
      type: "system",
      content: "Thank you for your message! Our team will get back to you shortly.",
      timestamp: new Date(Date.now() - 20000).toISOString(),
    },
    {
      id: 4,
      type: "user",
      content: "Ok",
      timestamp: new Date(Date.now() - 15000).toISOString(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(true);
  const isFirstRender = useRef(true);
  const [autoReplyStep, setAutoReplyStep] = useState(0);

  // Auto-reply messages
  const autoReplyMessages = [
    "We'll reach you ASAP! Our team typically responds within 2-3 minutes.",
    "In the meantime, feel free to browse our latest collections!",
    "Is there anything specific you're looking for today?"
  ];

  // Add auto-reply messages with delays
  useEffect(() => {
    const addAutoReply = () => {
      if (autoReplyStep < autoReplyMessages.length) {
        setTimeout(() => {
          setIsTyping(true);
          
          setTimeout(() => {
            const newMessage: Message = {
              id: Date.now() + autoReplyStep,
              type: "system",
              content: autoReplyMessages[autoReplyStep],
              timestamp: new Date().toISOString(),
            };
            
            setMessages(prev => [...prev, newMessage]);
            setIsTyping(false);
            setAutoReplyStep(prev => prev + 1);
          }, 1500); // Typing duration
        }, autoReplyStep === 0 ? 2000 : 4000); // Initial delay or between messages
      }
    };

    addAutoReply();
  }, [autoReplyStep, autoReplyMessages]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

  // Notify parent about new message when widget is closed
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isOpen && onNewMessage) {
      onNewMessage();
    }
  }, [messages, isOpen, onNewMessage]);

  // Scroll to bottom when messages change or widget opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // Fallback to ensure scroll happens even if initial attempt fails
        setTimeout(() => {
          if (messagesEndRef.current) {
            const parent = messagesEndRef.current.parentElement;
            if (parent && parent.scrollTop + parent.clientHeight < parent.scrollHeight - 10) {
              messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, 300);
      }, 200); // Increased delay to account for DOM updates and animations
    }
  }, [messages, isOpen]);

  // Enhanced parent container animation
  const container: any = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.1,
        ease: [0.25, 1, 0.5, 1]
      },
    },
  };

  return (
    <div 
      className="h-full p-4 overflow-y-auto"
      style={{
        background: 'var(--tp-grey-1, #F6F7F9)',
        fontFamily: "'Jost', sans-serif"
      }}
    >
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--tp-theme-primary, #0989FF) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3 relative z-10"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 1, 0.5, 1]
              }}
            >
              <ChatMessage 
                message={message}
                delay={index * 0.05} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Enhanced typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Dummy div for auto-scrolling */}
        <div ref={messagesEndRef} className="h-2" />
      </motion.div>
    </div>
  );
};

export default ChatConversation;
