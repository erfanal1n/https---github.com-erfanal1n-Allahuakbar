"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { conversations, messages, users } from "./mock-data";
import ChatMessage from "./chat-message";
import { MessageCircle, AlertCircle, MoreHorizontal, Image as ImageIcon, Pencil, MessageSquare, Send } from "lucide-react";

interface ChatWindowProps {
  activeConversation: number | null;
}

const ChatWindow = ({ activeConversation }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the active conversation
  const conversation = conversations.find((c) => c.id === activeConversation);
  
  // Get the other participant (customer/guest)
  const otherParticipant = conversation?.participants.find(
    (p) => p.role !== "admin"
  );
  
  // Get messages for this conversation
  const conversationMessages = messages.filter(
    (m) => m.conversationId === activeConversation
  );

  // Scroll to bottom when messages change or conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages, activeConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  if (!conversation || !otherParticipant) {
    return (
      <div className="h-full flex items-center justify-center text-text3">
        <div className="text-center">
          <div className="text-5xl mb-4">💬</div>
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-gray flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={otherParticipant.avatar}
              alt={otherParticipant.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                otherParticipant.status === "online"
                  ? "bg-success"
                  : otherParticipant.status === "away"
                  ? "bg-warning"
                  : "bg-gray"
              }`}
            ></span>
          </div>
          <div>
            <h4 className="font-medium">{otherParticipant.name}</h4>
            <p className="text-text3 text-xs">
              {otherParticipant.status === "online"
                ? "Online"
                : `Last seen ${otherParticipant.lastSeen}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-text3 hover:text-theme rounded-md hover:bg-gray5 transition-all hover:shadow-glow-sm">
            <MessageCircle size={20} />
          </button>
          <button className="p-2 text-text3 hover:text-theme rounded-md hover:bg-gray5 transition-all hover:shadow-glow-sm">
            <AlertCircle size={20} />
          </button>
          <button className="p-2 text-text3 hover:text-theme rounded-md hover:bg-gray5 transition-all hover:shadow-glow-sm">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            sender={users.find(u => u.id === message.senderId)!} 
            isAdmin={message.senderId === 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-gray p-3">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 text-text3 hover:text-theme rounded-md hover:bg-gray5 transition-all hover:shadow-glow-sm"
            >
              <ImageIcon size={20} />
            </button>
            <button
              type="button"
              className="p-2 text-text3 hover:text-theme rounded-md hover:bg-gray5 transition-all hover:shadow-glow-sm"
            >
              <Pencil size={20} />
            </button>
            <button
              type="button"
              className="p-2 text-text3 hover:text-theme rounded-md hover:bg-gray5 transition-all hover:shadow-glow-sm"
            >
              <MessageSquare size={20} />
            </button>
          </div>
          <input
            type="text"
            className="flex-1 input h-10 text-sm focus:ring-2 focus:ring-theme/20 transition-all"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-theme text-white p-2 rounded-md hover:bg-themeDark transition-all shadow-md hover:shadow-glow-theme"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </form>
        <div className="flex justify-end mt-2">
          <div className="text-xs text-text3">
            <span>Customer service mode</span>
            <span className="inline-flex items-center ml-2 mr-1 w-8 h-4 rounded-full bg-success relative cursor-pointer">
              <span className="inline-block w-3 h-3 transform translate-x-4 bg-white rounded-full"></span>
            </span>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
