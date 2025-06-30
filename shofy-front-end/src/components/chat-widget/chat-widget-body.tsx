"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot } from "lucide-react";
import PreChatForm from "./pre-chat-form";
import ChatConversation from "./chat-conversation";

interface ChatWidgetBodyProps {
  isOpen: boolean;
  onNewMessage?: () => void;
}

const ChatWidgetBody = ({ isOpen, onNewMessage }: ChatWidgetBodyProps) => {
  const [chatStarted, setChatStarted] = useState(false);
  const [showAutoReply, setShowAutoReply] = useState(false);
  
  const startChat = () => {
    setChatStarted(true);
    // Show auto-reply after a delay
    setTimeout(() => {
      setShowAutoReply(true);
    }, 1500);
  };

  // Auto-reply messages
  const autoReplyMessages = [
    "Thank you for contacting Shofy! 🛍️",
    "We'll reach you ASAP! Our team typically responds within 2-3 minutes.",
    "In the meantime, feel free to browse our latest collections!"
  ];

  return (
    <div 
      className="flex-1 overflow-hidden" 
      style={{ 
        fontFamily: "'Jost', sans-serif",
        background: 'var(--tp-grey-1, #F6F7F9)'
      }}
    >
      <AnimatePresence mode="wait">
        {chatStarted ? (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 1, 0.5, 1]
            }}
          >
            <ChatConversation isOpen={isOpen} onNewMessage={onNewMessage} />
          </motion.div>
        ) : (
          <motion.div
            key="prechat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 1, 0.5, 1]
            }}
          >
            <PreChatForm onStartChat={startChat} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidgetBody;
