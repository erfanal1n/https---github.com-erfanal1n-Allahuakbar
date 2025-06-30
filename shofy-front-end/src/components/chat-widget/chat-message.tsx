"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Link, User, Bot } from "lucide-react";

interface MessageLink {
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface Message {
  id: number;
  type: "system" | "user";
  content: string;
  timestamp: string;
  link?: MessageLink;
}

interface MessageProps {
  message: Message;
  delay?: number;
}

const ChatMessage = ({ message, delay = 0 }: MessageProps) => {
  const isSystem = message.type === "system";
  const isUser = message.type === "user";
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check if the content is a URL (for rendering link previews)
  const isUrl = message.content.match(/^(http|https):\/\/[^\s]+$/);

  // Enhanced animation variants
    const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      x: isSystem ? -20 : 20 // Left for system, right for user
    },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 0.8,
        delay 
      } 
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className={`flex items-start gap-3 ${isSystem ? "justify-start" : "justify-end"} mb-4 ${isSystem ? "" : "flex-row-reverse"}`}
      >
        {/* Avatar with premium effects */}
        <motion.div 
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 overflow-hidden border-2`}
          style={{
            borderColor: isSystem 
              ? 'var(--tp-theme-primary, #0989FF)' 
              : 'var(--tp-theme-secondary, #821F40)',
            backgroundImage: isSystem 
              ? 'url(https://i.pravatar.cc/100?img=68)' 
              : 'url(https://i.pravatar.cc/100?img=45)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'  
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: isSystem ? [0, -5, 5, 0] : [0, 5, -5, 0],
            borderWidth: '3px',
            boxShadow: isSystem 
              ? '0 0 15px rgba(9, 137, 255, 0.4)' 
              : '0 0 15px rgba(130, 31, 64, 0.4)',
            transition: {
              duration: 0.3,
              rotate: {
                duration: 0.5,
                ease: "easeInOut"
              }
            }  
          }}
        />

        {/* Message bubble with enhanced hover effects */}
        <motion.div
          className={`max-w-[75%] relative ${isSystem ? "" : "ml-auto"}`}
          whileHover={{
            scale: 1.03,
            y: -3,
            x: isSystem ? 3 : -3, // Move slightly right for system, left for user
            boxShadow: isSystem 
              ? '0 10px 25px rgba(9, 137, 255, 0.2)' 
              : '0 10px 25px rgba(130, 31, 64, 0.2)',
            transition: { 
              duration: 0.3, 
              ease: [0.25, 1, 0.5, 1] 
            }
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
        >
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200`}
            style={{
              backgroundColor: isSystem 
                ? 'var(--tp-grey-1, #F6F7F9)' 
                : 'var(--tp-theme-primary, #0989FF)',
              color: isSystem 
                ? 'var(--tp-heading-primary, #010F1C)' 
                : 'white',
              border: isSystem 
                ? '1px solid var(--tp-border-primary, #EAEBED)' 
                : 'none',
              borderRadius: isSystem 
                ? '16px 16px 16px 4px' 
                : '16px 16px 4px 16px' // Round the bottom-left corner for system, bottom-right for user
            }}
          >
            {message.link ? (
              /* Enhanced Link Preview */
              <motion.div 
                className="bg-white rounded-lg overflow-hidden shadow-sm"
                style={{
                  border: '1px solid var(--tp-border-primary, #EAEBED)'
                }}
                whileHover={{
                  borderColor: 'var(--tp-theme-primary, #0989FF)',
                  boxShadow: '0 4px 15px rgba(9, 137, 255, 0.1)'
                }}
              >
                {message.link.image && (
                  <div className="relative h-32 w-full">
                    <Image
                      src={message.link.image}
                      alt={message.link.title}
                      fill
                      sizes="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h5 
                    className="font-bold mb-2 text-sm"
                    style={{
                      color: 'var(--tp-heading-primary, #010F1C)',
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {message.link.title}
                  </h5>
                  <p 
                    className="text-xs mb-3 line-clamp-2 leading-relaxed"
                    style={{
                      color: 'var(--tp-text-body, #55585B)',
                      fontFamily: "'Jost', sans-serif"
                    }}
                  >
                    {message.link.description}
                  </p>
                  <motion.div 
                    className="flex items-center text-xs"
                    style={{ color: 'var(--tp-theme-primary, #0989FF)' }}
                    whileHover={{ x: 2 }}
                  >
                    <Link size={12} className="mr-2" />
                    <span className="truncate font-medium">{message.link.url}</span>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* Regular message */
              <div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "'Jost', sans-serif"
                  }}
                >
                  {message.content}
                </p>
                <div className={`mt-2 ${isSystem ? 'text-left' : 'text-right'}`}>
                  <span 
                    className="text-[10px] opacity-70"
                    style={{
                      color: isSystem 
                        ? 'var(--tp-text-5, #888A8C)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      fontFamily: "'Jost', sans-serif"
                    }}
                  >
                    {formattedTime}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatMessage;
